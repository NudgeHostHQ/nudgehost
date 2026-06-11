import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { deleteSiteObjects } from "@/lib/site-store";

export const runtime = "nodejs";

// Soft-delete a file. The row stays in the database (so the slug can't be
// reused and analytics survive); is_deleted flips to true and the public
// viewer 404s. A plain file's object is left in R2 for now; a site's
// unpacked objects (up to 200 per upload) are reclaimed right away. Banned
// sites keep their objects as evidence and the cleanup cron purges them
// after the 30-day window.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to manage your files." },
      { status: 401 },
    );
  }

  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json(
      { error: "We could not tell which file to remove." },
      { status: 400 },
    );
  }

  // The userId guard means a user can only ever delete their own files.
  const deleted = await db
    .update(files)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .returning({ id: files.id, kind: files.kind, banned: files.banned });

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: "We could not find that file." },
      { status: 404 },
    );
  }

  if (deleted[0].kind === "site" && !deleted[0].banned) {
    try {
      await deleteSiteObjects(deleted[0].id);
    } catch {
      // Orphaned site objects; the row is soft-deleted so they're
      // unreachable, and the link is already dead for visitors.
    }
  }

  return NextResponse.json({ success: true });
}
