import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { isValidAnonToken } from "@/lib/anon-upload";

export const runtime = "nodejs";

// Abuse takedown, operated via curl (no UI this phase):
//
//   ban one file:    curl -X POST .../api/admin/ban \
//                      -H "Authorization: Bearer $ADMIN_SECRET" \
//                      -H "Content-Type: application/json" \
//                      -d '{"slug":"abc123"}'
//   unban:           -d '{"slug":"abc123","unban":true}'
//   spam wave:       -d '{"anonToken":"<32-hex>"}'   (bans every file on it)
//
// Banning sets banned + bannedAt; the viewer 404s the file immediately. The
// R2 object is deliberately left in place as evidence; the daily cleanup cron
// hard-deletes banned files 30 days after bannedAt. Unbanning clears both
// fields and the file serves again.
//
// Gated by a shared secret rather than a user session, like the thumbnail
// backfill route: it's an ops endpoint. Fails closed when ADMIN_SECRET is
// unset.

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
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
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let body: { slug?: unknown; anonToken?: unknown; unban?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const anonToken =
    typeof body.anonToken === "string" ? body.anonToken.trim() : "";
  const unban = body.unban === true;

  if ((slug === "") === (anonToken === "")) {
    return NextResponse.json(
      { error: "Provide exactly one of slug or anonToken." },
      { status: 400 },
    );
  }
  if (anonToken && !isValidAnonToken(anonToken)) {
    return NextResponse.json(
      { error: "anonToken must be 32 lowercase hex characters." },
      { status: 400 },
    );
  }

  const target = slug ? eq(files.slug, slug) : eq(files.anonToken, anonToken);
  const updated = await db
    .update(files)
    .set(
      unban
        ? { banned: false, bannedAt: null, updatedAt: new Date() }
        : { banned: true, bannedAt: new Date(), updatedAt: new Date() },
    )
    .where(target)
    .returning({ slug: files.slug });

  if (updated.length === 0) {
    return NextResponse.json(
      { error: "No matching files found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    action: unban ? "unbanned" : "banned",
    count: updated.length,
    slugs: updated.map((row) => row.slug),
  });
}
