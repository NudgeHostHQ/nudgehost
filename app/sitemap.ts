import type { MetadataRoute } from "next";
import { hostContentMap } from "@/lib/host-content";
import { viewersContentMap } from "@/lib/viewers-content";
import { convertersContentMap } from "@/lib/converters-content";
import { devToolsContentMap } from "@/lib/dev-tools-content";
import { useCasesContentMap } from "@/lib/use-cases-content";
import { compareContentMap } from "@/lib/compare-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// The sitemap derives its programmatic URLs directly from the silo content
// maps via Object.keys(), so it can never drift out of sync with the spoke
// pages that actually exist. Add a slug to any lib/*-content.ts map and it
// appears in the sitemap automatically on the next build.
//
// Standalone pages (homepage, hubs, pricing, sign-up, blog) are listed
// explicitly below since they aren't in a content map. Add new standalone
// routes here when you create them.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/host`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/viewers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/converters`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/dev-tools`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/use-cases`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/sign-up`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Helper: turn a content map into sitemap entries for one silo.
  const silo = (
    basePath: string,
    slugs: string[],
    priority: number
  ): MetadataRoute.Sitemap =>
    slugs.map((slug) => ({
      url: `${siteUrl}${basePath}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    }));

  const programmatic: MetadataRoute.Sitemap = [
    ...silo("/host", Object.keys(hostContentMap), 0.7),
    ...silo("/viewers", Object.keys(viewersContentMap), 0.6),
    ...silo("/converters", Object.keys(convertersContentMap), 0.6),
    ...silo("/dev-tools", Object.keys(devToolsContentMap), 0.5),
    ...silo("/use-cases", Object.keys(useCasesContentMap), 0.6),
    ...silo("/compare", Object.keys(compareContentMap), 0.7),
  ];

  return [...staticPages, ...programmatic];
}
