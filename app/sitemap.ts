import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { hostContentMap } from "@/lib/host-content";
import { viewersContentMap } from "@/lib/viewers-content";
import { convertersContentMap } from "@/lib/converters-content";
import { devToolsContentMap } from "@/lib/dev-tools-content";
import { useCasesContentMap } from "@/lib/use-cases-content";
import { compareContentMap } from "@/lib/compare-content";
import { glossaryContentMap } from "@/lib/glossary-content";
import { blogContentMap } from "@/lib/blog-content";
import { featuresContentMap } from "@/lib/features-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// The sitemap is built from two sources that both stay in sync automatically:
//
//  1. STATIC routes are discovered by scanning app/ for page.tsx files at build
//     time (this file runs on the server during `next build`, never in the
//     browser). Create app/<something>/page.tsx and it appears on the next
//     build with no edit here.
//  2. PROGRAMMATIC [slug] routes come from the lib/*-content.ts maps via
//     Object.keys(), so adding a slug to a content map adds it to the sitemap.
//
// Anything that must not be indexed is excluded below.

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

// Routes that must NEVER appear in the sitemap even though they have a page.tsx.
// Keep this in sync with the disallow rules in app/robots.ts so the two files
// never disagree about what is indexable. Matching is by exact path or path
// prefix, so "/dashboard" also covers "/dashboard/settings".
const EXCLUDED_PREFIXES = [
  "/dashboard", // private signed-in app area (also robots-disallowed)
  "/api", // route handlers, never indexable (also robots-disallowed)
  "/sign-in", // auth flow, noindex
  "/sign-up", // auth flow, noindex placeholder
];

// Per-route crawl hints. Routes not listed here fall back to DEFAULT_STATIC_META,
// which is a sensible default for any newly discovered standalone page.
const STATIC_META: Record<
  string,
  { changeFrequency: ChangeFrequency; priority: number }
> = {
  "/": { changeFrequency: "weekly", priority: 1.0 },
  "/pricing": { changeFrequency: "monthly", priority: 0.9 },
  "/host": { changeFrequency: "weekly", priority: 0.9 },
  "/viewers": { changeFrequency: "weekly", priority: 0.8 },
  "/converters": { changeFrequency: "weekly", priority: 0.8 },
  "/dev-tools": { changeFrequency: "weekly", priority: 0.8 },
  "/use-cases": { changeFrequency: "weekly", priority: 0.8 },
  "/compare": { changeFrequency: "monthly", priority: 0.7 },
  "/features": { changeFrequency: "weekly", priority: 0.8 },
  "/glossary": { changeFrequency: "weekly", priority: 0.7 },
  "/blog": { changeFrequency: "weekly", priority: 0.7 },
  "/terms": { changeFrequency: "yearly", priority: 0.3 },
  "/privacy": { changeFrequency: "yearly", priority: 0.3 },
  "/dmca": { changeFrequency: "yearly", priority: 0.3 },
};

const DEFAULT_STATIC_META: { changeFrequency: ChangeFrequency; priority: number } =
  { changeFrequency: "monthly", priority: 0.5 };

function isExcluded(route: string): boolean {
  // Drop dynamic segment routes ([slug], [[...catchAll]]). These are emitted
  // from the content maps with real slugs, never as a literal "[slug]" URL.
  if (route.includes("[")) return true;
  return EXCLUDED_PREFIXES.some(
    (prefix) => route === prefix || route.startsWith(`${prefix}/`),
  );
}

// Turn an absolute app/.../page.tsx path into its route, e.g.
// app/about/page.tsx -> "/about", app/page.tsx -> "/". Route group folders like
// "(marketing)" are stripped since they don't appear in the URL.
function fileToRoute(absFile: string, appDir: string): string {
  const rel = path.relative(appDir, absFile).split(path.sep).join("/");
  const withoutPage = rel.replace(/(^|\/)page\.tsx$/, "");
  const segments = withoutPage
    .split("/")
    .filter((s) => s.length > 0 && !(s.startsWith("(") && s.endsWith(")")));
  return `/${segments.join("/")}`;
}

// Recursively collect every page.tsx under app/.
function findPageFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findPageFiles(full));
    } else if (entry.isFile() && entry.name === "page.tsx") {
      out.push(full);
    }
  }
  return out;
}

function discoverStaticRoutes(): string[] {
  const appDir = path.join(process.cwd(), "app");
  const routes = findPageFiles(appDir)
    .map((file) => fileToRoute(file, appDir))
    .filter((route) => !isExcluded(route));
  return Array.from(new Set(routes)).sort();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = discoverStaticRoutes().map(
    (route) => {
      const meta = STATIC_META[route] ?? DEFAULT_STATIC_META;
      return {
        url: `${siteUrl}${route === "/" ? "/" : route}`,
        lastModified: now,
        changeFrequency: meta.changeFrequency,
        priority: meta.priority,
      };
    },
  );

  // Helper: turn a content map into sitemap entries for one silo.
  const silo = (
    basePath: string,
    slugs: string[],
    priority: number,
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
    ...silo("/glossary", Object.keys(glossaryContentMap), 0.6),
    ...silo("/blog", Object.keys(blogContentMap), 0.6),
    ...silo("/features", Object.keys(featuresContentMap), 0.7),
  ];

  // Merge and dedupe by URL (first entry wins, so static hub hints are kept).
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...staticPages, ...programmatic]) {
    if (!byUrl.has(entry.url)) byUrl.set(entry.url, entry);
  }
  return Array.from(byUrl.values());
}
