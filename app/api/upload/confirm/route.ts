import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to finish your upload." },
      { status: 401 },
    );
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

  // Only ever touch a row that belongs to the signed-in user.
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
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

  return NextResponse.json({
    success: true,
    url: `${SITE_URL}/f/${file.slug}`,
  });
}
