import { NextResponse, after } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { fetchAndStoreThumbnail } from "@/lib/thumbnail-store";
import { ANON_COOKIE_NAME, isValidAnonToken } from "@/lib/anon-upload";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export async function POST(request: Request) {
  const { userId } = await auth();

  // Anonymous confirms identify the visitor by the anon cookie set during
  // presign; the row lookup below is scoped to that token, mirroring how
  // signed-in confirms are scoped to the user.
  let anonToken: string | null = null;
  if (!userId) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(ANON_COOKIE_NAME)?.value ?? "";
    if (!isValidAnonToken(cookieToken)) {
      return NextResponse.json(
        { error: "Please sign in to finish your upload." },
        { status: 401 },
      );
    }
    anonToken = cookieToken;
  }

  let body: { fileId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const fileId = typeof body.fileId === "string" ? body.fileId : "";
  if (!fileId) {
    return NextResponse.json(
      { error: "We lost track of that upload. Please start again." },
      { status: 400 },
    );
  }

  // Only ever touch a row that belongs to the caller: the signed-in user, or
  // the anonymous visitor whose token stamped the row.
  const ownerMatch = userId
    ? eq(files.userId, userId)
    : eq(files.anonToken, anonToken!);
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), ownerMatch))
    .limit(1);

  if (!file) {
    return NextResponse.json(
      { error: "We could not find that upload. Please start again." },
      { status: 404 },
    );
  }

  // Confirm the bytes actually landed in R2 before we hand out a link.
  try {
    await r2.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
    );
  } catch {
    // The object never arrived, so clear the orphaned row.
    await db.delete(files).where(eq(files.id, file.id));
    return NextResponse.json(
      {
        error:
          "That upload did not finish. Please try sending the file again.",
      },
      { status: 422 },
    );
  }

  // Generate the og:image thumbnail after the response flushes, so the
  // "link ready" reply is never held up by image work. Best-effort: a failure
  // leaves the file without a thumbnail and the viewer uses the sitewide card.
  after(async () => {
    await fetchAndStoreThumbnail({
      fileId: file.id,
      fileKey: file.fileKey,
      mimeType: file.mimeType,
      filename: file.filename,
    });
  });

  return NextResponse.json({
    success: true,
    url: `${SITE_URL}/f/${file.slug}`,
  });
}
