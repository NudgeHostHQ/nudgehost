# NudgeHost Codebase Audit

Generated for Chat 5 planning. Scope: internal-link graph, contextual-link
density, sitemap/page parity, orphan detection, missing destinations, glossary
and blog readiness, footer, JSON-LD, and the link-audit gate.

**Headline numbers (verified):**

| Metric | Value |
|---|---|
| Registry destinations | 51 |
| Spoke pages scanned (in content maps) | 42 |
| Total contextual links | 213 |
| Thin pages (<3 links) | 0 |
| Dangling tokens | 0 |
| Orphan destinations (no inbound) | 0 |
| Broken link targets (registered, no page) | 1 (`host-portfolio`) |
| Destinations with <3 anchor variants | 16 |
| Destinations with only 1 inbound link | 21 (41%) |

This matches the DeepSeek read: link **quality** is strong (every page clears
the 3-link minimum, every page has a money link, no dangling tokens), but
**volume/diversity** is thin (41% of destinations are linked from exactly one
page, and `pricing` carries 40 of 42 pages).

---

## 1. Internal Links Registry Audit

`lib/internal-links.ts` defines **51 destinations**. All hrefs resolve to a real
page **except one**.

### Broken target (registered, no page file)

| Key | href | Problem |
|---|---|---|
| `host-portfolio` | `/host/portfolio` | No `portfolio` slug in `host-content.ts`; `/host/portfolio` 404s. It is linked contextually from `/host/resume` (`{{host-portfolio}}`), so that link currently points at a 404. |

### Destinations with fewer than 3 anchor variants (strategy wants varied anchors)

16 destinations carry only 2 anchors:

| Key | Anchors |
|---|---|
| `host-portfolio` | host your portfolio · share a portfolio with one link |
| `viewers-hub` | view any file online · all of NudgeHost's file viewers |
| `viewer-docx` | open a Word document online · the DOCX viewer |
| `converters-hub` | convert a file · all of NudgeHost's free converters |
| `converter-docx-to-pdf` | convert a Word document to PDF · the DOCX to PDF converter |
| `dev-tools-hub` | free developer tools · all of NudgeHost's dev tools |
| `dev-base64` | encode or decode Base64 · the Base64 encoder |
| `dev-url-encoder` | encode a URL · the URL encoder |
| `use-cases-hub` | see what people use NudgeHost for · browse common use cases |
| `use-case-recruiter` | send a portfolio to a recruiter · share your work with a recruiter |
| `use-case-large-pdf` | send a large PDF without email · share a big PDF without an attachment |
| `use-case-resume-link` | share your resume as a link · send your CV without an attachment |
| `use-case-deck` | share a deck with a client · send a presentation as a link |
| `compare-hub` | see how NudgeHost compares · compare file-sharing tools |
| `compare-tiiny` | how NudgeHost compares to Tiiny.host · NudgeHost vs Tiiny.host |
| `compare-linkyhost` | how NudgeHost compares to Linkyhost · NudgeHost vs Linkyhost |

`pricing` has 4 anchors but is linked from 40/42 pages, so it needs more anchor
variety than any other destination (see §10).

### Full destination list (key → href → anchor count)

