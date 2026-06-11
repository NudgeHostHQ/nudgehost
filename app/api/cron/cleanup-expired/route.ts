import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, inArray, isNotNull, lt, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, uploadRateEvents } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";

export const runtime = "nodejs";
// Room for a few hundred R2 round trips on a busy day.
export const maxDuration = 60;

const BATCH_SIZE = 100;
// Bounds one run so it can't outlast the function window; anything left over
// is picked up by the next daily run.
const MAX_BATCHES = 5;
const RATE_EVENT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Daily hygiene for the anonymous tier, invoked by the Vercel cron (which
// sends Authorization: Bearer ${CRON_SECRET} when that env var is set):
//
// 1. Hard-delete anonymous files past their expiry: R2 object first, DB row
//    second, so a failure between the two leaves a row that retries next run
//    rather than an orphaned object. R2 failures are logged and the row is
//    skipped. The viewer's own expiry check keeps these links dead in the
//    meantime; this route is cleanup, not enforcement.
// 2. Prune rate-limit events older than the 24h the limiter could ever read.
//
// Owner files are never touched: the anonToken IS NOT NULL guard means
// user-set expiry (a reversible setting) stays out of reach of deletion.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let deleted = 0;
  let skipped = 0;
  // R2-failed ids, excluded from re-selection so a sticky failure can't make
  // the batch loop spin on the same rows within one run.
  const failedIds: string[] = [];

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const expired = await db
      .select({
        id: files.id,
        fileKey: files.fileKey,
        thumbnailKey: files.thumbnailKey,
      })
      .from(files)
      .where(
        and(
          isNotNull(files.anonToken),
          isNotNull(files.expiresAt),
          lt(files.expiresAt, new Date()),
          failedIds.length > 0
            ? notInArray(files.id, failedIds)
            : undefined,
        ),
      )
      .limit(BATCH_SIZE);

    if (expired.length === 0) break;

    const removableIds: string[] = [];
    for (const file of expired) {
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
        );
        // The og:image thumbnail is best-effort on the way in and best-effort
        // on the way out; a leftover thumbnail object is harmless.
        if (file.thumbnailKey) {
          try {
            await r2.send(
              new DeleteObjectCommand({
                Bucket: R2_BUCKET,
                Key: file.thumbnailKey,
              }),
            );
          } catch {
            // non-fatal
          }
        }
        removableIds.push(file.id);
      } catch (err) {
        console.error(
          `cleanup-expired: R2 delete failed for file ${file.id} (${file.fileKey}), retrying next run`,
          err,
        );
        failedIds.push(file.id);
        skipped++;
      }
    }

    if (removableIds.length > 0) {
      await db.delete(files).where(inArray(files.id, removableIds));
      deleted += removableIds.length;
    }

    if (expired.length < BATCH_SIZE) break;
  }

  const pruned = await db
    .delete(uploadRateEvents)
    .where(
      lt(
        uploadRateEvents.createdAt,
        new Date(Date.now() - RATE_EVENT_MAX_AGE_MS),
      ),
    )
    .returning({ id: uploadRateEvents.id });

  return NextResponse.json({
    deleted,
    skipped,
    prunedRateEvents: pruned.length,
  });
}
