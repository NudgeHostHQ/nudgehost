# Site-wide contextual linking audit: resolved

Audit conducted and fully resolved June 13, 2026, across commits `18aabb2` through `32a5330` (seven fix batches plus follow-ups).

Final state: 79 pages, 88 registry destinations, 453 contextual links, `npm run link-audit` passes with zero warnings (overuse thresholds: 60% general, 85% for pricing, rationale in `scripts/link-audit.mjs`).

The editorial and copy rules that came out of it now live in CLAUDE.md: the "Contextual linking rules" section (dedupe precedence In Short > body > FAQ, Key Points boxes unlinked, pricing pins must match the factual plan claim, anchor variants per key share one grammatical shape, retarget cap of 5 inbound per destination per batch) and the v2 writing rules (extended banned vocabulary, broadened fragment-stack and contrast-formula bans, never invent a specific).

The original findings and batch plan are in this file's history (`git show 18aabb2:AUDIT-REPORT.md`).