| Key | href | Anchors | Money |
|---|---|---|---|
| pricing | /pricing | 4 | ✓ |
| home | / | 3 | ✓ |
| host-hub | /host | 3 | |
| host-pdf | /host/pdf | 4 | |
| host-html | /host/html | 3 | |
| host-zip | /host/zip | 3 | |
| host-claude-artifact | /host/claude-artifact | 3 | |
| host-resume | /host/resume | 3 | |
| host-portfolio | /host/portfolio | 2 ⚠ **no page** | |
| host-docx | /host/docx | 3 | |
| host-pptx | /host/pptx | 3 | |
| host-xlsx | /host/xlsx | 3 | |
| host-txt | /host/txt | 3 | |
| host-md | /host/md | 3 | |
| host-react-app | /host/react-app | 3 | |
| host-vue-app | /host/vue-app | 3 | |
| host-json | /host/json | 3 | |
| host-svg | /host/svg | 3 | |
| host-chatgpt-html | /host/chatgpt-html | 3 | |
| host-lovable-export | /host/lovable-export | 3 | |
| host-v0-export | /host/v0-export | 3 | |
| host-bolt-export | /host/bolt-export | 3 | |
| host-image | /host/image | 3 | |
| host-gif | /host/gif | 3 | |
| host-mp4 | /host/mp4 | 3 | |
| host-mp3 | /host/mp3 | 3 | |
| viewers-hub | /viewers | 2 ⚠ | |
| viewer-pdf | /viewers/pdf | 3 | |
| viewer-docx | /viewers/docx | 2 ⚠ | |
| viewer-csv | /viewers/csv | 3 | |
| viewer-json | /viewers/json | 3 | |
| converters-hub | /converters | 2 ⚠ | |
| converter-pdf-to-jpg | /converters/pdf-to-jpg | 3 | |
| converter-docx-to-pdf | /converters/docx-to-pdf | 2 ⚠ | |
| converter-png-to-webp | /converters/png-to-webp | 3 | |
| converter-heic-to-jpg | /converters/heic-to-jpg | 3 | |
| dev-tools-hub | /dev-tools | 2 ⚠ | |
| dev-json-formatter | /dev-tools/json-formatter | 3 | |
| dev-base64 | /dev-tools/base64 | 2 ⚠ | |
| dev-url-encoder | /dev-tools/url-encoder | 2 ⚠ | |
| dev-jwt-decoder | /dev-tools/jwt-decoder | 3 | |
| use-cases-hub | /use-cases | 2 ⚠ | |
| use-case-recruiter | /use-cases/send-portfolio-to-recruiter | 2 ⚠ | |
| use-case-large-pdf | /use-cases/send-large-pdf-without-email | 2 ⚠ | |
| use-case-resume-link | /use-cases/share-resume-as-link | 2 ⚠ | |
| use-case-deck | /use-cases/share-deck-with-client | 2 ⚠ | |
| use-case-wedding | /use-cases/share-wedding-website | 3 | |
| compare-hub | /compare | 2 ⚠ | |
| compare-tiiny | /compare/nudgehost-vs-tiiny-host | 2 ⚠ | |
| compare-linkyhost | /compare/nudgehost-vs-linkyhost | 2 ⚠ | |
| compare-tiiny-vs-linkyhost | /compare/tiiny-host-vs-linkyhost | 3 | |

---

## 2. Contextual Link Density Audit

All 42 spokes clear the 3-link minimum (range 3–7, no thin pages). Flags below.

### Per-page detail

