import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { files, type File } from "@/lib/db/schema";
import { r2, R2_BUCKET } from "@/lib/r2";
import {
  UNLOCK_HANDOFF_PARAM,
  unlockCookieName,
  unlockToken,
  verifyUnlockHandoffToken,
} from "@/lib/file-access";
import {
  contentTypeForPath,
  injectAnonBanner,
  isCssPath,
  isHashedAssetPath,
  isHtmlPath,
  rewriteCssUrls,
  rewriteSiteHtml,
  siteObjectPrefix,
} from "@/lib/site-store";
import { SITES_DOMAIN, siteLabelFromHost } from "@/lib/sites-domain";

const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Shared serving logic for unpacked ZIP sites, called by both routes:
//
// - "subdomain": {slug}.nudgehost.site/{...path}, rewritten by the middleware
//   to /sites/{slug}/{...path}. Assets live at the path root, so client-side
//   routers and root-absolute references work as exported; no URL rewriting.
// - "legacy": www.nudgehost.com/f/{slug}/{...path}, kept so old links and
//   embeds keep rendering. Served HTML and CSS get root-absolute URLs
//   rewritten onto the /f/{slug} base path.
//
// Origin isolation is the security purpose of the subdomain: untrusted site
// JS runs on {slug}.nudgehost.site, where no Clerk context exists and no app
// API routes are reachable. Anything auth-shaped stays on the main domain.
// This path sets exactly one cookie type: the per-site unlock cookie for
// password-protected sites, which carries no account or session data and is
// scoped to that single site's origin. Everything else about the isolation
// stands (no Clerk, no app APIs, no other cookies).
//
// Access rules mirror the /f/[slug] viewer exactly. Deleted, banned, and
// expired-anonymous files 404; owner-set expiry and the password gate send
// page-like requests to the viewer (which shows its expired screen or
// password prompt) and plain 404/401 asset requests, since an asset has no
// screen to land on.

type ServeMode = "subdomain" | "legacy";

