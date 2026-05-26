// One-off backfill: rebuild every stored og:image thumbnail with the current
// SVG-based renderer in lib/generate-thumbnail.ts. Files uploaded before that
// fix still have the old, garbled Pango cards sitting in R2 under
// thumbnails/{fileId}.png; this re-generates each one in place so the public
// URL never changes and cached unfurls refresh on their own.
//
// Run from the project root, with real R2 + DATABASE_URL values in .env.local:
//   NODE_OPTIONS="--conditions=react-server" node_modules/.bin/tsx scripts/regenerate-thumbnails.ts
//
// The react-server condition makes the `import "server-only"` lines in the lib
// modules resolve to an empty module, so they can be imported outside Next.
//
// The actual work lives in regenerateAllThumbnails (lib/thumbnail-store.ts) so
// the admin API route (app/api/admin/regenerate-thumbnails) shares one
// implementation with this script. Env is read from .env.local first because
// lib/db and lib/r2 throw at import time when DATABASE_URL / R2_* are missing,
// so anything that touches them is loaded dynamically afterwards.

import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(here, "..", ".env.local") });

async function main() {
  const { regenerateAllThumbnails } = await import("../lib/thumbnail-store");

  const result = await regenerateAllThumbnails({
    onProgress: (message) => console.log(message),
  });

  console.log(
    `\nDone. Regenerated ${result.regenerated}, skipped ${result.skipped}, of ${result.total} total.`,
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
