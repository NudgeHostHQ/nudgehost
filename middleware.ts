import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import {
  RESERVED_SITE_LABELS,
  SITES_DOMAIN,
  isValidSiteLabel,
  siteLabelFromHost,
} from "@/lib/sites-domain";

const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Only /dashboard (and any future nested routes under it) require auth.
// Every marketing page stays fully public.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Host-based routing in front of Clerk:
//
// - {slug}.nudgehost.site rewrites internally to /sites/{slug}/{path}, the
//   ZIP-site serving routes. These requests deliberately bypass Clerk
//   entirely: the subdomain runs untrusted site JS, and keeping it free of
//   Clerk context and session cookies is the security purpose of serving
//   sites off the main origin. Reserved and malformed labels 404 here, even
//   if a file row claimed the matching slug.
// - The sites-domain apex and its www redirect to the main site.
// - Everything else (www.nudgehost.com, nudgehost.vercel.app, localhost)
//   passes through to Clerk exactly as before.
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];

  if (host === SITES_DOMAIN || host === `www.${SITES_DOMAIN}`) {
    return NextResponse.redirect(new URL("/", MAIN_SITE_URL), 308);
  }

  const label = siteLabelFromHost(host);
  if (label) {
    if (RESERVED_SITE_LABELS.has(label) || !isValidSiteLabel(label)) {
      return new NextResponse("Not found.", { status: 404 });
    }
    const url = req.nextUrl.clone();
    url.pathname = `/sites/${label}${
      req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname
    }`;
    return NextResponse.rewrite(url);
  }

  return clerk(req, event);
}

export const config = {
  matcher: [
    // Run on everything except Next.js internals. Unlike before, dotted
    // paths are included: subdomain asset requests (/assets/index-abc.js)
    // must reach the host check above. On the main domain those extra
    // invocations fall straight through Clerk's no-op path.
    "/((?!_next).*)",
  ],
};
