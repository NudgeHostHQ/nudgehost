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
// og-image.png. Text is rendered with libvips' Pango support (same approach as
// scripts/generate-og-image.mjs) using generic font families so it resolves on
// any host, not just machines that happen to have Georgia installed.

const WIDTH = 1200;
const HEIGHT = 630;
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf0, alpha: 1 };
const CHARCOAL = "#2C2824";
const CORAL = "#E8704A";
const MUTED = "#7A6F65";

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

// Escape text for inclusion inside Pango markup.
function escapeMarkup(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type RenderedText = { data: Buffer; width: number; height: number };

async function renderText(
  markup: string,
  font: string,
  opts: { width?: number; align?: "left" | "centre" } = {},
): Promise<RenderedText> {
  const out = await sharp({
    text: {
      text: markup,
      font,
      rgba: true,
      dpi: 72,
      ...(opts.width ? { width: opts.width } : {}),
      ...(opts.align ? { align: opts.align } : {}),
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data: out.data, width: out.info.width, height: out.info.height };
}

const wordmarkMarkup = `<span foreground="${CHARCOAL}">nudge</span><span foreground="${CORAL}">host</span>`;

// A white pill with the nudgehost wordmark, for overlaying on image and PDF
// thumbnails where the underlying content would otherwise swallow plain text.
async function wordmarkBadge(): Promise<RenderedText> {
  const wm = await renderText(wordmarkMarkup, "serif Bold 30");
  const padX = 22;
  const padY = 13;
  const pillW = wm.width + padX * 2;
  const pillH = wm.height + padY * 2;
  const pill = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pillW}" height="${pillH}"><rect width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="#FFFFFF" fill-opacity="0.92"/></svg>`,
  );
  const out = await sharp({
    create: {
      width: pillW,
      height: pillH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: pill, top: 0, left: 0 },
      { input: wm.data, top: padY, left: padX },
    ])
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

// A branded card: cream background, wordmark top-left, a coral type label, and
// the title wrapped beneath it. Used for HTML and all non-previewable types.
async function brandCard(title: string, label: string): Promise<Buffer> {
  const safeTitle = escapeMarkup(title.slice(0, 120).trim() || "Untitled file");
  const wordmark = await renderText(wordmarkMarkup, "serif Bold 46");
  const accent = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="6"><rect width="96" height="6" rx="3" fill="${CORAL}"/></svg>`,
  );
  const labelText = await renderText(
    `<span foreground="${CORAL}">${escapeMarkup(label.toUpperCase())}</span>`,
    "sans-serif Bold 26",
  );
  const titleText = await renderText(
    `<span foreground="${CHARCOAL}">${safeTitle}</span>`,
    "serif 64",
    { width: WIDTH - 128, align: "left" },
  );
  const footer = await renderText(
    `<span foreground="${MUTED}">Shared via NudgeHost</span>`,
    "sans-serif 22",
  );

  return sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: CREAM },
  })
    .composite([
      { input: wordmark.data, left: 64, top: 56 },
      { input: accent, left: 64, top: 56 + wordmark.height + 18 },
      { input: labelText.data, left: 64, top: 232 },
      { input: titleText.data, left: 64, top: 232 + labelText.height + 20 },
      { input: footer.data, left: 64, top: HEIGHT - 56 - footer.height },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
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

// Map a file to a short, human type label for the branded card.
function typeLabel(mimeType: string, filename: string): string {
  const mime = mimeType.toLowerCase();
  if (mime === "application/pdf") return "PDF document";
  if (mime === "text/html") return "Web page";
  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  if (mime.startsWith("audio/")) return "Audio";

  const ext = (filename.split(".").pop() || "").toLowerCase();
  const byExt: Record<string, string> = {
    zip: "ZIP archive",
    rar: "Archive",
    "7z": "Archive",
    doc: "Word document",
    docx: "Word document",
    xls: "Spreadsheet",
    xlsx: "Spreadsheet",
    csv: "CSV data",
    ppt: "Presentation",
    pptx: "Presentation",
    txt: "Text file",
    md: "Markdown",
    json: "JSON file",
    svg: "SVG image",
  };
  return byExt[ext] || (ext ? `${ext.toUpperCase()} file` : "File");
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
        return await brandCard(filename, typeLabel(mime, filename));
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
      return await brandCard(filename, "PDF document");
    }

    if (mime === "text/html") {
      const title = (buffer.length > 0 && extractHtmlTitle(buffer)) || filename;
      return await brandCard(title, "Web page");
    }

    return await brandCard(filename, typeLabel(mime, filename));
  } catch {
    // Total failure: signal the caller to use the sitewide og-image fallback.
    return null;
  }
}
