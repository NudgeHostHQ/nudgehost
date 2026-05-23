// One-off audit: find every colon inside user-facing string literals.
//
// Scans content files and the homepage/pricing page for double-quoted strings
// (the typical home of body copy) and single-quoted JSX text content, and
// reports each string containing a colon along with its line number.
//
// Filters out obvious non-prose colons: URL-like strings (start with "/" or
// look like "http"), and key-value JSX/object syntax (the colon outside the
// string).

import { readFileSync } from "node:fs";

const files = [
  "lib/host-content.ts",
  "lib/viewers-content.ts",
  "lib/converters-content.ts",
  "lib/dev-tools-content.ts",
  "lib/use-cases-content.ts",
  "lib/compare-content.ts",
  "app/page.tsx",
  "app/pricing/page.tsx",
];

const strRe = /"((?:[^"\\]|\\.)*)"/g;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  console.log("\n=== " + file + " ===");
  lines.forEach((line, i) => {
    strRe.lastIndex = 0;
    let m;
    while ((m = strRe.exec(line)) !== null) {
      const content = m[1];
      // Skip URL-like or path-like strings
      if (content.startsWith("/")) continue;
      if (content.startsWith("http")) continue;
      // Skip empty
      if (!content) continue;
      // Skip pure date strings
      if (/^\d{4}-\d{2}-\d{2}$/.test(content)) continue;
      // Look for a colon NOT used as a route/protocol separator
      if (content.includes(":")) {
        console.log(`L${i + 1}: ${m[0]}`);
      }
    }
  });
}
