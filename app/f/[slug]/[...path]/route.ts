import { serveSiteRequest } from "@/lib/site-serving";

export const runtime = "nodejs";
// Live user files, never prerendered or indexed.
export const dynamic = "force-dynamic";

// Legacy path serving for unpacked ZIP sites: /f/{slug}/{...path}. New site
// links live at {slug}.nudgehost.site (see app/sites/), but deep paths here
// keep serving directly, with base-path URL rewriting, so existing embeds
// and old links don't break. All logic lives in lib/site-serving.ts.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await params;
  return serveSiteRequest(request, slug, path ?? [], "legacy");
}
