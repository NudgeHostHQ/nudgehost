import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid, customAlphabet } from "nanoid";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";

// Free plan ceilings. Pro/Team raise these but billing gates land later.
const FREE_MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB
const FREE_MAX_ACTIVE_FILES = 10;

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

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to upload a file." },
      { status: 401 },
    );
  }

  let body: { filename?: unknown; contentType?: unknown; fileSize?: unknown };
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

  if (fileSize > FREE_MAX_FILE_BYTES) {
    return NextResponse.json(
      {
        error:
          "That file is over the 25MB limit on the free plan. Try a smaller file or upgrade for more room.",
      },
      { status: 413 },
    );
  }

  // Free plan caps active (non-deleted) files. Count before we create a row.
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

  const fileKey = `${userId}/${nanoid(12)}/${safeKeyName(filename)}`;
  const slug = makeSlug();

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

  const [created] = await db
    .insert(files)
    .values({
      userId,
      filename,
      fileKey,
      fileSize,
      mimeType: contentType,
      slug,
      viewCount: 0,
      isDeleted: false,
    })
    .returning({ id: files.id });

  return NextResponse.json({
    presignedUrl,
    slug,
    fileId: created.id,
  });
}
