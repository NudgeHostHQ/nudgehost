# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Writing Rules - Mandatory

These rules apply to every piece of user-facing copy in this repo: titles, descriptions, leads, keyPoints, body paragraphs, FAQs, JSX text, and JSON-LD string templates. They do NOT apply to code comments.

## Banned vocabulary

Never use any of these words or phrases:

delve, crucial, robust, leverage, unlock, navigate, realm, tapestry, intricate, nuanced, multifaceted, paradigm, ecosystem (as metaphor), foster, empower, seamless, holistic, journey (as metaphor), dive into, deep dive, at the end of the day, that said, ultimately, furthermore, moreover, additionally (as paragraph opener), it's worth noting, it's important to note, it's worth mentioning, in today's world, in an era of.

If a banned word fits, rewrite the sentence to remove the need for it. Don't substitute a near-synonym from the same register (replacing "delve" with "explore in depth" is the same tell with a different costume). After writing, run a literal text search for each banned term and fix every hit before treating the work as done.

## Banned constructions

1. **Zero em-dashes in user-facing copy.** No exceptions. Not as list-introducers, not as paired parentheticals, not as single dashes mid-sentence. Replace every em-dash with a comma, period, semicolon, parentheses, or a full sentence restructure. Do not replace with a colon, see rule 8. Em-dashes in `//` and `{/* */}` code comments are fine because they never reach the rendered output.

2. **Contrast formulas** like `"It's not just X, it's Y"` or `"X isn't about Y. It's about Z."` Replace with a direct statement of what the thing is.

3. **Tricolon openers** used as section leads, like `"Fast. Cheap. Reliable."` Three short fragments stacked for emphasis read as AI rhetoric. This includes parallel-sentence triplets like `"You don't need a server. You don't need Vercel. You need a URL."`

4. **"Whether you're A or B" sentence openers.**

5. **Rhetorical questions as section transitions** (`"But what does this mean for you?"`). Also avoid chained rhetorical Q&A pairs like `"Want X? Y. Want Z? W."`.

6. **Paragraph-opening Additionally, Moreover, or Furthermore.** If the next paragraph needs a connector, the structure is wrong.

7. **Closing summaries that restate the content.** End on a concrete point, not a recap.

8. **Colons as em-dash substitutes.** When you'd want to pause for emphasis or introduce a quick explanation, use a period instead. Colons are fine for true list-intros with three or more items (`"a PDF brief, a Word agenda, a CSV"`), quote intros, technical notation (`16:9`, `3:14am`), and SEO `title: subtitle` patterns. Anywhere else, the colon is acting as a banned em-dash in disguise. Break the sentence with a period or restructure. Specific patterns to rewrite: `"X is Y: Z explains Y"`, `"The catch: ..."`, `"Here's the thing: ..."`, `"It's simple: ..."`.

## Style rules

- Specific over general. Numbers, names, dates, places, not "many users".
- Active voice as the default. Passive only when the actor genuinely doesn't matter.
- One idea per sentence. Compound sentences with three clauses joined by semicolons and dashes are a tell.
- No hedging stacks (`"may potentially possibly suggest"`). Pick one.
- No throat-clearing openers (`"Let's break this down"`, `"It's a great question"`).
- Cut every sentence whose removal would not change the reader's understanding.

## Contextual link grammar

When writing body copy with `{{key}}` contextual link tokens, always check `lib/internal-links.ts` for every anchor variant of that key. The sentence must read naturally with ALL variants, not just one. If any variant breaks the grammar, rewrite the sentence so it works with noun phrases, verb phrases, and any other form in the anchors list. Run `node scripts/render-link-sentences.mjs` before committing to verify.

# Build & run

```
npm install
cp .env.example .env.local
npm run dev          # local dev server on :3000
npm run build        # production build
npm run lint         # ESLint via next lint
npm run link-audit   # internal-link graph audit (see below)
```

There is no test suite yet.

# Architecture

A Next.js 16 App Router marketing site built around a six-silo programmatic SEO structure (host, viewers, converters, dev-tools, use-cases, compare). Two pieces of architecture matter before changing anything:

## 1. Content-driven page generation

Pages are not hand-written per slug. They're generated from typed content maps in `lib/<silo>-content.ts`:

- Each map keys `slug → SpokeContent` (title, description, h1, lead, keyPoints, body, faqs, relatedToolSlugs, etc.)
- `app/<silo>/[slug]/page.tsx` reads its map and hands the entry to `components/spoke-page.tsx` (or the comparison template at `app/compare/[slug]/page.tsx`)
- `app/sitemap.ts` and `components/footer.tsx` BOTH derive their links from the same maps, so they never go stale and never link to a missing page

