import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { regenerateAllThumbnails } from "@/lib/thumbnail-store";

export const runtime = "nodejs";
// Headroom for fetching and re-rendering a batch of files. PDF rendering is the
// slow part; if the file count grows large, run scripts/regenerate-thumbnails.ts
// from a machine with R2 access instead of relying on a single request.
export const maxDuration = 60;

// One-off admin backfill: rebuild every stored thumbnail with the current
// renderer, in place. Triggered manually after a renderer change, e.g.
//   curl -X POST https://www.nudgehost.com/api/admin/regenerate-thumbnails \
//        -H "Authorization: Bearer $THUMBNAIL_BACKFILL_SECRET"
//
// Gated by a shared secret rather than a user session: it's an ops endpoint,
// not something a signed-in user reaches. It fails closed, so if the secret is
// not configured in the environment the route refuses every request.

function isAuthorized(request: Request): boolean {
  const secret = process.env.THUMBNAIL_BACKFILL_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token.length === 0) return false;

  const provided = Buffer.from(token);
  const expected = Buffer.from(secret);
  // timingSafeEqual throws on length mismatch, so guard the length first.
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const result = await regenerateAllThumbnails();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json(
      { error: "Backfill failed to run.", detail: message },
      { status: 500 },
    );
  }
}
