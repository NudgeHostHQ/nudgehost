import { serveSiteRequest } from "@/lib/site-serving";

export const runtime = "nodejs";
// Live user files, never prerendered or indexed.
export const dynamic = "force-dynamic";

// Subdomain assets: https://{slug}.nudgehost.site/{...path} rewritten here
// by the middleware. Assets serve at the path root, so root-absolute
// references in exported builds work without rewriting. Only requests whose
// Host is the matching subdomain are served (enforced in
// lib/site-serving.ts), so this route is unreachable on the main domain.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path } = await params;
  return serveSiteRequest(request, slug, path ?? [], "subdomain");
}
