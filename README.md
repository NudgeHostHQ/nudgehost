# NudgeHost

Friendly file hosting. Drop a file, get a link.

## Stack

- Next.js 15 (App Router, Server Components by default)
- TypeScript
- Tailwind CSS
- Self-hosted fonts via `next/font` (Fraunces display + DM Sans body)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000.

## Project structure

```
app/
├── layout.tsx              Root layout — Metadata API, fonts, Organization JSON-LD
├── page.tsx                Homepage
├── globals.css             Tailwind + CSS variables
├── sitemap.ts              Dynamic sitemap — derived from the content maps
├── robots.ts               robots.txt generator
├── not-found.tsx           404 page
├── host/                   /host hub + /host/[slug] spokes (4 pages)
├── viewers/                /viewers hub + /viewers/[slug] spokes (4 pages)
├── converters/             /converters hub + /converters/[slug] spokes (4 pages)
├── dev-tools/              /dev-tools hub + /dev-tools/[slug] spokes (4 pages)
├── use-cases/              /use-cases hub + /use-cases/[slug] spokes (4 pages)
├── compare/                /compare hub + /compare/[slug] (2 pages, feature tables)
└── blog/                   /blog — not yet built (empty stub)

components/
├── navbar.tsx              Sticky top nav
├── footer.tsx              Footer link wall — derived from the content maps,
│                           so it can never link to a page that doesn't exist
├── related-tools.tsx       Sibling linking card grid on every spoke (navigational)
├── contextual-prose.tsx    Renders body copy, turning {{key}} tokens into
│                           in-prose contextual links (the strong SEO links)
├── spoke-page.tsx          Shared renderer for any silo's [slug] page
└── silo-hub.tsx            Shared renderer for any silo's hub page

lib/
├── spoke-types.ts          Shared SpokeContent + SiloConfig types
├── host-content.ts         SEO copy for /host/[slug]. Bodies embed {{key}} tokens.
├── viewers-content.ts      SEO copy for /viewers/[slug].
├── converters-content.ts   SEO copy for /converters/[slug].
├── dev-tools-content.ts    SEO copy for /dev-tools/[slug].
├── use-cases-content.ts    SEO copy for /use-cases/[slug].
├── compare-content.ts      Comparison content (feature tables + verdict prose).
└── internal-links.ts       Registry of every internal-linkable destination,
                            each with several natural anchor-text variants.
```

## Internal linking: navigational vs contextual

Two kinds of internal link, and they are not equal:

- **Navigational** — navbar, footer link wall, the `RelatedTools` card grid.
  Sitewide and templated, so Google heavily discounts them. They exist for
  crawl discovery. Implemented in `navbar.tsx`, `footer.tsx`, `related-tools.tsx`.

- **Contextual** — links embedded inside body prose, where the surrounding
  sentence supplies topical relevance and the anchor text is descriptive and
  natural. These are the links that move rankings. Implemented via the
  `{{key}}` token system below.

### How contextual links work in the code

1. `lib/internal-links.ts` is the registry: each destination has an `href` and
   a list of `anchors` (several natural phrasings of the same link).
2. Body copy in `lib/host-content.ts` embeds tokens like `{{host-pdf}}` *inside
   real sentences* — the sentence is written around the link.
3. `components/contextual-prose.tsx` renders the copy: each `{{key}}` becomes a
   real `<Link>`, and the anchor text is picked from that destination's
   `anchors` list, varied per page so the same anchor is not repeated sitewide.

Target 3–6 contextual links per page, including at least one cross-silo link
and at least one money page (`{{pricing}}` / `{{home}}`). See STRATEGY.md,
"Internal linking strategy", for the full rationale.

## How the SEO architecture works

- Hub pages (`/host`, `/converters`, etc.) link to all spokes in their silo.
- Spoke pages carry contextual links in body prose + a `<RelatedTools />` grid.
- Cross-silo links: `/host/pdf` links to `/viewers/pdf`, `/converters/pdf-to-jpg`.
- Every page has a footer with categorized link walls covering all six silos.
- All programmatic URLs are listed in `app/sitemap.ts`.
- Every spoke page emits `SoftwareApplication` + `FAQPage` + `BreadcrumbList` JSON-LD.

## Adding a new programmatic page

1. Add the slug + copy to the relevant `lib/<silo>-content.ts` file.
   Weave 3–6 `{{key}}` contextual-link tokens into the body prose.
2. If the page is a new link destination, add it to `lib/internal-links.ts` with
   several natural anchor-text variants so other pages can link to it.
3. If other pages should show it in their navigational "Related tools" grid,
   add it to the `TOOL_REGISTRY` in `components/related-tools.tsx`.

That's it — `app/sitemap.ts` and `components/footer.tsx` both derive their
links from the content maps, so a new page appears in the sitemap and footer
automatically on the next build. No hand-maintained URL lists to keep in sync.

## Link audit

Run `npm run link-audit` (or `node scripts/link-audit.mjs`) to check the
internal link graph. It reports:

- **Dangling** `{{tokens}}` referencing a key not in the registry (blocking)
- **Thin pages** with fewer than 3 contextual links (blocking)
- **Orphan** destinations no page links to (warning)
- **Overused** destinations linked from >60% of pages (warning)
- **Pages with no money-page link** (warning)

It exits non-zero on blocking issues, so it can gate a CI build. Run it after
adding pages.

## Performance defaults

- All marketing pages are Server Components — zero client-side JS by default.
- Fonts self-hosted, swap display, no external requests to fonts.googleapis.com.
- Images via `next/image` with AVIF/WebP automatic.
- Target Core Web Vitals: LCP < 2.0s, INP < 200ms, CLS < 0.05.
