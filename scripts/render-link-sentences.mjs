// One-off audit script — renders every {{key}} sentence with the actual
// anchor that contextual-prose would pick at runtime. Lets us read the
// rendered prose to check for natural English.

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const libDir = join(root, "lib");

const registrySrc = readFileSync(join(libDir, "internal-links.ts"), "utf8");

// Parse anchors per key by walking the registry source.
const anchors = {};
{
  const entryRe = /(?:["']([a-z0-9-]+)["']|\b([a-z][a-z0-9]*))\s*:\s*\{([\s\S]*?)\n\s{2}\}/gi;
  let m;
  while ((m = entryRe.exec(registrySrc)) !== null) {
    const key = m[1] || m[2];
    const body = m[3];
    if (!/href\s*:/.test(body)) continue;
    const anchorMatch = body.match(/anchors:\s*\[([\s\S]*?)\]/);
    if (!anchorMatch) continue;
    const list = [...anchorMatch[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(
      (m) => m[1]
    );
    anchors[key] = list;
  }
}

function pickAnchor(key, salt) {
  const list = anchors[key];
  if (!list) return key;
  let hash = 0;
  const combined = key + "::" + salt;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) & 0x7fffffff;
  }
  return list[hash % list.length];
}

const TOKEN = /\{\{([a-z0-9-]+)\}\}/g;

// Walk all *-content.ts files, locate body / intro / verdict arrays, extract
// paragraph strings, and render each {{key}} with its picked anchor.

const files = readdirSync(libDir).filter((f) => f.endsWith("-content.ts"));

for (const file of files) {
  const src = readFileSync(join(libDir, file), "utf8");
  console.log("\n========== " + file + " ==========");

  // Split into per-slug chunks.
  const slugRe = /slug:\s*["']([a-z0-9-]+)["']/g;
  const slugMatches = [...src.matchAll(slugRe)];

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i][1];
    const start = slugMatches[i].index;
    const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);

    // Find body: [...] or intro: [...] or verdict: [...]
    const arrayRe = /\b(body|intro|verdict)\s*:\s*\[([\s\S]*?)\n\s{4}\]/g;
    let arrMatch;
    while ((arrMatch = arrayRe.exec(chunk)) !== null) {
      const arrName = arrMatch[1];
      const arrBody = arrMatch[2];
      // Extract each quoted string. Each paragraph is one "...", "..." entry.
      // Find "..." spans (handle escaped quotes).
      const paragraphs = [];
      const paraRe = /"((?:[^"\\]|\\.)*)"/g;
      let pm;
      while ((pm = paraRe.exec(arrBody)) !== null) {
        paragraphs.push(pm[1]);
      }
      // verdict uses salt "${slug}-verdict" per app/compare/[slug]/page.tsx
      const baseSalt = arrName === "verdict" ? `${slug}-verdict` : slug;
      paragraphs.forEach((para, paraIndex) => {
        if (!para.includes("{{")) return;
        // Render tokens
        let linkCount = 0;
        const rendered = para.replace(TOKEN, (_, key) => {
          const a = pickAnchor(key, `${baseSalt}:${paraIndex}:${linkCount}`);
          linkCount++;
          return `[[${a}]]`;
        });
        console.log(`\n[${slug} :: ${arrName}[${paraIndex}]]`);
        console.log(rendered);
      });
    }
  }
}
