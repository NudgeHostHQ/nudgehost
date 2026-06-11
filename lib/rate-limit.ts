import { createHash } from "crypto";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { uploadRateEvents } from "@/lib/db/schema";

// DB-backed sliding-window rate limit for anonymous presign requests. A
// database counter (rather than in-memory) because the app runs on serverless
// instances where per-process memory gives each warm lambda its own counter.
// Not atomic across concurrent requests; a short burst can slightly overshoot
// the cap, which is acceptable for abuse damping.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 10;

// Returns true when the request is within the limit (and records it),
// false when the IP has used up its window.
export async function consumeAnonPresignLimit(ip: string): Promise<boolean> {
  const ipHash = createHash("sha256").update(ip).digest("hex");
  const cutoff = new Date(Date.now() - WINDOW_MS);

  // Clear this IP's stale rows so the table stays small without a sweeper.
  await db
    .delete(uploadRateEvents)
    .where(
      and(
        eq(uploadRateEvents.ipHash, ipHash),
        lt(uploadRateEvents.createdAt, cutoff),
      ),
    );

  const [{ value: used }] = await db
    .select({ value: count() })
    .from(uploadRateEvents)
    .where(
      and(
        eq(uploadRateEvents.ipHash, ipHash),
        gte(uploadRateEvents.createdAt, cutoff),
      ),
    );

  if (used >= MAX_PER_WINDOW) return false;

  await db.insert(uploadRateEvents).values({ ipHash });
  return true;
}
