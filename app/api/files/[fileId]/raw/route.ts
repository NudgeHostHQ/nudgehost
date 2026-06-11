import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { unlockCookieName, unlockToken } from "@/lib/file-access";
import { isCsvFile, isJsonFile, TEXT_VIEW_MAX_BYTES } from "@/lib/file-kind";

export const runtime = "nodejs";

// Same-origin text content for the CSV/JSON in-browser viewers. The viewer
// page can't fetch the presigned R2 URL from the browser (that needs bucket
// CORS, which the <img>/<iframe> embeds never required), so the client
// components read the bytes through this route instead.
//
// Access rules mirror the viewer page exactly: deleted, banned, and expired
// files 404 (anonymous or owner; if the page won't show the file, this route
// won't serve its bytes), and password-protected files require the same
// unlock cookie the viewer checks. Scope is deliberately narrow: only the
// file kinds with an in-browser text viewer, capped at the same size the
// viewers will load, so this never becomes a general raw-file proxy that
// would undermine the share-page model.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await params;
  if (!fileId) {
    return NextResponse.json({ error: "Missing file id." }, { status: 400 });
  }

  const [file] = await db
    .select()
    .from(files)
    .where(eq(files.id, fileId))
    .limit(1);

  const expired =
    file?.expiresAt != null && file.expiresAt.getTime() < Date.now();
  if (!file || file.isDeleted || file.banned || expired) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (
    !isCsvFile(file.mimeType.toLowerCase(), file.filename) &&
    !isJsonFile(file.mimeType.toLowerCase(), file.filename)
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (file.fileSize > TEXT_VIEW_MAX_BYTES) {
    return NextResponse.json({ error: "File too large." }, { status: 413 });
  }

  if (file.passwordHash) {
    const cookieStore = await cookies();
    const token = cookieStore.get(unlockCookieName(file.id))?.value;
    if (token !== unlockToken(file.id, file.passwordHash)) {
      return NextResponse.json({ error: "Locked." }, { status: 401 });
    }
  }

  try {
    const object = await r2.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: file.fileKey }),
    );
    if (!object.Body) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        // Always plain text: the bytes are user-supplied, so never serve
        // them under a type a browser might execute or render as HTML.
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, max-age=0",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
