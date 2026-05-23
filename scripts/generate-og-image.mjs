// Generates public/og-image.png — 1200x630 social-share card.
// Run via: node scripts/generate-og-image.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "public");
const outPath = path.join(outDir, "og-image.png");

mkdirSync(outDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;
const CREAM = { r: 0xfb, g: 0xf7, b: 0xf0, alpha: 1 };
const CHARCOAL = "#2C2824";
const CORAL = "#E8704A";
const MUTED = "#7A6F65";

async function renderText(markup, font) {
  return sharp({
    text: {
      text: markup,
      font,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
}

const wordmark = await renderText(
  `<span foreground="${CHARCOAL}">nudge</span><span foreground="${CORAL}">host</span>`,
  "Georgia Bold 170",
);

const tagline = await renderText(
  `<span foreground="${MUTED}">Drop a file, get a link.</span>`,
  "Georgia Italic 52",
);

// Small coral underline accent beneath the wordmark.
const accentSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="6"><rect width="120" height="6" rx="3" fill="${CORAL}"/></svg>`,
);
const accent = await sharp(accentSvg).png().toBuffer({ resolveWithObject: true });

const wordmarkX = Math.round((WIDTH - wordmark.info.width) / 2);
const wordmarkY = Math.round((HEIGHT - wordmark.info.height) / 2 - 70);

const accentX = Math.round((WIDTH - accent.info.width) / 2);
const accentY = wordmarkY + wordmark.info.height + 30;

const taglineX = Math.round((WIDTH - tagline.info.width) / 2);
const taglineY = accentY + accent.info.height + 30;

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: CREAM,
  },
})
  .composite([
    { input: wordmark.data, left: wordmarkX, top: wordmarkY },
    { input: accent.data, left: accentX, top: accentY },
    { input: tagline.data, left: taglineX, top: taglineY },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log(`Wrote ${outPath} (${WIDTH}x${HEIGHT})`);
