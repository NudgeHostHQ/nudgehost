import type { Metadata } from "next";

// Default Open Graph share image for marketing pages. The root layout already
// sets this on metadata.openGraph, but Next.js replaces the whole openGraph
// object when a page defines its own (it does not deep-merge), which drops the
// inherited image. Each programmatic template spreads this in explicitly so
// every page keeps a valid og:image. Resolved against metadataBase in the root
// layout, so the relative path becomes the absolute sitewide image.
export const OG_IMAGE: NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> = [
  {
    url: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "NudgeHost: share any file as a link",
  },
];

// Open Graph defaults for a hub/index or standalone marketing page. Pass the
// page's own canonical path so og:url matches the canonical (the root layout no
// longer hardcodes a sitewide og:url, which used to leak the homepage URL onto
// every inheriting page). The path is resolved to an absolute URL against
// metadataBase. og:title and og:description fall back to the page's own title
// and description, so they don't need to be repeated here.
export function pageOpenGraph(
  path: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    url: path,
    siteName: "NudgeHost",
    images: OG_IMAGE,
  };
}
