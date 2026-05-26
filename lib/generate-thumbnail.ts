import "server-only";
import sharp from "sharp";

// Generates a 1200x630 PNG og:image thumbnail for a shared file, branded with
// the NudgeHost palette. Behaviour per type:
//
//   image/*           resize to fit, with a wordmark watermark in the corner
//   application/pdf   render page 1 (pdfjs + canvas), placed on the brand canvas
//   text/html         a branded card showing the <title> (no screenshot)
//   everything else   a branded card showing the filename and a type label
//
// Every path is guarded. generateThumbnail never throws; it returns null when a
// thumbnail could not be produced, and callers fall back to the sitewide
// og-image.png.
//
// All text is drawn with @napi-rs/canvas using a font we register explicitly
// from disk (LiberationSans, shipped inside pdfjs-dist). We deliberately do NOT
// rely on system fonts here. Both sharp's Pango text API and librsvg's SVG
// <text> fall back to fontconfig, and on Vercel's serverless runtime there is
// no usable face, so text renders as tofu boxes or vanishes. Registering the
// font bytes ourselves means skia draws real glyphs regardless of the host.

const WIDTH = 1200;
const HEIGHT = 630;
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf0, alpha: 1 };
const CREAM_HEX = "#FBF7F0";
const CHARCOAL = "#2C2824";
const CORAL = "#E8704A";

// File types whose bytes we actually need to read to build the thumbnail.
// Everything else gets a card built from the filename alone, so the caller can
// skip fetching the (potentially large) source file from storage.
export function needsFileBytes(mimeType: string): boolean {
  const mime = mimeType.toLowerCase();
  return (
    mime.startsWith("image/") ||
    mime === "application/pdf" ||
    mime === "text/html"
  );
}

type CanvasModule = typeof import("@napi-rs/canvas");
type Canvas2D = ReturnType<
  ReturnType<CanvasModule["createCanvas"]>["getContext"]
>;
type RenderedImage = { data: Buffer; width: number; height: number };

// Registered font family names, or a generic fallback if the files are missing.
type Faces = { regular: string; bold: string };
let registeredFaces: Faces | null = null;

// Register LiberationSans (regular + bold) once, aliased to our own family
// names so a plain `<size>px NHSans` request resolves to the exact face we
// loaded. The TTFs live in pdfjs-dist/standard_fonts, which is a server-external
// package that stays on disk at runtime (the PDF path reads the same dir), so
// this works on Vercel. Falls back to sans-serif if anything is off.
async function ensureFaces(canvasMod: CanvasModule): Promise<Faces> {
  if (registeredFaces) return registeredFaces;
  const fallback: Faces = { regular: "sans-serif", bold: "sans-serif" };
  try {
    const path = await import("node:path");
    const { existsSync } = await import("node:fs");
    const dir = path.join(
      process.cwd(),
      "node_modules",
      "pdfjs-dist",
      "standard_fonts",
    );
    const regular = path.join(dir, "LiberationSans-Regular.ttf");
    const bold = path.join(dir, "LiberationSans-Bold.ttf");
    if (
      existsSync(regular) &&
      existsSync(bold) &&
      canvasMod.GlobalFonts.registerFromPath(regular, "NHSans") &&
      canvasMod.GlobalFonts.registerFromPath(bold, "NHSansBold")
    ) {
      registeredFaces = { regular: "NHSans", bold: "NHSansBold" };
      return registeredFaces;
    }
  } catch {
    // fall through to the generic family
  }
  return fallback;
}

