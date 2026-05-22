/**
 * Internal link audit.
 *
 * Run with:  node scripts/link-audit.mjs
 *
 * Scans every silo content file for {{key}} contextual-link tokens and reports:
 *
 *  1. ORPHANS      — registry destinations that no page links to.
 *  2. DANGLING     — {{tokens}} that reference a key not in the registry.
 *  3. OVERUSED     — destinations linked from an unusually large share of pages
 *                    (a soft signal that anchor text may be getting repetitive).
 *  4. THIN PAGES   — pages with fewer than 3 contextual links (strategy minimum).
 *  5. NO MONEY LINK— pages that never link to a money page.
 *
 * Exit code is non-zero if dangling links or thin pages are found, so this can
 * gate a CI build. Orphans and overuse are warnings only.
 *
 * This script is dependency-free and reads the .ts files as text — it does not
 * import them, so it runs without a build step.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const libDir = join(root, "lib");

// --- Load the internal-links registry ------------------------------------
const registrySrc = readFileSync(join(libDir, "internal-links.ts"), "utf8");

// Extract registry keys and whether each is a money page.
const registryKeys = new Set();
const moneyKeys = new Set();
{
  // Match entries like:
  //   "host-pdf": { href: "...", anchors: [...], isMoneyPage: true },
  //   pricing:    { href: "...", ... }              <- bare identifier key
  // Key is either a quoted string or a bare JS identifier.
  const entryRe =
    /(?:["']([a-z0-9-]+)["']|\b([a-z][a-z0-9]*))\s*:\s*\{([\s\S]*?)\n\s{2}\}/gi;
  let m;
  while ((m = entryRe.exec(registrySrc)) !== null) {
    const key = m[1] || m[2];
    const bodyText = m[3];
    // Only count blocks that look like a LinkTarget (have an href).
    if (!/href\s*:/.test(bodyText)) continue;
    registryKeys.add(key);
    if (/isMoneyPage\s*:\s*true/.test(bodyText)) moneyKeys.add(key);
  }
}

// --- Scan content files for {{tokens}} -----------------------------------
const contentFiles = readdirSync(libDir).filter((f) => f.endsWith("-content.ts"));

const tokenRe = /\{\{([a-z0-9-]+)\}\}/g;

// Per "page" token counts. We approximate a page as one `slug:` entry in a
// content file; counting tokens between consecutive slug declarations.
const linkedTargets = new Map(); // key -> count of pages linking to it
const danglingTokens = [];
const pages = []; // { file, slug, tokens: [] }

for (const file of contentFiles) {
  const src = readFileSync(join(libDir, file), "utf8");

  // Split into page-sized chunks at each `slug: "..."`.
  const slugRe = /slug:\s*["']([a-z0-9-]+)["']/g;
  const slugMatches = [...src.matchAll(slugRe)];

  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i][1];
    const start = slugMatches[i].index;
    const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : src.length;
    const chunk = src.slice(start, end);

    const tokens = [...chunk.matchAll(tokenRe)].map((t) => t[1]);
    pages.push({ file, slug, tokens });

    const seenOnThisPage = new Set();
    for (const tok of tokens) {
      if (!registryKeys.has(tok)) {
        danglingTokens.push({ file, slug, token: tok });
      }
      // Count each target once per page for the "overused" heuristic.
      if (!seenOnThisPage.has(tok)) {
        seenOnThisPage.add(tok);
        linkedTargets.set(tok, (linkedTargets.get(tok) || 0) + 1);
      }
    }
  }
}

// --- Report ---------------------------------------------------------------
let problems = 0;
const warn = (s) => console.log("  ⚠  " + s);
const err = (s) => {
  problems++;
  console.log("  ✖  " + s);
};

console.log("\n=== NudgeHost internal link audit ===\n");
console.log(`Registry destinations: ${registryKeys.size}`);
console.log(`Pages scanned:         ${pages.length}`);
console.log(`Contextual links:      ${[...linkedTargets.values()].reduce((a, b) => a + b, 0)}\n`);

// 1. Orphans
console.log("Orphan destinations (in registry, linked by no page):");
const orphans = [...registryKeys].filter(
  (k) => !linkedTargets.has(k) && k !== "home"
);
if (orphans.length === 0) console.log("  ✓  none");
else orphans.forEach((k) => warn(`${k} — nothing links here`));

// 2. Dangling
console.log("\nDangling tokens ({{key}} not in registry):");
if (danglingTokens.length === 0) console.log("  ✓  none");
else danglingTokens.forEach((d) => err(`${d.file} [${d.slug}] → {{${d.token}}}`));

// 3. Overused
console.log("\nOveruse check (linked from > 60% of pages):");
const overuseThreshold = Math.ceil(pages.length * 0.6);
const overused = [...linkedTargets.entries()].filter(
  ([, n]) => n > overuseThreshold
);
if (overused.length === 0) console.log("  ✓  none");
else
  overused.forEach(([k, n]) =>
    warn(`${k} linked from ${n}/${pages.length} pages — vary anchor text carefully`)
  );

// 4. Thin pages
console.log("\nThin pages (< 3 contextual links):");
const thin = pages.filter((p) => p.tokens.length < 3);
if (thin.length === 0) console.log("  ✓  none");
else thin.forEach((p) => err(`${p.file} [${p.slug}] — only ${p.tokens.length} links`));

// 5. No money link
console.log("\nPages with no money-page link:");
const noMoney = pages.filter(
  (p) => !p.tokens.some((t) => moneyKeys.has(t))
);
if (noMoney.length === 0) console.log("  ✓  none");
else noMoney.forEach((p) => warn(`${p.file} [${p.slug}] — links no money page`));

console.log("");
if (problems > 0) {
  console.log(`✖  Audit failed: ${problems} blocking issue(s).\n`);
  process.exit(1);
} else {
  console.log("✓  Audit passed (warnings are advisory).\n");
}
