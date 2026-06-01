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