To add a page: edit the relevant content file. No new route file is needed; the `[slug]` catch-all handles it.

## 2. Two link systems with different SEO weight

This is the conceptual model the codebase is built around:

- **Sitewide / templated links** (navbar, footer link wall, RelatedTools card grid) are heavily discounted by Google. They exist for crawl discovery.
- **Contextual links** are embedded inside body prose where the surrounding sentence supplies topical relevance. These are the links that move rankings.

Contextual links use a token system:

1. `lib/internal-links.ts` registers every internal destination, each with several natural anchor-text variants.
2. Body copy in the content maps embeds tokens like `{{host-pdf}}` INSIDE real sentences. The sentence has to be written AROUND the link so the surrounding words supply context.
3. `components/contextual-prose.tsx` renders body paragraphs, turning each `{{key}}` into a real `<Link>` with anchor text rotated from the variants in `internal-links.ts`. The page slug is mixed in as a salt so the chosen anchor is stable per-page but different across pages.

Target 3–6 contextual links per page, including at least one cross-silo link and at least one money-page link (`{{pricing}}` or `{{home}}`). The link-audit script enforces the lower bound.

## Schema / structured data

Every spoke page emits a JSON-LD graph from `buildSpokeJsonLd` in `components/spoke-page.tsx`:

- `SoftwareApplication` or `WebApplication` (per `SiloConfig.schemaType`)
- `FAQPage` (`mainEntity` built from `content.faqs`)
- `BreadcrumbList`
- `Article` (uses `content.author` / `content.datePublished` if set, else the file-level defaults)

The `use-cases` silo also renders a visible byline (gated by `SiloConfig.showByline`), since those pages are the ones most likely to be cited by AI Overviews.

# Adding a programmatic page

1. Add the slug + copy to the relevant `lib/<silo>-content.ts` file. Weave 3–6 `{{key}}` contextual-link tokens into the body prose.
2. If the page is itself a new link destination, add it to `lib/internal-links.ts` with several natural anchor-text variants.
3. If other pages should show it in their `<RelatedTools />` grid, add it to `TOOL_REGISTRY` in `components/related-tools.tsx`.

Sitemap and footer pick the new page up automatically.

# Link audit gate

`npm run link-audit` (or `node scripts/link-audit.mjs`) checks the internal link graph and exits non-zero on:

- **Dangling** `{{tokens}}` referencing a key not in the registry
- **Thin pages** with fewer than 3 contextual links

It also prints warnings (non-blocking) for orphan destinations, overused destinations (>60% of pages; pricing has a deliberate 85% threshold, rationale in the script), and pages with no money-page link. Run it before committing content changes; it's intended as a CI gate.

# Contextual linking rules

Established during the June 2026 linking audit (commits `18aabb2`..`32a5330`). These bind every content change:

- **One link per destination per page**, with dedupe precedence In Short (tldr) box first, body prose second, FAQ blocks last. When a destination appears twice, the lower-precedence occurrence becomes plain text.
- **Key Points boxes stay unlinked.** No `{{key}}` tokens in `keyPoints`.
- **Every sentence carrying a bare `{{key}}` token must read naturally under ALL of that key's anchor variants.** If rotation cannot be made safe, pin with the explicit form `{{key|anchor text}}`.
- **Pricing pins must match the factual plan claim.** A sentence asserting a plan fact (free limits, Pro features, ceilings) pins its anchor to the matching plan (`{{pricing|the free plan}}`, `{{pricing|the Pro plan}}`). Bare `{{pricing}}` is allowed only where all seven variants read naturally.
- **New registry keys need 3 to 4 natural anchor variants sharing one grammatical shape** (all verb phrases or all noun phrases, never mixed). Before changing an existing key's variants, enumerate every bare usage and verify or fix each one in the same change.
- **New inbound links are woven into existing prose**, never bolted-on "see also" sentences. Skip a placement rather than force it.
- **Retarget cap:** when moving links between destinations, no single destination gains more than 5 inbound links per batch.
- **After any content change**, run `npm run link-audit` and `node scripts/render-link-sentences.mjs` and review the rendered sentences before committing.

# Performance / SSR posture

- All marketing pages are Server Components. Zero client JS by default.
- Fonts self-hosted via `next/font` (Fraunces display + DM Sans body). No external font requests.
- Images via `next/image` with AVIF/WebP automatic.
- The newsletter `<input>` / `<button>` on spoke pages is presentational only; no backend is wired.

# postcss override

`package.json` carries an `overrides` block forcing `postcss` to `^8.5.10` to patch GHSA-qx2v-qp2m-jg93 (the override also reaches the copy bundled inside Next.js). Don't remove it without a replacement plan.
