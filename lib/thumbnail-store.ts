import "server-only";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { and, eq, isNotNull } from "drizzle-orm";
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

export type ThumbnailBackfillResult = {
  total: number;
  regenerated: number;
  skipped: number;
  failures: { fileId: string; filename: string; reason: string }[];
};

// Rebuild every stored thumbnail in place with the current renderer. Used by
// the one-off backfill (scripts/regenerate-thumbnails.ts and the admin route)
// after a renderer change. Each thumbnail is written back to its existing
// thumbnails/{fileId}.png key, so public og:image URLs never change.
//
// Unlike fetchAndStoreThumbnail, this fetches and re-uploads directly (no
// thumbnailKey write, since the row already points at the right key) and
// reports per-file outcomes so the caller can log progress and summarise. A
// failure on one file is recorded and the loop moves on.
export async function regenerateAllThumbnails(
  opts: { onProgress?: (message: string) => void } = {},
): Promise<ThumbnailBackfillResult> {
  const log = opts.onProgress ?? (() => {});

  // Only live files that already carry a thumbnail. Soft-deleted rows never
  // have their thumbnail served, so there's nothing to fix there.
  const rows = await db
    .select({
      id: files.id,
      filename: files.filename,
      fileKey: files.fileKey,
      mimeType: files.mimeType,
    })
    .from(files)
    .where(and(isNotNull(files.thumbnailKey), eq(files.isDeleted, false)));

  log(`Found ${rows.length} file(s) with a stored thumbnail.`);

  const result: ThumbnailBackfillResult = {
    total: rows.length,
    regenerated: 0,
    skipped: 0,
    failures: [],
  };

  for (const file of rows) {
    try {
      // Pull the source bytes only for types the renderer actually reads
      // (image, PDF, HTML). Everything else builds its card from the filename.
      let buffer = Buffer.alloc(0);
      if (needsFileBytes(file.mimeType)) {
        const res = await r2.send(
          new GetObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
        );
        if (res.Body) {
          const bytes = await res.Body.transformToByteArray();
          buffer = Buffer.from(bytes);
        }
      }

      const png = await generateThumbnail({
        buffer,
        mimeType: file.mimeType,
        filename: file.filename,
      });

      if (!png) {
        result.skipped += 1;
        result.failures.push({
          fileId: file.id,
          filename: file.filename,
          reason: "renderer produced no image",
        });
        log(`Skipped ${file.filename} (${file.id}): renderer produced no image`);
        continue;
      }

      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: thumbnailKeyFor(file.id),
          Body: png,
          ContentType: "image/png",
        }),
      );

      result.regenerated += 1;
      log(`Regenerated thumbnail for ${file.filename} (${file.id})`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      result.skipped += 1;
      result.failures.push({
        fileId: file.id,
        filename: file.filename,
        reason,
      });
      log(`Skipped ${file.filename} (${file.id}): ${reason}`);
    }
  }

  return result;
}
