import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid, customAlphabet } from "nanoid";
import { and, eq, count, gt, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { sanitizeDesiredSlug, isClaimableSlug } from "@/lib/slug";
import {
  ANON_COOKIE_MAX_AGE,
  ANON_COOKIE_NAME,
  ANON_EXPIRY_MS,
  ANON_MAX_ACTIVE_FILES,
  ANON_MAX_FILE_BYTES,
  clientIp,
  generateAnonToken,
  isValidAnonToken,
} from "@/lib/anon-upload";
import { turnstileConfigured, verifyTurnstileToken } from "@/lib/turnstile";
import { consumeAnonPresignLimit } from "@/lib/rate-limit";

// Per-plan upload ceilings, enforced from the user's plan in the database.
const PLAN_MAX_FILE_BYTES: Record<string, number> = {
  free: 25 * 1024 * 1024, // 25MB
  pro: 250 * 1024 * 1024, // 250MB
  team: 1073741824, // 1GB
};
const FREE_MAX_ACTIVE_FILES = 10;

// Human-readable ceiling for error copy, e.g. "25MB" or "1GB".
function formatLimit(bytes: number): string {
  if (bytes >= 1073741824) return `${Math.round(bytes / 1073741824)}GB`;
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

// Slug alphabet drops 0/O/l/1 so links are easy to read aloud and retype.
const makeSlug = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 8);

// Strip anything that would make an awkward object key. The original
// filename is still stored on the row for display and download.
function safeKeyName(filename: string): string {
  const cleaned = filename
    .replace(/[/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 200);
  return cleaned.length > 0 ? cleaned : "file";
}

// Postgres unique_violation is SQLSTATE 23505. The Neon HTTP driver surfaces it
// as err.code; guard the nested cause too in case a wrapper re-throws it.
function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  if ((err as { code?: unknown }).code === "23505") return true;
  const cause = (err as { cause?: unknown }).cause;
  return (
    typeof cause === "object" &&
    cause !== null &&
    (cause as { code?: unknown }).code === "23505"
  );
}

export async function POST(request: Request) {
  const { userId } = await auth();

  // Signed-out uploads are allowed only when Turnstile is configured; with no
  // way to verify the visitor, fall back to the original sign-in requirement.
  if (!userId && !turnstileConfigured()) {
    return NextResponse.json(
      { error: "Please sign in to upload a file." },
      { status: 401 },
    );
  }

  let body: {
    filename?: unknown;
    contentType?: unknown;
    fileSize?: unknown;
    desiredSlug?: unknown;
    turnstileToken?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const filename =
    typeof body.filename === "string" ? body.filename.trim() : "";
  const contentType =
    typeof body.contentType === "string" ? body.contentType.trim() : "";
  const fileSize = typeof body.fileSize === "number" ? body.fileSize : NaN;

  if (!filename) {
    return NextResponse.json(
      { error: "That file is missing a name. Please pick another file." },
      { status: 400 },
    );
  }

  if (!contentType) {
    return NextResponse.json(
      { error: "We could not tell what kind of file that is." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(fileSize) || fileSize <= 0) {
    return NextResponse.json(
      { error: "That file looks empty. Please pick another file." },
      { status: 400 },
    );
  }

  // Set on the anonymous path only. Exactly one of userId / anonToken ends up
  // on the file row; anonymous rows also carry a 7-day expiry.
  let anonToken: string | null = null;
  let anonExpiresAt: Date | null = null;

  if (userId) {
    // SIGNED-IN PATH: unchanged from before anonymous uploads existed.
    // Resolve the plan to pick the right ceiling. A user who hasn't uploaded
    // yet has no row, which counts as the free tier.
    const [existing] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const plan = existing?.plan ?? "free";
    const maxBytes = PLAN_MAX_FILE_BYTES[plan] ?? PLAN_MAX_FILE_BYTES.free;

    if (fileSize > maxBytes) {
      return NextResponse.json(
        {
          error: `That file is over the ${formatLimit(maxBytes)} limit on your plan. Try a smaller file or upgrade for more room.`,
        },
        { status: 413 },
      );
    }

    // The free plan caps active (non-deleted) files; paid plans are uncapped.
    if (plan === "free") {
      const [{ value: activeFiles }] = await db
        .select({ value: count() })
        .from(files)
        .where(and(eq(files.userId, userId), eq(files.isDeleted, false)));

      if (activeFiles >= FREE_MAX_ACTIVE_FILES) {
        return NextResponse.json(
          {
            error:
              "You have reached 10 active files on the free plan. Delete one or upgrade to add more.",
          },
          { status: 403 },
        );
      }
    }

    const email =
      (await currentUser())?.primaryEmailAddress?.emailAddress ?? "";

    // Make sure an account row exists before we reference it from files.
    await db
      .insert(users)
      .values({ id: userId, email })
      .onConflictDoUpdate({
        target: users.id,
        set: { email, updatedAt: new Date() },
      });
  } else {
    // ANONYMOUS PATH. Cheap checks first: the IP rate limit costs two DB
    // queries, the Turnstile check a network round trip to Cloudflare.
    const ip = clientIp(request);

    if (!(await consumeAnonPresignLimit(ip))) {
      return NextResponse.json(
        {
          error:
            "Too many uploads from your network right now. Please wait an hour and try again, or sign in to keep going.",
          anonLimit: true,
        },
        { status: 429 },
      );
    }

    const turnstileToken =
      typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!(await verifyTurnstileToken(turnstileToken, ip))) {
      return NextResponse.json(
        {
          error:
            "We could not verify your browser. Please refresh the page and try again.",
        },
        { status: 403 },
      );
    }

    if (fileSize > ANON_MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: `That file is over the ${formatLimit(ANON_MAX_FILE_BYTES)} limit for uploads without an account. Sign up free for more room.`,
        },
        { status: 413 },
      );
    }

    // Reuse the visitor's cookie token when it looks like one of ours;
    // otherwise mint a fresh one. The cookie is (re)set on the response.
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ANON_COOKIE_NAME)?.value ?? "";
    anonToken = isValidAnonToken(cookieToken)
      ? cookieToken
      : generateAnonToken();

    // The anonymous cap counts active files: not deleted and not yet expired.
    const [{ value: activeFiles }] = await db
      .select({ value: count() })
      .from(files)
      .where(
        and(
          eq(files.anonToken, anonToken),
          eq(files.isDeleted, false),
          or(isNull(files.expiresAt), gt(files.expiresAt, new Date())),
        ),
      );

    if (activeFiles >= ANON_MAX_ACTIVE_FILES) {
      return NextResponse.json(
        {
          error: `You have reached ${ANON_MAX_ACTIVE_FILES} active files without an account. Sign in to keep uploading.`,
          anonLimit: true,
        },
        { status: 403 },
      );
    }

    anonExpiresAt = new Date(Date.now() + ANON_EXPIRY_MS);
  }

  // Anonymous objects are keyed under anon/<token> instead of a user ID.
  const keyOwner = userId ?? `anon/${anonToken}`;
  const fileKey = `${keyOwner}/${nanoid(12)}/${safeKeyName(filename)}`;

  let presignedUrl: string;
  try {
    presignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileKey,
        ContentType: contentType,
        ContentLength: fileSize,
      }),
      { expiresIn: 300 }, // 5 minutes
    );
  } catch {
    return NextResponse.json(
      { error: "We could not start that upload. Please try again." },
      { status: 500 },
    );
  }

  // An optional claimed slug from the 404 flow. Sanitized and reserved-checked
  // server-side regardless of what the client sent; the param is never trusted.
  const desiredSlug =
    typeof body.desiredSlug === "string"
      ? sanitizeDesiredSlug(body.desiredSlug)
      : "";

  // Exactly one of userId / anonToken is non-null here (the branch above set
  // anonToken only when there is no session). Application-level invariant;
  // there is no DB constraint backing it.
  const baseValues = {
    userId: userId ?? null,
    anonToken,
    expiresAt: anonExpiresAt,
    filename,
    fileKey,
    fileSize,
    mimeType: contentType,
    viewCount: 0,
    isDeleted: false,
  };

  // Try the claimed slug first when it's usable. claimedSlug echoes the outcome
  // to the client: the slug on success, or null when we fell back to a random
  // one (slug taken, reserved, or empty after sanitizing). A fallback is never
  // an error; the upload still succeeds at the random slug.
  let slug = makeSlug();
  let claimedSlug: string | null = null;
  let fileId = "";

  if (isClaimableSlug(desiredSlug)) {
    try {
      const [created] = await db
        .insert(files)
        .values({ ...baseValues, slug: desiredSlug })
        .returning({ id: files.id });
      fileId = created.id;
      slug = desiredSlug;
      claimedSlug = desiredSlug;
    } catch (err) {
      // The slug was taken between the check and the insert. Fall through to a
      // random slug. Anything that isn't a unique violation is a real error.
      if (!isUniqueViolation(err)) throw err;
    }
  }

  if (!fileId) {
    const [created] = await db
      .insert(files)
      .values({ ...baseValues, slug })
      .returning({ id: files.id });
    fileId = created.id;
  }

  const response = NextResponse.json({
    presignedUrl,
    slug,
    fileId,
    claimedSlug,
  });

  // Persist (or refresh) the anonymous identity so the confirm step and
  // future uploads can find this visitor's files.
  if (anonToken) {
    response.cookies.set(ANON_COOKIE_NAME, anonToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ANON_COOKIE_MAX_AGE,
    });
  }

  return response;
}