// Greedy word-wrap measured against the actual font metrics. Single tokens
// wider than the budget (long filenames with no spaces) are hard-broken on a
// character boundary; overflow past the last line ends with an ellipsis.
function wrapToWidth(
  ctx: Canvas2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const fits = (s: string) => ctx.measureText(s).width <= maxWidth;
  const lines: string[] = [];
  let current = "";

  for (let word of words(text)) {
    while (!fits(word) && word.length > 1) {
      // Binary-search the longest prefix of this word that still fits.
      let lo = 1;
      let hi = word.length;
      let cut = 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (fits(word.slice(0, mid))) {
          cut = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(word.slice(0, cut));
      word = word.slice(cut);
    }
    const candidate = current ? `${current} ${word}` : word;
    if (fits(candidate)) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 0 && !fits(`${last}…`)) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last.replace(/\s+$/, "")}…`;
    return kept;
  }
  return lines;
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// A white pill with the nudgehost wordmark, for overlaying on image and PDF
// thumbnails where the underlying content would otherwise swallow plain text.
async function wordmarkBadge(): Promise<RenderedImage> {
  const canvasMod = await import("@napi-rs/canvas");
  const faces = await ensureFaces(canvasMod);
  const fontSize = 30;

  // Measure the wordmark on a throwaway context to size the pill around it.
  const probe = canvasMod.createCanvas(8, 8).getContext("2d");
  probe.font = `${fontSize}px ${faces.bold}`;
  const textW = probe.measureText("nudgehost").width;

  const padX = 26;
  const padY = 15;
  const w = Math.ceil(textW + padX * 2);
  const h = fontSize + padY * 2;

  const canvas = canvasMod.createCanvas(w, h);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, h / 2);
  ctx.fill();

  ctx.font = `${fontSize}px ${faces.bold}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const baselineY = h / 2 + 1;
  let x = padX;
  ctx.fillStyle = CHARCOAL;
  ctx.fillText("nudge", x, baselineY);
  x += ctx.measureText("nudge").width;
  ctx.fillStyle = CORAL;
  ctx.fillText("host", x, baselineY);

  return { data: canvas.toBuffer("image/png"), width: w, height: h };
}

// Place an already-rasterized image (a resized photo or a rendered PDF page)
// onto the cream brand canvas, centered, with the wordmark badge bottom-right.
async function placeOnBrandCanvas(imageBuffer: Buffer): Promise<Buffer> {
  const fitted = await sharp(imageBuffer)
    .resize(WIDTH - 80, HEIGHT - 80, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((WIDTH - fitted.info.width) / 2);
  const top = Math.round((HEIGHT - fitted.info.height) / 2);
  const badge = await wordmarkBadge();

  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: CREAM },
  })
    .composite([
      { input: fitted.data, left, top },
      {
        input: badge.data,
        left: WIDTH - badge.width - 28,
        top: HEIGHT - badge.height - 28,
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// A branded card: cream background, wordmark top-left, a big coral type label
// centered, and the title wrapped and centered beneath it. Used for HTML and
// all non-previewable types. Drawn entirely with canvas + a registered font, so
// the text is legible regardless of which fonts the host has installed.
async function brandCard(title: string, label: string): Promise<Buffer> {
  const canvasMod = await import("@napi-rs/canvas");
  const faces = await ensureFaces(canvasMod);

  const canvas = canvasMod.createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = CREAM_HEX;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Wordmark, top-left.
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `46px ${faces.bold}`;
  let x = 64;
  const wordmarkY = 92;
  ctx.fillStyle = CHARCOAL;
  ctx.fillText("nudge", x, wordmarkY);
  x += ctx.measureText("nudge").width;
  ctx.fillStyle = CORAL;
  ctx.fillText("host", x, wordmarkY);

  // Coral accent under the wordmark.
  ctx.fillStyle = CORAL;
  ctx.fillRect(64, 104, 96, 6);

  // Big centered type label.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `130px ${faces.bold}`;
  ctx.fillStyle = CORAL;
  ctx.fillText(label.toUpperCase(), WIDTH / 2, 300);

  // Title / filename, wrapped to at most two centered lines.
  ctx.font = `46px ${faces.regular}`;
  const cleanTitle =
    title.replace(/\s+/g, " ").trim().slice(0, 140) || "Untitled file";
  const lines = wrapToWidth(ctx, cleanTitle, WIDTH - 160, 2);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = CHARCOAL;
  const lineHeight = 60;
  const startY = lines.length > 1 ? 440 : 462;
  lines.forEach((line, i) => {
    ctx.fillText(line, WIDTH / 2, startY + i * lineHeight);
  });

  return canvas.toBuffer("image/png");
}

// Resize a user image to fit the card, watermarked. Throws on a corrupt image,
// which the dispatcher catches.
async function imageThumbnail(buffer: Buffer): Promise<Buffer> {
  // Flatten onto cream so transparent PNGs don't render on a black box, and
  // take the first frame of an animated GIF/WebP.
  const flattened = await sharp(buffer, { animated: false })
    .flatten({ background: CREAM })
    .png()
    .toBuffer();
  return placeOnBrandCanvas(flattened);
}

// Render the first page of a PDF to a PNG using pdfjs-dist + @napi-rs/canvas.
// Returns null on any failure so the dispatcher can fall back to a card.
async function pdfFirstPagePng(buffer: Buffer): Promise<Buffer | null> {
  try {
    const canvasMod = await import("@napi-rs/canvas");
    const { createCanvas, DOMMatrix, Path2D, ImageData } = canvasMod;
    // pdfjs expects these as globals when running outside a browser.
    const g = globalThis as unknown as Record<string, unknown>;
    g.DOMMatrix ??= DOMMatrix;
    g.Path2D ??= Path2D;
    g.ImageData ??= ImageData;

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Standard-font glyph data ships inside the package. Resolving from cwd
    // works because pdfjs-dist is a server-external package, so it stays on
    // disk in node_modules at runtime rather than being bundled.
    const path = await import("node:path");
    const { existsSync } = await import("node:fs");
    const fontDir = path.join(
      process.cwd(),
      "node_modules",
      "pdfjs-dist",
      "standard_fonts",
    );

    const doc = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
      useSystemFonts: false,
      ...(existsSync(fontDir) ? { standardFontDataUrl: fontDir + path.sep } : {}),
    }).promise;

    const page = await doc.getPage(1);
    // Scale page 1 so its longest side is generous enough to look crisp once
    // it's fitted into the 1200x630 canvas.
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(2000 / base.width, 2000 / base.height, 3);
    const viewport = page.getViewport({ scale: Math.max(scale, 1) });

    const canvas = createCanvas(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    );
    const ctx = canvas.getContext("2d");
    // White page behind the content so a transparent PDF doesn't go dark.
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      // @napi-rs/canvas's 2D context is compatible with what pdfjs needs.
      canvasContext: ctx as unknown as Parameters<
        typeof page.render
      >[0]["canvasContext"],
      viewport,
    }).promise;

    const png = canvas.toBuffer("image/png");
    await doc.cleanup();
    return png;
  } catch {
    return null;
  }
}

