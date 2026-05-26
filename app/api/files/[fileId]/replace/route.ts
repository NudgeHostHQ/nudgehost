import { NextResponse, after } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { storeThumbnail } from "@/lib/thumbnail-store";

export const runtime = "nodejs";

// Per-plan upload ceilings, kept in step with app/api/upload/presign/route.ts.
const PLAN_MAX_FILE_BYTES: Record<string, number> = {
  free: 25 * 1024 * 1024, // 25MB
  pro: 250 * 1024 * 1024, // 250MB
  team: 1073741824, // 1GB
};

// Human-readable ceiling for error copy, e.g. "25MB" or "1GB".
function formatLimit(bytes: number): string {
  if (bytes >= 1073741824) return `${Math.round(bytes / 1073741824)}GB`;
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

// Strip anything that would make an awkward object key. The original filename
// is still stored on the row for display and download. Mirrors presign.
function safeKeyName(filename: string): string {
  const cleaned = filename
    .replace(/[/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 200);
  return cleaned.length > 0 ? cleaned : "file";
}

// Replace the file behind an existing link without changing the URL.
//
// Accepts a multipart form ("file" field) with the new file. The bytes land on
// the server, get pushed to R2 under a brand-new object key, and the row is
// repointed at them. The slug, view count, created_at, password, and expiry are
// all left untouched, so /f/[slug] keeps working and analytics carry over.
// Only the content, filename, content type, size, and updated_at change. The
// old object is removed from R2 once the new one is confirmed in place.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to replace your files." },
      { status: 401 },
    );
  }

  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json(
      { error: "We could not tell which file to replace." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "We could not read that upload. Please try again." },
      { status: 400 },
    );
  }

  const upload = formData.get("file");
  if (!(upload instanceof File)) {
    return NextResponse.json(
      { error: "Please choose a file to upload." },
      { status: 400 },
    );
  }

  if (upload.size <= 0) {
    return NextResponse.json(
      { error: "That file looks empty. Please pick another file." },
      { status: 400 },
    );
  }

  // Confirm ownership before touching anything. A soft-deleted file can't be
  // resurrected this way.
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .limit(1);

  if (!file || file.isDeleted) {
    return NextResponse.json(
      { error: "We could not find that file." },
      { status: 404 },
    );
  }

  // The replacement is held to the same ceiling as a fresh upload on this plan.
  const [account] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const plan = account?.plan ?? "free";
  const maxBytes = PLAN_MAX_FILE_BYTES[plan] ?? PLAN_MAX_FILE_BYTES.free;

  if (upload.size > maxBytes) {
    return NextResponse.json(
      {
        error: `That file is over the ${formatLimit(maxBytes)} limit on your plan. Try a smaller file or upgrade for more room.`,
      },
      { status: 413 },
    );
  }

  const contentType = upload.type || "application/octet-stream";
  const oldKey = file.fileKey;
  const newKey = `${userId}/${nanoid(12)}/${safeKeyName(upload.name)}`;

  // Push the new bytes to R2 under a fresh key, then confirm they landed before
  // we repoint the row. Writing to a new key means a failure here never harms
  // the file that's currently live.
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await upload.arrayBuffer());
  } catch {
    return NextResponse.json(
      { error: "We could not read that file. Please try again." },
      { status: 400 },
    );
  }

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: newKey,
        Body: buffer,
        ContentType: contentType,
        ContentLength: upload.size,
      }),
    );
    await r2.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET, Key: newKey }),
    );
  } catch {
    return NextResponse.json(
      { error: "That upload did not finish. Please try again." },
      { status: 502 },
    );
  }

  // Repoint the row. slug, viewCount, createdAt, passwordHash, and expiresAt are
  // deliberately left out of the update so they survive the swap.
  const [updated] = await db
    .update(files)
    .set({
      fileKey: newKey,
      filename: upload.name,
      mimeType: contentType,
      fileSize: upload.size,
      updatedAt: new Date(),
    })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .returning();

  // New file is live and the row points at it. Clean up the old object. A
  // failure here only leaves an orphan blob, so it must not fail the request.
  if (oldKey && oldKey !== newKey) {
    try {
      await r2.send(
        new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: oldKey }),
      );
    } catch {
      // Orphaned old object; the swap already succeeded for the user.
    }
  }

  // Regenerate the og:image thumbnail from the new bytes after the response
  // flushes. It overwrites the same thumbnails/{fileId}.png object, so the
  // preview URL stays the same and cached unfurls refresh in their own time.
  after(async () => {
    await storeThumbnail({
      fileId: file.id,
      mimeType: contentType,
      filename: upload.name,
      buffer,
    });
  });

  return NextResponse.json({
    file: {
      id: updated.id,
      filename: updated.filename,
      slug: updated.slug,
      fileSize: updated.fileSize,
      mimeType: updated.mimeType,
      viewCount: updated.viewCount,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      hasPassword: Boolean(updated.passwordHash),
      expiresAt: updated.expiresAt,
    },
  });
}
