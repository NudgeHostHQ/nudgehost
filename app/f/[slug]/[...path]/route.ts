import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, type File } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import { unlockCookieName, unlockToken } from "@/lib/file-access";
import {
  contentTypeForPath,
  injectAnonBanner,
  isHashedAssetPath,
  isHtmlPath,
  siteObjectPrefix,
} from "@/lib/site-store";

export const runtime = "nodejs";
// Live user files, never prerendered or indexed.
export const dynamic = "force-dynamic";

// Serves the unpacked contents of a site upload (kind="site") from R2:
// GET /f/{slug}/{...path}. The bare /f/{slug} URL stays with the viewer page,
// which redirects site files to their entry index.html here.
//
// Access rules mirror the /f/[slug] viewer exactly. Deleted, banned, and
// expired-anonymous files 404; owner-set expiry and the password gate send
// page-like requests back to /f/{slug} (where the viewer shows its expired
// screen or password prompt) and plain 404/401 asset requests, since an asset
// has no screen to land on.

function notFoundResponse(): NextResponse {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

// A path with no extension on its last segment is client-side navigation
// (e.g. /f/abc/dashboard in a React Router build), not an asset fetch.
function looksLikeFileRequest(segments: string[]): boolean {
  const last = segments[segments.length - 1];
  return last.includes(".");
}

async function fetchSiteObject(fileId: string, path: string) {
  try {
    const object = await r2.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: `${siteObjectPrefix(fileId)}${path}`,
      }),
    );
    return object.Body ? object : null;
  } catch {
    return null;
  }
}

// HTML is always read into memory so the anonymous banner can be stamped in
// at response time; the stored object is never modified and adopted files
// (anonToken cleared) serve the same bytes clean. HTML is never cached so a
// replacement or adoption shows up immediately.
function htmlResponse(html: string, file: File): NextResponse {
  const body = file.anonToken ? injectAnonBanner(html, file.slug) : html;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

// Hashed build assets (content hash in the filename) can be cached hard,
// since new content always arrives under a new name. Everything else gets a
// short shared cache, or no caching at all behind a password.
function assetCacheControl(path: string, file: File): string {
  if (file.passwordHash) return "private, no-store";
  if (isHashedAssetPath(path)) return "public, max-age=31536000, immutable";
  return "public, max-age=300";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await params;

  const segments = path ?? [];
  if (segments.length === 0) return notFoundResponse();
  // Traversal guard on the request side, mirroring the unpack-side checks:
  // every served key must stay inside sites/{fileId}/.
  for (const segment of segments) {
    if (
      segment === "" ||
      segment === "." ||
      segment === ".." ||
      segment.includes("\\") ||
      segment.includes("\0")
    ) {
      return notFoundResponse();
    }
  }
  const relPath = segments.join("/");

  const [file] = await db
    .select()
    .from(files)
    .where(eq(files.slug, slug))
    .limit(1);

  // Same visibility rules as the viewer page: banned and deleted files 404,
  // and expired anonymous files vanish as if never claimed.
  const expired =
    file?.expiresAt != null && file.expiresAt.getTime() < Date.now();
  const expiredAnon = Boolean(file?.anonToken && expired);
  if (
    !file ||
    file.isDeleted ||
    file.banned ||
    expiredAnon ||
    file.kind !== "site"
  ) {
    return notFoundResponse();
  }

  const isFileRequest = looksLikeFileRequest(segments);

  // Owner-set expiry: the viewer page owns the "link has expired" screen, so
  // page-like requests go back there; assets just stop resolving.
  if (expired) {
    if (!isFileRequest) {
      return NextResponse.redirect(new URL(`/f/${slug}`, request.url));
    }
    return notFoundResponse();
  }

  // Password gate, against the same unlock cookie the viewer sets.
  if (file.passwordHash) {
    const cookieStore = await cookies();
    const token = cookieStore.get(unlockCookieName(file.id))?.value;
    if (token !== unlockToken(file.id, file.passwordHash)) {
      if (!isFileRequest) {
        return NextResponse.redirect(new URL(`/f/${slug}`, request.url));
      }
      return NextResponse.json({ error: "Locked." }, { status: 401 });
    }
  }

  const object = await fetchSiteObject(file.id, relPath);

  if (object) {
    if (isHtmlPath(relPath)) {
      const html = await object.Body!.transformToString("utf-8");
      return htmlResponse(html, file);
    }
    return new NextResponse(object.Body!.transformToWebStream(), {
      headers: {
        "Content-Type": contentTypeForPath(relPath),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": assetCacheControl(relPath, file),
        ...(object.ContentLength != null
          ? { "Content-Length": String(object.ContentLength) }
          : {}),
      },
    });
  }

  // SPA fallback: an unmatched extensionless path serves the entry index.html
  // so client-side routers handle the route. Missing assets stay 404.
  if (!isFileRequest && file.entryPath) {
    const entry = await fetchSiteObject(file.id, file.entryPath);
    if (entry) {
      const html = await entry.Body!.transformToString("utf-8");
      return htmlResponse(html, file);
    }
  }

  return notFoundResponse();
}
