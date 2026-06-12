// Single source of truth for turning a user-supplied "claim this link" slug
// into a safe public slug. Used by the upload presign route (authoritative)
// and by the UploadWidget claim pill (display gating only). The server never
// trusts the client copy; it re-runs sanitizeDesiredSlug on whatever arrives.

// First path segments that already map to a real route or a framework/internal
// prefix, so a claimed slug can never shadow one. Mirrors the top-level folders
// in app/ plus the reserved system prefixes. Keep in sync with app/ when the
// route set changes (see also the RESERVED set in components/not-found-claim).
//
// Slugs also double as {slug}.nudgehost.site subdomain labels, so the
// RESERVED_SITE_LABELS from lib/sites-domain.ts are blocked here for new
// claims too (existing rows are handled at serve time instead). The sanitize
// rules below already guarantee a valid DNS label: lowercase letters, digits,
// inner hyphens only, 60 chars max.
export const RESERVED_SLUGS = new Set([
  "about",
  "api",
  "blog",
  "compare",
  "converters",
  "dashboard",
  "dev-tools",
  "dmca",
  "f",
  "features",
  "glossary",
  "host",
  "pricing",
  "privacy",
  "sign-in",
  "sign-up",
  "sites",
  "terms",
  "use-cases",
  "viewers",
  "_next",
  "admin",
  "www",
  "app",
  "mail",
  "docs",
  "status",
  "cdn",
  "assets",
  "static",
]);

// lowercase, drop anything outside [a-z0-9-], collapse dash runs, trim leading
// and trailing dashes, then cap at 60 chars. Slicing can re-expose a trailing
// dash, so trim once more after the cut.
export function sanitizeDesiredSlug(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned.replace(/-+$/g, "");
}

// A slug we are willing to honor: non-empty after sanitizing and not reserved.
export function isClaimableSlug(slug: string): boolean {
  return slug.length > 0 && !RESERVED_SLUGS.has(slug);
}
