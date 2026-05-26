import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";

export const runtime = "nodejs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Public, unauthenticated endpoint: this is what Slack, iMessage, WhatsApp, and
// LinkedIn fetch as the og:image for /f/[slug]. It streams the per-file
// thumbnail PNG from R2, and redirects to the sitewide card whenever there
// isn't one to serve. The URL is stable per file, so a replacement (which
// overwrites the same thumbnail object) reuses it and cached unfurls refresh in
// their own time.

function fallback() {
  // 302 so crawlers always end up with a valid image, even on errors.
  return NextResponse.redirect(`${SITE_URL}/og-image.png`, 302);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  try {
    const { fileId } = await params;
    if (!fileId) return fallback();

    const [file] = await db
      .select({
        thumbnailKey: files.thumbnailKey,
        isDeleted: files.isDeleted,
        passwordHash: files.passwordHash,
      })
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1);

    // No per-file image for missing or deleted files. Password-protected files
    // also fall back, so a gated file's content never leaks through its preview.
    if (!file || file.isDeleted || file.passwordHash || !file.thumbnailKey) {
      return fallback();
    }

    const object = await r2.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: file.thumbnailKey }),
    );
    if (!object.Body) return fallback();

    const bytes = await object.Body.transformToByteArray();
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        // Cache for a few minutes so unfurls are fast but a replaced file's new
        // preview shows up before long.
        "Cache-Control": "public, max-age=600, s-maxage=600",
      },
    });
  } catch {
    return fallback();
  }
}
