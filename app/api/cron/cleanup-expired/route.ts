import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, eq, inArray, isNotNull, lt, notInArray, type SQL } from "drizzle-orm";
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
// Banned files keep their R2 object as evidence for this long before the
// purge takes them.
const BAN_EVIDENCE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Hard-deletes the files matching `condition`, R2 object first, DB row
// second, so a failure between the two leaves a row that retries next run
// rather than an orphaned object. R2 failures are logged and the row is
// skipped; failed ids are excluded from re-selection within the run so a
// sticky failure can't spin the batch loop.
async function purgeFiles(
  label: string,
  condition: SQL,
): Promise<{ deleted: number; skipped: number }> {
  let deleted = 0;
  let skipped = 0;
  const failedIds: string[] = [];

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const targets = await db
      .select({
        id: files.id,
        fileKey: files.fileKey,
        thumbnailKey: files.thumbnailKey,
      })
      .from(files)
      .where(
        and(
          condition,
          failedIds.length > 0 ? notInArray(files.id, failedIds) : undefined,
        ),
      )
      .limit(BATCH_SIZE);

    if (targets.length === 0) break;

    const removableIds: string[] = [];
    for (const file of targets) {
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
          `cleanup-expired (${label}): R2 delete failed for file ${file.id} (${file.fileKey}), retrying next run`,
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

    if (targets.length < BATCH_SIZE) break;
  }

  return { deleted, skipped };
}

// Daily hygiene for the anonymous tier and abuse takedowns, invoked by the
// Vercel cron (which sends Authorization: Bearer ${CRON_SECRET} when that env
// var is set):
//
// 1. Hard-delete anonymous files past their expiry. Banned files are excluded
//    here so a ban's 30-day evidence window can't be cut short by the file's
//    own expiry; pass 2 owns banned deletions.
// 2. Hard-delete banned files (any owner) banned more than 30 days ago. The
//    ban itself never touches R2; this is where the object finally goes.
// 3. Prune rate-limit events older than the 24h the limiter could ever read.
//
// Unbanned owner files are never touched: user-set expiry (a reversible
// setting) stays out of reach of deletion, and the viewer's own expiry check
// keeps expired links dead in the meantime. This route is cleanup, not
// enforcement.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const expiredAnon = await purgeFiles(
    "expired-anon",
    and(
      isNotNull(files.anonToken),
      isNotNull(files.expiresAt),
      lt(files.expiresAt, now),
      eq(files.banned, false),
    )!,
  );

  const bannedAged = await purgeFiles(
    "banned-30d",
    and(
      eq(files.banned, true),
      isNotNull(files.bannedAt),
      lt(files.bannedAt, new Date(now.getTime() - BAN_EVIDENCE_MS)),
    )!,
  );

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
    deleted: expiredAnon.deleted,
    skipped: expiredAnon.skipped,
    bannedDeleted: bannedAged.deleted,
    bannedSkipped: bannedAged.skipped,
    prunedRateEvents: pruned.length,
  });
}
