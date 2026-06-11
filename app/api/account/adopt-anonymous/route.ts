import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, count, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { ANON_COOKIE_NAME, isValidAnonToken } from "@/lib/anon-upload";

// Free-plan ceiling, mirroring the presign route's active-file cap.
const FREE_MAX_ACTIVE_FILES = 10;

// Moves a visitor's anonymous files into their account once they sign in:
// userId set, anonToken cleared, expiresAt cleared (account files don't
// auto-expire). Idempotent; with no cookie or no adoptable files it's a
// silent no-op.
//
// Plan limits are respected: on the free plan, adoption fills the account up
// to 10 active files, newest anonymous upload first. Files that don't fit
// stay anonymous (and keep their expiry); the cookie is kept in that case so
// a later visit can adopt them after a slot opens. The cookie is cleared only
// when no active anonymous files remain behind it.
//
// The adoption itself is one atomic UPDATE with an IN-subquery. The Neon HTTP
// driver has no interactive transactions, so the capacity check and the
// update aren't wrapped together; a concurrent upload between the two can
// overshoot the cap by a file, the same tolerance the presign cap has.
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in first." },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  const anonToken = cookieStore.get(ANON_COOKIE_NAME)?.value ?? "";
  if (!isValidAnonToken(anonToken)) {
    return NextResponse.json({ adopted: 0, remaining: 0 });
  }

  // Adoptable files: anonymous under this token, not deleted, not expired.
  // Expired anonymous files stay behind for the cleanup cron; adopting one
  // would resurrect a link the visitor was told had ended.
  const now = new Date();
  const adoptable = and(
    eq(files.anonToken, anonToken),
    eq(files.isDeleted, false),
    or(isNull(files.expiresAt), gt(files.expiresAt, now)),
  );

  const [{ value: candidates }] = await db
    .select({ value: count() })
    .from(files)
    .where(adoptable);

  if (candidates === 0) {
    // Nothing to adopt now or later; the cookie has done its job.
    const response = NextResponse.json({ adopted: 0, remaining: 0 });
    response.cookies.delete(ANON_COOKIE_NAME);
    return response;
  }

  // Capacity on the free plan; paid plans are uncapped. A user who has never
  // uploaded has no users row yet, which counts as free.
  const [account] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const plan = account?.plan ?? "free";

  let capacity = candidates;
  if (plan === "free") {
    const [{ value: activeFiles }] = await db
      .select({ value: count() })
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.isDeleted, false)));
    capacity = Math.max(0, FREE_MAX_ACTIVE_FILES - activeFiles);
  }

  let adopted = 0;
  if (capacity > 0) {
    // The files rows are about to reference users.id, so the account row has
    // to exist first (it's normally created on first signed-in presign).
    const email =
      (await currentUser())?.primaryEmailAddress?.emailAddress ?? "";
    await db
      .insert(users)
      .values({ id: userId, email })
      .onConflictDoUpdate({
        target: users.id,
        set: { email, updatedAt: new Date() },
      });

    const adoptedRows = await db
      .update(files)
      .set({
        userId,
        anonToken: null,
        expiresAt: null,
        updatedAt: new Date(),
      })
      .where(
        inArray(
          files.id,
          db
            .select({ id: files.id })
            .from(files)
            .where(adoptable)
            .orderBy(desc(files.createdAt))
            .limit(capacity),
        ),
      )
      .returning({ id: files.id });
    adopted = adoptedRows.length;
  }

  const remaining = candidates - adopted;
  const response = NextResponse.json({ adopted, remaining });
  if (remaining === 0) {
    response.cookies.delete(ANON_COOKIE_NAME);
  }
  return response;
}