| Silo | Page | Links | Cross-silo | Money | Hub-up | Keys |
|---|---|---|---|---|---|---|
| host | pdf | 7 | ✓ | ✓ | ✓ | viewer-pdf, converter-pdf-to-jpg, converters-hub, host-resume, pricing, use-case-large-pdf, host-hub |
| host | html | 7 | ✓ | ✓ | ✓ | host-zip, host-claude-artifact, use-case-wedding, pricing, host-hub, host-pdf, viewers-hub |
| host | claude-artifact | 6 | ✓ | ✓ | ✗ | host-html, host-zip, host-pdf, pricing, use-case-deck, use-cases-hub |
| host | resume | 5 | ✓ | ✓ | ✗ | host-pdf, **host-portfolio**, use-case-recruiter, pricing, compare-hub |
| host | docx | 5 | ✓ | ✓ | ✓ | viewer-docx, converter-docx-to-pdf, host-pdf, pricing, host-hub |
| host | pptx | 4 | ✓ | ✓ | ✓ | host-pdf, use-case-deck, host-hub, pricing |
| host | xlsx | 3 | ✓ | ✓ | ✓ | viewer-csv, host-hub, pricing |
| host | txt | 6 | ✓ | ✓ | ✓ | viewer-json, dev-json-formatter, viewer-csv, host-md, pricing, host-hub |
| host | md | 5 | ✗ | ✓ | ✓ | host-html, host-txt, host-pdf, host-hub, pricing |
| host | zip | 4 | ✓ | ✓ | ✗ | host-html, host-claude-artifact, pricing, converter-png-to-webp |
| host | react-app | 5 | ✗ | ✓ | ✗ | host-zip, host-claude-artifact, host-v0-export, host-vue-app, pricing |
| host | vue-app | 4 | ✗ | ✓ | ✓ | host-react-app, host-html, pricing, host-hub |
| host | json | 5 | ✓ | ✓ | ✗ | viewer-json, dev-json-formatter, host-zip, viewer-csv, pricing |
| host | svg | 4 | ✓ | ✓ | ✗ | host-html, pricing, converter-png-to-webp, host-image |
| host | chatgpt-html | 4 | ✗ | ✓ | ✗ | host-claude-artifact, host-html, host-zip, pricing |
| host | lovable-export | 5 | ✗ | ✓ | ✓ | host-react-app, host-v0-export, host-bolt-export, pricing, host-hub |
| host | v0-export | 6 | ✗ | ✓ | ✓ | host-claude-artifact, host-chatgpt-html, host-react-app, pricing, host-hub, host-zip |
| host | bolt-export | 6 | ✗ | ✓ | ✓ | host-react-app, host-zip, pricing, host-hub, host-lovable-export, host-v0-export |
| host | image | 6 | ✓ | ✓ | ✗ | converter-png-to-webp, converter-heic-to-jpg, host-svg, pricing, host-zip, host-html |
| host | gif | 5 | ✓ | ✓ | ✗ | host-mp4, pricing, host-html, host-image, converters-hub |
| host | mp4 | 7 | ✗ | ✓ | ✓ | host-gif, pricing, host-html, host-hub, host-pdf, host-image, host-mp3 |
| host | mp3 | 3 | ✗ | ✓ | ✓ | pricing, host-mp4, host-hub |
| viewers | pdf | 4 | ✓ | ✓ | ✗ | host-pdf, converter-pdf-to-jpg, viewer-docx, pricing |
| viewers | docx | 5 | ✓ | ✓ | ✗ | converter-docx-to-pdf, host-pdf, host-docx, viewer-pdf, pricing |
| viewers | csv | 6 | ✓ | ✓ | ✗ | host-hub, host-xlsx, viewer-json, dev-json-formatter, home, pricing |
| viewers | json | 5 | ✓ | ✓ | ✗ | dev-json-formatter, viewer-csv, host-hub, dev-tools-hub, pricing |
| converters | pdf-to-jpg | 5 | ✓ | ✓ | ✗ | host-hub, host-pdf, viewer-pdf, converter-png-to-webp, pricing |
| converters | docx-to-pdf | 5 | ✓ | ✓ | ✗ | host-pdf, use-case-resume-link, viewer-docx, converter-pdf-to-jpg, pricing |
| converters | png-to-webp | 5 | ✓ | ✓ | ✗ | host-html, converter-heic-to-jpg, host-hub, dev-tools-hub, pricing |
| converters | heic-to-jpg | 5 | ✓ | ✓ | ✗ | host-hub, host-zip, converter-png-to-webp, viewer-pdf, pricing |
| dev-tools | json-formatter | 7 | ✓ | ✓ | ✓ | viewer-json, host-json, dev-base64, dev-url-encoder, dev-jwt-decoder, dev-tools-hub, pricing |
| dev-tools | base64 | 5 | ✓ | ✓ | ✓ | dev-jwt-decoder, dev-json-formatter, host-hub, dev-tools-hub, pricing |
| dev-tools | url-encoder | 6 | ✓ | ✓ | ✓ | dev-base64, dev-json-formatter, dev-tools-hub, host-html, host-hub, pricing |
| dev-tools | jwt-decoder | 5 | ✓ | ✓ | ✓ | dev-base64, dev-json-formatter, host-hub, dev-tools-hub, pricing |
| use-cases | share-resume-as-link | 4 | ✓ | ✓ | ✗ | host-resume, converter-docx-to-pdf, use-case-recruiter, pricing |
| use-cases | send-portfolio-to-recruiter | 5 | ✓ | ✓ | ✗ | host-pdf, host-html, host-zip, use-case-resume-link, pricing |
| use-cases | send-large-pdf-without-email | 5 | ✓ | ✓ | ✗ | host-pdf, converter-pdf-to-jpg, host-hub, host-zip, pricing |
| use-cases | share-deck-with-client | 6 | ✓ | ✓ | ✗ | host-pdf, host-html, host-pptx, host-hub, host-zip, pricing |
| use-cases | share-wedding-website | 5 | ✓ | ✓ | ✗ | host-html, host-pdf, host-image, host-zip, pricing |
| compare | nudgehost-vs-tiiny-host | 5 | ✓ | ✓ | ✗ | home, host-pdf, host-html, compare-linkyhost, compare-tiiny-vs-linkyhost |
| compare | nudgehost-vs-linkyhost | 3 | ✓ | ✓ | ✗ | home, host-pdf, compare-tiiny |
| compare | tiiny-host-vs-linkyhost | 7 | ✓ | ✓ | ✗ | host-html, host-pdf, pricing, compare-tiiny, compare-linkyhost |