function extractHtmlTitle(buffer: Buffer): string | null {
  // Only need the <head>; cap the decode so a huge HTML file stays cheap.
  const head = buffer.subarray(0, 200 * 1024).toString("utf8");
  const match = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  const title = match[1]
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
  return title.length > 0 ? title : null;
}

// A short, uppercase type token used as the big centered label on a brand card
// ("HTML", "PDF", "DOCX", "ZIP", ...). Kept terse so it reads as a hero label.
function shortLabel(mimeType: string, filename: string): string {
  const mime = mimeType.toLowerCase();
  if (mime === "application/pdf") return "PDF";
  if (mime === "text/html") return "HTML";
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime.startsWith("audio/")) return "AUDIO";

  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (ext && ext.length <= 5 && /^[a-z0-9]+$/.test(ext)) {
    return ext.toUpperCase();
  }
  return "FILE";
}

export async function generateThumbnail(opts: {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}): Promise<Buffer | null> {
  const { buffer, mimeType, filename } = opts;
  const mime = mimeType.toLowerCase();

  try {
    if (mime.startsWith("image/") && buffer.length > 0) {
      try {
        return await imageThumbnail(buffer);
      } catch {
        return await brandCard(filename, "IMAGE");
      }
    }

    if (mime === "application/pdf" && buffer.length > 0) {
      const page = await pdfFirstPagePng(buffer);
      if (page) {
        try {
          return await placeOnBrandCanvas(page);
        } catch {
          // fall through to the card
        }
      }
      return await brandCard(filename, "PDF");
    }

    if (mime === "text/html") {
      const title = (buffer.length > 0 && extractHtmlTitle(buffer)) || filename;
      return await brandCard(title, "HTML");
    }

    return await brandCard(filename, shortLabel(mime, filename));
  } catch {
    // Total failure: signal the caller to use the sitewide og-image fallback.
    return null;
  }
}
