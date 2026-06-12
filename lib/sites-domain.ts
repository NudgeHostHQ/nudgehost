// Single source of truth for the domain that serves ZIP sites
// ({slug}.nudgehost.site). Imported by the middleware (edge), the serving
// routes, and the UI, so it must stay free of server-only dependencies.
//
// A plain constant rather than an env var: the wildcard domain is attached to
// the Vercel project directly, and unlike NEXT_PUBLIC_SITE_URL it never
// varies between environments.
export const SITES_DOMAIN = "nudgehost.site";

// Subdomain labels that must never serve a site, even if a file row claimed
// the matching slug before the label was reserved. Enforced at serve time in
// the middleware; lib/slug.ts RESERVED_SLUGS blocks NEW claims of these.
export const RESERVED_SITE_LABELS = new Set([
  "www",
  "api",
  "app",
  "mail",
  "admin",
  "dashboard",
  "blog",
  "docs",
  "status",
  "cdn",
  "assets",
  "static",
]);

// A valid DNS label: lowercase letters, digits, inner hyphens, 63 chars max.
// The slug generator and sanitizer only produce strings of this shape, but
// serving re-checks so a legacy oddball row can never become a hostname.
export function isValidSiteLabel(label: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label);
}

// True when this slug can be served as a subdomain. Callers fall back to the
// legacy /f/{slug} path when it can't.
export function isServableSiteLabel(slug: string): boolean {
  return isValidSiteLabel(slug) && !RESERVED_SITE_LABELS.has(slug);
}

export function siteUrlForSlug(slug: string): string {
  return `https://${slug}.${SITES_DOMAIN}/`;
}

// Extract the site label from a Host header value, or null when the host is
// not a single-label subdomain of the sites domain. Strips any port. The
// apex itself returns null (it does not end with ".nudgehost.site").
export function siteLabelFromHost(host: string): string | null {
  const bare = host.toLowerCase().split(":")[0];
  if (!bare.endsWith(`.${SITES_DOMAIN}`)) return null;
  const label = bare.slice(0, -(SITES_DOMAIN.length + 1));
  if (!label || label.includes(".")) return null;
  return label;
}
