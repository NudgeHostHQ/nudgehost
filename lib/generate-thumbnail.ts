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
// All text is drawn by building an SVG string and rasterizing it with
// sharp(Buffer.from(svg)).png(). We deliberately do NOT use libvips' Pango text
// API (sharp's `text:` input): on Vercel's serverless runtime the named font
// families fail to resolve and Pango renders tiny, unreadable glyph boxes. SVG
// text falls back to a default sans/serif face that is always present, so the
// cards stay legible on any host.

const WIDTH = 1200;
const HEIGHT = 630;
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf0, alpha: 1 };
const CREAM_HEX = "#FBF7F0";
const CHARCOAL = "#2C2824";
const CORAL = "#E8704A";

// Font stacks. The first name is the brand face we use at build time; the
// generic family at the end is what actually resolves on Vercel, and that is
// fine because the card design only depends on the colours and layout.
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

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

// Escape text for safe inclusion inside SVG/XML markup.
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Greedy word-wrap into at most `maxLines` lines of roughly `maxChars` each.
// Single tokens longer than the budget (long filenames with no spaces) are
// hard-broken; anything past the last line is truncated with an ellipsis.
function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const flush = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  for (let word of words) {
    while (word.length > maxChars) {
      flush();
      lines.push(word.slice(0, maxChars));
      word = word.slice(maxChars);
    }
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word;
    } else {
      flush();
      current = word;
    }
  }
  flush();

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    const last = kept[maxLines - 1];
    kept[maxLines - 1] =
      last.slice(0, Math.max(0, maxChars - 1)).trimEnd() + "…";
    return kept;
  }
  return lines;
}

type RenderedImage = { data: Buffer; width: number; height: number };

// A white pill with the nudgehost wordmark, for overlaying on image and PDF
// thumbnails where the underlying content would otherwise swallow plain text.
async function wordmarkBadge(): Promise<RenderedImage> {
  const w = 230;
  const h = 64;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${h / 2}" fill="#FFFFFF" fill-opacity="0.92"/><text x="${w / 2}" y="42" text-anchor="middle" font-family="${SERIF}" font-size="30" font-weight="700"><tspan fill="${CHARCOAL}">nudge</tspan><tspan fill="${CORAL}">host</tspan></text></svg>`;
  const out = await sharp(Buffer.from(svg))
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data: out.data, width: out.info.width, height: out.info.height };
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
// all non-previewable types. Rendered entirely as an SVG so text stays crisp
// and readable regardless of which fonts the host happens to have installed.
async function brandCard(title: string, label: string): Promise<Buffer> {
  const cleanTitle =
    title.replace(/\s+/g, " ").trim().slice(0, 140) || "Untitled file";
  const titleLines = wrapText(cleanTitle, 38, 2);

  const titleStartY = 432;
  const titleLineHeight = 58;
  const titleEls = titleLines
    .map(
      (line, i) =>
        `<text x="${WIDTH / 2}" y="${titleStartY + i * titleLineHeight}" text-anchor="middle" font-family="${SANS}" font-size="46" font-weight="600" fill="${CHARCOAL}">${escapeXml(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CREAM_HEX}"/>
  <text x="64" y="90" font-family="${SERIF}" font-size="46" font-weight="700"><tspan fill="${CHARCOAL}">nudge</tspan><tspan fill="${CORAL}">host</tspan></text>
  <rect x="64" y="106" width="96" height="6" rx="3" fill="${CORAL}"/>
  <text x="${WIDTH / 2}" y="320" text-anchor="middle" font-family="${SANS}" font-size="132" font-weight="800" fill="${CORAL}">${escapeXml(label.toUpperCase())}</text>
  ${titleEls}
</svg>`;

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
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
