# Site-wide contextual linking audit: resolved

Audit conducted and fully resolved June 13, 2026, across commits `18aabb2` through `32a5330` (seven fix batches plus follow-ups).

Final state: 79 pages, 88 registry destinations, 453 contextual links, `npm run link-audit` passes with zero warnings (overuse thresholds: 60% general, 85% for pricing, rationale in `scripts/link-audit.mjs`).

The editorial rules that came out of the audit are binding and listed in CLAUDE.md under "Contextual linking rules": dedupe precedence In Short > body > FAQ, Key Points boxes unlinked, pricing pins must match the factual plan claim, anchor variants per key share one grammatical shape, retarget cap of 5 inbound per destination per batch.

The original findings and batch plan are in this file's history (`git show 18aabb2:AUDIT-REPORT.md`).