### Flags

- **Thin pages (<3):** none. ✓
- **Missing money-page link:** none. ✓ (every page links `pricing` or `home`)
- **Missing cross-silo link (9 pages, all in host):** `host/md`, `host/react-app`,
  `host/vue-app`, `host/chatgpt-html`, `host/lovable-export`, `host/v0-export`,
  `host/bolt-export`, `host/mp4`, `host/mp3`. These link only within `host` +
  `pricing`. The AI-builder and media clusters in particular should reach into
  viewers/converters/use-cases.
- **Missing contextual hub-up link (25 pages):** all 4 viewers, all 4 converters,
  all 5 use-cases, all 3 compare, plus host (claude-artifact, resume, zip,
  react-app, json, svg, chatgpt-html, image, gif). **Lower priority** — the
  navbar and footer already link every hub sitewide; this is contextual polish,
  not a crawl-reachability gap.

---

## 3. Sitemap vs Actual Pages

`app/sitemap.ts` derives programmatic URLs from the six content maps via
`Object.keys()`, so spoke URLs cannot drift from reality. Static routes are
listed explicitly.

**Sitemap declares:** `/`, `/pricing`, `/host`, `/viewers`, `/converters`,
`/dev-tools`, `/use-cases`, `/compare`, `/blog`, `/terms`, `/privacy`, `/dmca`,
plus every spoke in the six maps (42 spokes).

| Check | Result |
|---|---|
| Sitemap URLs with no page file | **None.** All static routes and `[slug]` templates exist. |
| Page files not in sitemap | `/sign-in`, `/sign-up`, `/dashboard`, `/f/[slug]` — all **intentionally excluded** (noindex / private / dynamic). `/sign-up` omission is documented in the file. |

No action required. Note: `/host/portfolio` is correctly absent from the sitemap
because it isn't in the content map — but the registry still links to it (see §1).

---

## 4. Orphan Page Detection

Cross-referenced every spoke/hub against the registry, all `{{token}}`
references, and the footer.

- **Pages with zero inbound contextual links: none.** Every destination is
  linked from at least one page (the link-audit confirms 0 orphan destinations).
- **Near-orphans (exactly 1 inbound contextual link): 21 destinations (41%).**
  This is the core diversity weakness DeepSeek flagged.