function notFoundResponse(): NextResponse {
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

// A path with no extension on its last segment is client-side navigation
// (e.g. /dashboard in a React Router build), not an asset fetch. The bare
// subdomain root is page-like by definition.
function looksLikeFileRequest(segments: string[]): boolean {
  if (segments.length === 0) return false;
  return segments[segments.length - 1].includes(".");
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
// at response time (and, on the legacy path, root-absolute asset URLs
// rewritten first; the banner goes in after the rewrite so its own URLs are
// never touched). The stored object is never modified and adopted files
// (anonToken cleared) serve the same bytes clean of the banner. HTML is
// never cached so a replacement or adoption shows up immediately.
function htmlResponse(html: string, file: File, mode: ServeMode): NextResponse {
  const rewritten =
    mode === "legacy" ? rewriteSiteHtml(html, `/f/${file.slug}`) : html;
  const body = file.anonToken
    ? injectAnonBanner(rewritten, file.slug)
    : rewritten;
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

// Count one view per served HTML document on the subdomain, where visitors
// land without passing the /f/[slug] viewer (which counts for the legacy
// path). SPA fallback serves count too; each is a page visit. Best-effort.
async function countSiteView(fileId: string): Promise<void> {
  try {
    await db
      .update(files)
      .set({ viewCount: sql`${files.viewCount} + 1` })
      .where(eq(files.id, fileId));
  } catch {
    // non-fatal
  }
}

export async function serveSiteRequest(
  request: Request,
  slug: string,
  segments: string[],
  mode: ServeMode,
): Promise<Response> {
  if (mode === "subdomain") {
    // Only the middleware rewrite for {slug}.nudgehost.site lands here with a
    // matching Host. Hitting /sites/{slug} on the main domain directly would
    // serve untrusted site JS on the main origin, which is exactly what the
    // subdomain exists to prevent, so anything else 404s.
    const label = siteLabelFromHost(request.headers.get("host") ?? "");
    if (label !== slug) return notFoundResponse();
  } else if (segments.length === 0) {
    // The bare /f/{slug} URL belongs to the viewer page, not this path.
    return notFoundResponse();
  }

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
  const viewerUrl =
    mode === "subdomain"
      ? `${MAIN_SITE_URL}/f/${slug}`
      : new URL(`/f/${slug}`, request.url).toString();

  // Owner-set expiry: the viewer page owns the "link has expired" screen, so
  // page-like requests go there; assets just stop resolving.
  if (expired) {
    if (!isFileRequest) return NextResponse.redirect(viewerUrl);
    return notFoundResponse();
  }

  // Password gate. The unlock cookie is the same name and value on both
  // paths but lives on different origins: the verify-password route sets it
  // on the main domain (covering the viewer and legacy deep links), and the
  // handoff redemption below sets it on this one subdomain.
  if (file.passwordHash) {
    // A valid handoff token from the www password prompt becomes the
    // per-site unlock cookie, set on this subdomain only, then the visitor
    // bounces to the same URL without the query param so the token never
    // lingers in the address bar. The token is short-lived and bound to the
    // current password hash, so an expired, tampered, or post-password-change
    // token simply falls through to the locked behavior below.
    if (mode === "subdomain") {
      const requestUrl = new URL(request.url);
      const handoff = requestUrl.searchParams.get(UNLOCK_HANDOFF_PARAM);
      if (
        handoff &&
        verifyUnlockHandoffToken(handoff, file.id, file.passwordHash)
      ) {
        requestUrl.searchParams.delete(UNLOCK_HANDOFF_PARAM);
        // request.url carries the middleware-rewritten /sites/{slug} path;
        // rebuild the visitor-facing URL from the slug and segments.
        const clean = new URL(
          segments.length === 0 ? "/" : `/${relPath}`,
          `https://${slug}.${SITES_DOMAIN}`,
        );
        clean.search = requestUrl.search;
        const response = NextResponse.redirect(clean, 302);
        response.cookies.set(
          unlockCookieName(file.id),
          unlockToken(file.id, file.passwordHash),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
          },
        );
        return response;
      }
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(unlockCookieName(file.id))?.value;
    if (token !== unlockToken(file.id, file.passwordHash)) {
      if (!isFileRequest) return NextResponse.redirect(viewerUrl);
      return NextResponse.json({ error: "Locked." }, { status: 401 });
    }
  }

  // The subdomain root serves the entry point straight away.
  if (mode === "subdomain" && segments.length === 0) {
    if (!file.entryPath) return notFoundResponse();
    const entry = await fetchSiteObject(file.id, file.entryPath);
    if (!entry) return notFoundResponse();
    const html = await entry.Body!.transformToString("utf-8");
    await countSiteView(file.id);
    return htmlResponse(html, file, mode);
  }

  const object = await fetchSiteObject(file.id, relPath);

  if (object) {
    if (isHtmlPath(relPath)) {
      const html = await object.Body!.transformToString("utf-8");
      if (mode === "subdomain") await countSiteView(file.id);
      return htmlResponse(html, file, mode);
    }
    // Legacy path only: CSS gets the same root-absolute url(...) rewrite as
    // HTML. Caching the result per URL is safe across slugs: the rewrite
    // depends only on this file's slug, and the URL being cached already
    // embeds that slug (/f/{slug}/...), so one slug's rewritten CSS can
    // never answer for another. No Content-Length; the rewrite changes the
    // byte count. On the subdomain, CSS streams through untouched below.
    if (mode === "legacy" && isCssPath(relPath)) {
      const css = await object.Body!.transformToString("utf-8");
      return new NextResponse(rewriteCssUrls(css, `/f/${file.slug}`), {
        headers: {
          "Content-Type": contentTypeForPath(relPath),
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": assetCacheControl(relPath, file),
        },
      });
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
      if (mode === "subdomain") await countSiteView(file.id);
      return htmlResponse(html, file, mode);
    }
  }

  return notFoundResponse();
}
