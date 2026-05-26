import "server-only";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { generateThumbnail, needsFileBytes } from "@/lib/generate-thumbnail";

// Thumbnails are keyed by file id, so a replacement overwrites the same object
// and the public og:image URL never changes (cached unfurls refresh later).
export function thumbnailKeyFor(fileId: string): string {
  return `thumbnails/${fileId}.png`;
}

// Build a thumbnail from bytes already in memory and store it in R2, then point
// the row at it. Best-effort: a failure here never propagates to the caller, so
// a thumbnail problem can't break an upload or a file replacement.
export async function storeThumbnail(opts: {
  fileId: string;
  mimeType: string;
  filename: string;
  buffer: Buffer;
}): Promise<void> {
  try {
    const png = await generateThumbnail({
      buffer: opts.buffer,
      mimeType: opts.mimeType,
      filename: opts.filename,
    });
    // null means generation gave up; leave thumbnailKey as-is so the viewer
    // falls back to the sitewide og-image.png.
    if (!png) return;

    const key = thumbnailKeyFor(opts.fileId);
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: png,
        ContentType: "image/png",
      }),
    );
    await db
      .update(files)
      .set({ thumbnailKey: key })
      .where(eq(files.id, opts.fileId));
  } catch {
    // Best-effort only.
  }
}

// Fetch the source file from R2 when its type needs the bytes (image, PDF,
// HTML), then store a thumbnail. Used by the upload confirm step, which does
// not hold the bytes itself. Best-effort, never throws.
export async function fetchAndStoreThumbnail(opts: {
  fileId: string;
  fileKey: string;
  mimeType: string;
  filename: string;
}): Promise<void> {
  try {
    let buffer = Buffer.alloc(0);
    if (needsFileBytes(opts.mimeType)) {
      const res = await r2.send(
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: opts.fileKey }),
      );
      if (res.Body) {
        const bytes = await res.Body.transformToByteArray();
        buffer = Buffer.from(bytes);
      }
    }
    await storeThumbnail({
      fileId: opts.fileId,
      mimeType: opts.mimeType,
      filename: opts.filename,
      buffer,
    });
  } catch {
    // Best-effort only.
  }
}