| Inbound = 1 | host-portfolio*, host-docx, host-pptx, host-xlsx, host-txt, host-md, host-vue-app, host-json, host-svg, host-chatgpt-html, host-lovable-export, host-bolt-export, host-gif, host-mp3, viewers-hub, dev-url-encoder, use-cases-hub, use-case-large-pdf, use-case-wedding, compare-hub, compare-tiiny-vs-linkyhost |
|---|---|

\* `host-portfolio` also has no page.

**Inbound distribution (top + bottom):** `pricing` 40, `host-hub` 23, `host-pdf`
18, `host-html` 16, `host-zip` 13, `dev-json-formatter` 7 … then a long tail of
1–2. The graph is heavily centralized on `pricing`/`host-hub`/`host-pdf`.

Footer reachability note: the footer only surfaces the **first 6** host spokes,
so the 16 host spokes beyond `pptx` (xlsx, txt, md, zip, react-app, vue-app,
json, svg, chatgpt-html, lovable-export, v0-export, bolt-export, image, gif,
mp4, mp3) rely entirely on contextual links + sitemap for discovery (see §8).

---

## 5. Missing Destinations (DeepSeek Gap)

None of the DeepSeek-suggested paths exist (`app/features`, `app/convert`,
`app/guides`, `app/plans` directories are all absent).

| Suggested path | Exists? | Recommendation |
|---|---|---|
| `/features` | No | **(c) Registry alias / (a) build later.** No feature hub today. Short term, point a `features-hub` concept at `/` or `/pricing`. Long term, a `/features` silo is a real opportunity. |
| `/features/paste-and-share` | No | **(a) Build.** Distinct intent; closest existing is `/host/claude-artifact` + `/host/html`. Alias there until built. |
| `/features/analytics` | No | **(a) Build.** Open-tracking is a real, marketable feature with no current page. Interim alias → `/pricing`. |
| `/features/password-protect` | No | **(a) Build.** The feature now ships (password gate exists). A dedicated page would convert well. Interim alias → `/pricing`. |
| `/features/custom-domains` | No | **(a) Build** or **(b) redirect → `/pricing`** (currently only described in pricing copy). |
| `/features/all-file-types` | No | **(b) Redirect → `/host`.** The host hub already is "all file types". |
| `/features/zip-upload` | No | **(b) Redirect → `/host/zip`.** Exact existing equivalent. |
| `/features/live-editing` | No | **(b) Redirect → `/pricing`, or drop.** "Same URL on file update" is the closest real capability; no standalone page warranted yet. |
| `/convert/pdf-to-images` | No | **(b) Redirect → `/converters/pdf-to-jpg`.** Exact equivalent; also add as an anchor alias. |
| `/guides/send-large-pdf` | No | **(b) Redirect → `/use-cases/send-large-pdf-without-email`.** Exact equivalent. |
| `/plans/free` | No | **(b) Redirect → `/pricing`** (or `/pricing#free` once an anchor exists). |

**Recommended split:** build a small `/features` silo for the four genuinely
distinct, conversion-oriented features (paste-and-share, analytics,
password-protect, custom-domains); redirect the rest to existing pages and add
those as anchor aliases in `lib/internal-links.ts` so external/AI references
resolve instead of 404ing.

---

## 6. Glossary Readiness

| Check | Result |
|---|---|
| `/glossary` route in `app/` | **No** |
| `glossary-` prefixed keys in `lib/internal-links.ts` | **None** |
| `lib/glossary-content.ts` | **Does not exist** |

The glossary silo is **not started**. It would be the highest-leverage way to add
both link volume and topical breadth.

**Glossary-candidate terms already used in body copy** (good seed list, all
appear verbatim across the content files):

static site, CDN, SPA fallback, client-side routing, CORS, HTTP range requests,
H.264, HEVC (H.265), EXIF metadata, UTF-8, CRLF vs LF line endings,
GitHub-flavored Markdown, JWT (JSON web token), Base64, URL/percent encoding,
JSON, SVG, SMIL animation, lossless vs lossy compression, WebP, QR code,
open-tracking, presigned URL, `index.html` entry point, sandboxed iframe,
source maps, tree-shaking, minification, Vite / CRA / Nuxt static build,
Tailwind CDN, AAC, FLAC, bitrate (kbps), responsive design, MIME type.

