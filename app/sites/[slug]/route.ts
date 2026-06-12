import { serveSiteRequest } from "@/lib/site-serving";

export const runtime = "nodejs";
// Live user files, never prerendered or indexed.
export const dynamic = "force-dynamic";

// Subdomain root: https://{slug}.nudgehost.site/ rewritten here by the
// middleware. Serves the site's entry index.html. Only requests whose Host
// is the matching subdomain are served (enforced in lib/site-serving.ts),
// so this route is unreachable on the main domain.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return serveSiteRequest(request, slug, [], "subdomain");
}