A `/glossary/<term>` silo (mirroring the spoke pattern, with `glossary-` registry
keys and `{{glossary-cdn}}`-style tokens woven into existing copy) would lift the
41% single-inbound problem substantially.

---

## 7. Blog Readiness

| Check | Result |
|---|---|
| `/blog` route in `app/` | **Yes** (`app/blog/page.tsx`) |
| Blog content files | **None.** The hub renders a hardcoded `upcomingPosts` placeholder array (3 teaser cards: share-pdf-as-link, host-claude-artifact, send-large-file-without-email). |
| `/blog/[slug]` post route | **Does not exist.** Teaser slugs have no destination. |
| Sitemap includes blog | Only the `/blog` hub. **No individual post URLs.** |

Blog is a **shell**: hub page only, no content system, no posts. The three teaser
topics overlap directly with existing spokes, so a real blog should link out to
those spokes heavily (more inbound links for the long tail).

---

## 8. Footer Link Wall Audit

`components/footer.tsx` generates columns from the content maps, so footer links
**cannot 404** (every link derives from a real map entry). Six columns:

| Column | Links shown |
|---|---|
| Host files | first 6 host spokes (pdf, html, claude-artifact, resume, docx, pptx) + "All file types →" `/host` |
| Viewers | all 4 (pdf, docx, csv, json) + "All viewers →" `/viewers` |
| Converters | all 4 + "All converters →" `/converters` |
| Dev tools | all 4 + "All dev tools →" `/dev-tools` |
| Use cases | all 5 + "All use cases →" `/use-cases` |
| Compare | all 3 + "All comparisons →" `/compare` |
| Bottom bar | Terms, Privacy, DMCA |

**Findings:**

- ✅ No broken footer links (map-derived).
- ⚠ **`/pricing` is not in the footer at all** — the primary money page is
  missing from the global link wall. The bottom bar only has Terms/Privacy/DMCA.
- ⚠ **`/blog` is not in the footer.**
- ⚠ **Only 6 of 22 host spokes appear** (`slice(0, max=6)`). The other 16 host
  pages (xlsx, txt, md, zip, react-app, vue-app, json, svg, chatgpt-html,
  lovable-export, v0-export, bolt-export, image, gif, mp4, mp3) get no footer
  link. High-value ones like `/host/zip` and the AI-builder exports are hidden.
- ℹ Home/logo link present; no link to sign-in/sign-up (acceptable).

---

## 9. JSON-LD Audit

| Schema | Where | Status |
|---|---|---|
| Organization | root `app/layout.tsx` | ✅ Emitted sitewide |
| SoftwareApplication / WebApplication | spoke pages via `buildSpokeJsonLd` (per `silo.schemaType`) | ✅ |
| FAQPage | spoke pages (from `content.faqs`) | ✅ |
| BreadcrumbList | spoke pages | ✅ |
| Article (author, datePublished, dateModified) | spoke pages via `buildSpokeJsonLd` | ✅ **Implemented** (defaults: author "NudgeHost Team", datePublished 2026-05-22). The handover's worry that Article "may not be added yet" is resolved — it is present on every spoke. |
| SoftwareApplication + multi-tier Offer | `app/pricing/page.tsx` | ✅ |
| SoftwareApplication + FAQPage | homepage | ✅ |

**Gaps:**

- ⚠ **Compare pages** (`app/compare/[slug]/page.tsx`) use a separate template and
  emit only **FAQPage + BreadcrumbList** — no `Article` and no
  `SoftwareApplication`. They also carry no visible byline.
- ℹ Visible byline (`showByline`) is on **use-cases only**, by design.

---

## 10. Link Audit Script Output

`node scripts/link-audit.mjs`:

```
=== NudgeHost internal link audit ===

Registry destinations: 51
Pages scanned:         42
Contextual links:      213

Orphan destinations (in registry, linked by no page):
  ✓  none

Dangling tokens ({{key}} not in registry):
  ✓  none

Overuse check (linked from > 60% of pages):
  ⚠  pricing linked from 40/42 pages — vary anchor text carefully

Thin pages (< 3 contextual links):
  ✓  none

Pages with no money-page link:
  ✓  none

✓  Audit passed (warnings are advisory).
```

- **Dangling tokens:** none.
- **Thin pages:** none.
- **Orphan destinations:** none. *(Caveat: the script does not validate that a
  registry href has a real page, so it does not catch the `host-portfolio` →
  `/host/portfolio` 404 from §1. Worth adding that check to the script.)*
- **Overused:** `pricing` (40/42). Only 4 anchor variants for the most-linked
  destination on the site.
- **No money-page link:** none.

---

## Priority Action List

Sorted by impact. Each maps to a concrete fix.

### P0 — Broken / correctness

1. **Fix `host-portfolio` (broken link target).** `/host/portfolio` is linked
   from `/host/resume` but has no page.
   *Fix:* add a `portfolio` entry to `lib/host-content.ts` (recommended — it
   anchors the resume/recruiter cluster), **or** repoint the `host-portfolio`
   href to `/host/pdf`/`/host/html`, **or** remove the `{{host-portfolio}}`
   token. Also add a "registry href has a real page" check to
   `scripts/link-audit.mjs` so this class of bug fails CI.

### P1 — Highest SEO leverage (volume + diversity, the DeepSeek 3/5 → 4.5/5 path)

2. **Raise inbound diversity for the 21 single-inbound destinations.** Weave one
   or two more `{{token}}` references to each (especially the host file-type tail
   and `use-cases-hub`/`compare-hub`) into related pages' body copy.
3. **Add cross-silo links to the 9 host pages missing them** (`md`, `react-app`,
   `vue-app`, `chatgpt-html`, `lovable-export`, `v0-export`, `bolt-export`,
   `mp4`, `mp3`) — reach into viewers/converters/use-cases (e.g. `host/mp4` →
   `host-gif` already, add `converters-hub`; `host/md` → `dev-json-formatter`).
4. **Build the glossary silo** (`lib/glossary-content.ts` + `/glossary/[slug]` +
   `glossary-` registry keys). Seed from the §6 term list and link terms inline
   in existing copy. Biggest single lever for volume + topical breadth.

### P2 — Structural / conversion

5. **Add `/pricing` (and `/blog`) to the footer**, and raise the host column cap
   or add a second host column so the 16 hidden host spokes get a templated link.
6. **Add ≥1 more anchor variant** to the 16 destinations with only 2, and
   expand `pricing` beyond 4 anchors (it's on 40 pages).
7. **Resolve the DeepSeek missing paths** (§5): build a small `/features` silo
   (paste-and-share, analytics, password-protect, custom-domains); redirect /
   registry-alias the rest (`/convert/pdf-to-images` → pdf-to-jpg,
   `/guides/send-large-pdf` → use-case, `/plans/free` → pricing,
   `/features/zip-upload` → host/zip, `/features/all-file-types` → /host).

### P3 — Polish

8. **Stand up a real blog** (`/blog/[slug]` + content file); link posts to
   matching spokes; add post URLs to the sitemap.
9. **Add Article + SoftwareApplication JSON-LD to compare pages**, and consider a
   byline there (they're citation-likely).
10. **Add contextual hub-up links** on the 25 pages missing them (low priority;
    footer/navbar already cover hub reachability).

---

*Audit produced by reading `lib/internal-links.ts`, all six `lib/*-content.ts`
files, `app/sitemap.ts`, `components/footer.tsx`, `app/layout.tsx`,
`components/spoke-page.tsx`, `app/compare/[slug]/page.tsx`, `app/blog/page.tsx`,
and the full `app/` route tree, plus the output of `scripts/link-audit.mjs`.*
