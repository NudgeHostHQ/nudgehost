# Site-wide contextual linking audit

Date: 2026-06-12. Reference standard: `/blog/how-to-share-a-lovable-site` at HEAD (8360755).
Scope: all 78 content-map pages (host, viewers, converters, dev-tools, use-cases, compare, glossary, features, blog) plus the JSX marketing surfaces (homepage, pricing, about, silo hubs, blog index).

Tags: **BLOCKING** (live page is broken or makes a false claim regardless of anchor rotation), **FIX** (broken or false under at least one anchor variant, or a clear standards violation), **ADVISORY** (works but weak; improve opportunistically).

---

## 1. Link-audit output

`npm run link-audit` passes. Full output:

```
=== NudgeHost internal link audit ===

Registry destinations: 87
Pages scanned:         78
Contextual links:      413

Orphan destinations (in registry, linked by no page):
  ✓  none

Dangling tokens ({{key}} not in registry):
  ✓  none

Overuse check (linked from > 60% of pages):
  ⚠  pricing linked from 72/78 pages — vary anchor text carefully

Thin pages (< 3 contextual links):
  ✓  none

Pages with no money-page link:
  ✓  none

✓  Audit passed (warnings are advisory).
```

- **ADVISORY** The 87 registry destinations include one duplicate: `compare-tiiny` and `compare-nudgehost-vs-tiiny-host` both point at `/compare/nudgehost-vs-tiiny-host`. Inbound counting splits across the two keys (5 + 2), which slightly understates that page's inbound total and doubles its anchor pool. Consolidate to one key.
- **FIX** The pricing overuse warning (72/78) is the single largest graph problem. See section 4 for the diversification list.

## 2. Render-link-sentences fix and all-variant sentence review

**Tooling fix (committed with this report):** `scripts/render-link-sentences.mjs` only extracted double-quoted paragraph strings, so every backtick `text:` template literal in the v5 blog blocks (the bulk of the two newest posts' prose) was silently skipped. The paragraph extractor now matches backtick template literals as well. No content files use `${}` interpolation, so plain literal extraction is safe.

- **ADVISORY** Remaining tooling gap: the script only scans `body` / `intro` / `verdict` arrays. Blog `tldr` strings, the standalone FAQ constant arrays (`claudeArtifactFaqs`, `lovableFaqs`), and spoke-page `faqs` answers carry tokens too and are still not rendered by the script. This audit covered them with a separate pass; the script should eventually scan every string in a page chunk.

The review below renders every bare `{{key}}` token (no explicit `|anchor`) against **all** anchor variants in the registry. 43 of 447 tokens use an explicit anchor and are exempt. Findings are grouped by root cause, then listed page by page.

### Root causes (fix these at the registry level first)

1. **Mixed parts of speech inside one key's anchor list.** `host-pdf` mixes verb phrases with the noun "PDF link generator". `host-hub` mixes the verb "host any file type" with the noun "all of NudgeHost's hosting tools". Every viewer, converter, and dev-tool key mixes verb phrases with a "the X" noun ("the online PDF viewer", "the PNG to WebP converter", "the JSON formatter", "the Base64 encoder", "the URL encoder", "the JWT decoder", "the DOCX viewer", "the JSON viewer", "the CSV viewer", "the HEIC to JPG converter"). Feature keys carry bare nouns ("password protection", "custom domains", "live HTML rendering", "rich link preview") next to verb phrases. Glossary keys mix "what X is" clauses with plain nouns. A sentence written around one part of speech breaks when the rotation lands on the other. Harmonizing each key's variants to one grammatical shape would clear the majority of the FIX items below without touching body copy.
2. **The `pricing` key spans three incompatible shapes**: plan nouns ("the free plan", "the Pro plan", "a paid plan", "the paid tier"), a verb ("upgrade to Pro"), and meta nouns ("our pricing", "the pricing page"). Worse, many sentences assert plan facts ("X adds custom domains", "On X you get 10 active PDFs at 25MB") that are true for exactly one variant and false for the rest. These are factual errors on whichever pages the salt lands wrong.
3. **Relative-clause writing around verb anchors that contain their own object.** "a document you {{host-pdf}} opens inline" renders as "a document you host a PDF opens inline" under every variant, because the anchor already carries "a PDF". Every sentence of the shape "a NOUN you {{verb-key}} VERB..." is broken with all variants and is live-broken today.

### BLOCKING: sentences broken under every variant (live pages read as broken English now)

| Page | Sentence (excerpt) | Token | Status |
|---|---|---|---|
| blog/how-to-send-a-large-pdf-without-email | "Some hosts limit how much {{glossary-bandwidth}} a link can use" | glossary-bandwidth | all 3 variants break |
| blog/how-to-send-a-large-pdf-without-email | "the same way they would {{viewer-pdf}} any document" | viewer-pdf | all 3 break |
| features/zip-upload | "Either way the result is a {{glossary-static-site}}, served as plain files" | glossary-static-site | all 3 break after "a" |
| features/html-rendering | "What you get is a {{glossary-static-site}}, served as files" | glossary-static-site | all 3 break |
| features/full-screen-viewer | "A document you {{host-pdf}} renders in a clean viewer" | host-pdf | all 4 break |
| features/password-protection | "a portfolio you only {{use-case-recruiter}} once a callback is on the table" | use-case-recruiter | all 3 break (anchor carries its own object) |
| glossary/cors | "For a page you {{host-chatgpt-html}} that only uses CDN scripts" | host-chatgpt-html | all 3 break |
| glossary/cache | "an optimized image you {{converter-png-to-webp}} before uploading caches small" | converter-png-to-webp | all 3 break |
| glossary/seo | "like a portfolio or a small site you {{host-html}}" | host-html | all 3 break |
| glossary/qr-code | "a poster can point to a PDF you {{host-pdf}} without anyone squinting" | host-pdf | all 4 break |
| glossary/mime-type | "a document you {{host-pdf}} opens inline" | host-pdf | all 4 break |
| glossary/https | "A contract you {{host-pdf}} travels encrypted" | host-pdf | all 4 break |
| glossary/ssl-certificate | "a contract you {{host-pdf}} is encrypted end to end" | host-pdf | all 4 break |
| glossary/bandwidth | "a video you {{host-mp4}} uses far more bandwidth per view" | host-mp4 | all 3 break |
| glossary/drag-and-drop | "compared to the old {{glossary-ftp}} workflow it stands in for" | glossary-ftp | all 3 break ("the old the old FTP workflow workflow") |
| host/html | "A page like this is a {{glossary-static-site}}" | glossary-static-site | all 3 break |
| host/html | "a finished PDF export of your page can just as easily {{host-pdf}}" | host-pdf | all 4 break (subject is the export) |
| host/mp4 | "every play spends {{glossary-bandwidth}} on the full file again" | glossary-bandwidth | all 3 break |
| host/mp4 | "Hosted free with no watermark; {{pricing}} adds the Pro tier" | pricing | all 7 read wrong ("the Pro plan adds the Pro tier") |
| use-cases/send-large-pdf-without-email | "the file is served through a {{glossary-presigned-url}}" | glossary-presigned-url | all 3 break after "a" |
| use-cases/share-wedding-website | "Print the same link as a {{glossary-qr-code}} on the invitation" | glossary-qr-code | all 3 break |

### FIX: sentences broken or false under specific variants

Noun-in-verb-slot and verb-in-noun-slot breaks. Offending variant(s) in the last column.

| Page | Sentence (excerpt) | Token | Offending variant(s) |
|---|---|---|---|
| blog/how-to-send-a-large-pdf-without-email | "You {{host-pdf}} by dropping it onto NudgeHost" | host-pdf | "PDF link generator" |
| blog/how-to-send-a-large-pdf-without-email | "a round of {{glossary-file-compression}} before uploading can halve the size" | glossary-file-compression | "how file compression works", "what file compression is" |
| blog/how-to-share-a-resume-as-a-link | "You {{host-pdf}} by dropping the file onto NudgeHost" | host-pdf | "PDF link generator" |
| compare/tiiny-host-vs-linkyhost | "Each offers a {{host-pdf}}, each offers custom domains" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" (only the noun variant works) |
| compare/tiiny-host-vs-linkyhost | "Linkyhost is simpler if you just need to {{host-pdf}}" | host-pdf | "PDF link generator" |
| converters/pdf-to-jpg | "you can {{viewer-pdf}} with nothing to install" | viewer-pdf | "the online PDF viewer" |
| converters/pdf-to-jpg | "the next step when file size matters is to {{converter-png-to-webp}}" | converter-png-to-webp | "the PNG to WebP converter" |
| converters/pdf-to-jpg | "since NudgeHost will {{host-hub}}, the JPGs, the source PDF..." | host-hub | "all of NudgeHost's hosting tools" |
| converters/docx-to-pdf | "you can {{viewer-docx}} in seconds" | viewer-docx | "the DOCX viewer" |
| converters/docx-to-pdf | "the guidance on how to {{converter-pdf-to-jpg}} picks up where this page ends" | converter-pdf-to-jpg | "the PDF to JPG converter" |
| converters/png-to-webp | "NudgeHost will {{host-hub}}, so mockups, PDFs, and ZIPs..." | host-hub | "all of NudgeHost's hosting tools" |
| converters/heic-to-jpg | "Since NudgeHost will {{host-hub}}, the originals can live next to..." | host-hub | "all of NudgeHost's hosting tools" |
| converters/heic-to-jpg | "the next step is to {{converter-png-to-webp}}" | converter-png-to-webp | "the PNG to WebP converter" |
| dev-tools/json-formatter | "you can {{viewer-json}} as a natural companion step" | viewer-json | "the JSON viewer" |
| dev-tools/json-formatter | "You'll often need to {{dev-base64}}, {{dev-url-encoder}}, or {{dev-jwt-decoder}}" | all three | "the Base64 encoder", "the URL encoder", "the JWT decoder" |
| dev-tools/base64 | "{{dev-jwt-decoder}} is purpose-built for JSON web tokens" | dev-jwt-decoder | "inspect a JSON web token" (verb as subject) |
| dev-tools/base64 | "{{dev-json-formatter}} will tidy the result" | dev-json-formatter | "tidy up a JSON file" |
| dev-tools/base64 | "drop it into {{host-hub}} and send a link" | host-hub | "host any file type", "host a file" |
| dev-tools/url-encoder | "NudgeHost's {{dev-tools-hub}} keep all of them within reach" | dev-tools-hub | "all of NudgeHost's dev tools" (double possessive), "the dev tools" |
| dev-tools/url-encoder | "The same uploader lets you {{host-hub}} the same way" | host-hub | "all of NudgeHost's hosting tools" |
| dev-tools/jwt-decoder | "you can {{dev-base64}} more generally" | dev-base64 | "the Base64 encoder" |
| dev-tools/jwt-decoder | "you can {{host-hub}} and send the link" | host-hub | "all of NudgeHost's hosting tools" |
| dev-tools/jwt-decoder | "The rest of NudgeHost's {{dev-tools-hub}} sit alongside this decoder" | dev-tools-hub | "all of NudgeHost's dev tools", "the dev tools" |
| features/zip-upload | "it is quicker to {{features-paste-html}} and skip the archive" | features-paste-html | "raw HTML paste", "paste mode for HTML" |
| features/shareable-links | "Because the links are {{features-public-links}}" | features-public-links | "no account needed to view", "no login wall for recipients" |
| features/shareable-links | "NudgeHost generates {{features-link-previews}} for it" | features-link-previews | "rich link preview" (missing article), "link preview in Slack and iMessage" |
| features/custom-domains | "since the {{features-link-previews}} that unfurl in Slack and LinkedIn" | features-link-previews | "rich link preview" (singular + plural verb), "link preview in Slack and iMessage" (repeats "Slack") |
| glossary/https | "The encryption is handled by {{glossary-ssl-certificate}}" | glossary-ssl-certificate | "what an SSL certificate is" |
| glossary/ssl-certificate | "Together those enable {{glossary-https}}, the secure version of the web" | glossary-https | "why links are HTTPS", "what HTTPS means" |
| glossary/bandwidth | "The cost of serving is kept low by {{glossary-cdn}}" | glossary-cdn | "what a CDN is", "how a CDN speeds up files" |
| glossary/ftp | "NudgeHost replaces the entire dance with {{glossary-drag-and-drop}}" | glossary-drag-and-drop | "how drag and drop works" |
| glossary/password-protection | "On NudgeHost you can {{features-password-protection}}" | features-password-protection | "password protection" |
| glossary/custom-domain | "You can {{features-custom-domains}} on a paid tier" | features-custom-domains | "custom domains" |
| glossary/og-image | "When you {{host-pdf}} the preview reflects the document" | host-pdf | "PDF link generator" |
| glossary/presigned-url | "When you {{host-pdf}}, the file sits in private storage" | host-pdf | "PDF link generator" |
| glossary/mime-type | "a recipient can {{viewer-pdf}} without a download step" | viewer-pdf | "the online PDF viewer" |
| host/pdf | "we give you back a {{features-shareable-links}}, you send it" | features-shareable-links | "get a link for any file" |
| host/pdf | "you can {{converter-pdf-to-jpg}} and host the result" | converter-pdf-to-jpg | "the PDF to JPG converter" |
| host/pdf | "you can {{host-hub}} without learning anything new" | host-hub | "all of NudgeHost's hosting tools" |
| host/html | "since NudgeHost {{features-html-rendering}}" | features-html-rendering | "live HTML rendering" |
| host/html | "The same uploader will {{host-hub}}" | host-hub | "all of NudgeHost's hosting tools" |
| host/html | "{{viewers-hub}} cover that side" | viewers-hub | "view any file online", "open files in your browser" (verb-phrase subjects) |
| host/resume | "This page is really the {{host-pdf}} flow with open-tracking" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" (attributive slot wants the noun) |
| host/resume | "you can {{compare-hub}} and see how NudgeHost stacks up against the alternatives" | compare-hub | "see how NudgeHost compares", "weigh the alternatives" (both double the rest of the sentence) |
| host/docx | "the page on how to {{converter-docx-to-pdf}} covers the menus" | converter-docx-to-pdf | "the DOCX to PDF converter" |
| host/docx | "then {{host-pdf}}" | host-pdf | "PDF link generator" |
| host/docx | "lives in the same dashboard as {{host-hub}} for every other format" | host-hub | "host any file type", "host a file" |
| host/pptx | "run it through the {{host-pdf}} on NudgeHost" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" |
| host/pptx | "extends across {{host-hub}}: a PDF brief, a Word agenda, a CSV" | host-hub | "host any file type", "host a file" |
| host/xlsx | "the same {{host-hub}} flow that handles XLSX" | host-hub | "all of NudgeHost's hosting tools" |
| host/txt | "you can {{dev-json-formatter}} before you share it" | dev-json-formatter | "the JSON formatter" |
| host/md | "you can {{dev-json-formatter}} before you export" | dev-json-formatter | "the JSON formatter" |
| host/md | "The same {{host-hub}} flow handles every file in the bundle" | host-hub | "all of NudgeHost's hosting tools" |
| host/react-app | "that request answers to {{glossary-cors}}, the browser rule" | glossary-cors | "CORS errors", "cross-origin requests" (apposition no longer matches) |
| host/react-app | "you can {{converter-png-to-webp}} to shave them down first" | converter-png-to-webp | "the PNG to WebP converter" |
| host/vue-app | "running any heavy bundle images through the step to {{converter-png-to-webp}}" | converter-png-to-webp | "the PNG to WebP converter" |
| host/vue-app | "The same {{host-hub}} flow handles plain static sites" | host-hub | "all of NudgeHost's hosting tools" |
| host/json | "run it through {{dev-json-formatter}} first" | dev-json-formatter | "format your JSON", "tidy up a JSON file" (verbs after "through") |
| host/svg | "you can {{converter-png-to-webp}} as the matching step" | converter-png-to-webp | "the PNG to WebP converter" |
| host/image | "so {{converter-heic-to-jpg}} before hosting and the photo opens anywhere" | converter-heic-to-jpg | "the HEIC to JPG converter" |
| host/mp4 | "a {{host-pdf}} for the script" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" |
| host/mp3 | "NudgeHost will {{host-hub}} alongside the audio" | host-hub | "all of NudgeHost's hosting tools" |
| use-cases/share-resume-as-link | "you can {{features-custom-domains}} and remove NudgeHost branding" | features-custom-domains | "custom domains" |
| use-cases/send-portfolio-to-recruiter | "on the Pro tier you can {{features-custom-domains}}" | features-custom-domains | "custom domains" |
| use-cases/share-deck-with-client | "Run it through the {{host-pdf}} and send the link" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" |
| use-cases/share-deck-with-client | "you can {{features-password-protection}} or set an expiry" | features-password-protection | "password protection" |
| use-cases/share-deck-with-client | "{{host-hub}} can take each file one at a time" | host-hub | "host any file type", "host a file" |
| use-cases/share-wedding-website | "the {{host-pdf}} handles that the same way" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" |
| viewers/pdf | "the natural next step is the {{host-pdf}}" | host-pdf | "host a PDF", "share a PDF as a link", "put a PDF online" |
| viewers/pdf | "You can {{viewer-docx}} or any of the other file types" | viewer-docx | "the DOCX viewer" |
| viewers/docx | "you can {{viewer-pdf}} the same way" | viewer-pdf | "the online PDF viewer" |
| viewers/csv | "you can {{viewer-json}} the same way" | viewer-json | "the JSON viewer" |
| viewers/json | "When you need to share the file, {{host-hub}} and send a link" | host-hub | "all of NudgeHost's hosting tools" |
| viewers/json | "NudgeHost's {{dev-tools-hub}} sit naturally alongside this viewer" | dev-tools-hub | "all of NudgeHost's dev tools", "the dev tools" |

### FIX: pricing sentences that are factually wrong or ungrammatical under most variants

These assert a plan fact that only one variant satisfies. Whichever pages the salt lands on a wrong variant are publishing false plan claims today.

| Page | Sentence (excerpt) | Only-working variant(s) |
|---|---|---|
| blog/how-to-send-a-large-pdf-without-email | "{{pricing}} raises the ceiling to 250MB on Pro" | "the Pro plan" / "a paid plan" / "the paid tier" |
| blog/how-to-share-a-resume-as-a-link | "{{pricing}} adds a custom domain and removes NudgeHost branding" | paid-plan nouns; "the free plan" is false |
| blog/how-to-host-a-v0-export | "{{pricing}} adds custom domains and password protection" | paid-plan nouns |
| compare/tiiny-host-vs-linkyhost | "{{pricing}} for NudgeHost ... gives a more usable starting plan" | "the free plan" |
| compare/tiiny-host-vs-linkyhost | "{{pricing}} on NudgeHost gives you 10 active links at 25MB each" | "the free plan" |
| converters/pdf-to-jpg | "Passwords and custom domains are on {{pricing}}" | paid-plan nouns; "the free plan" is false |
| converters/docx-to-pdf | "Password protection and custom domains arrive when you {{pricing}}" | "upgrade to Pro" (the only verb) |
| converters/png-to-webp | "Larger limits and custom domains are on {{pricing}}" | paid-plan nouns |
| converters/heic-to-jpg | "Passwords and custom domains arrive when you {{pricing}}" | "upgrade to Pro" |
| dev-tools/json-formatter | "NudgeHost's paid plans on {{pricing}} are about hosting and sharing" | "the pricing page" (barely) |
| dev-tools/base64 | "The hosting side lives separately under {{pricing}}" | noun variants only |
| dev-tools/url-encoder | "Hosting plans are on {{pricing}}" | noun variants only |
| dev-tools/jwt-decoder | "Hosting plans, unrelated to the tools, are on {{pricing}}" | noun variants only |
| features/password-protection | "Password protection is part of {{pricing}} on the Pro tier" | none read well ("the Pro plan ... on the Pro tier" is circular) |
| features/custom-domains | "Custom domains live on the Pro and Team tiers, so {{pricing}} is where the feature starts" | paid-plan nouns; "the free plan" contradicts |
| features/public-links | "add a password or an expiry ... both on {{pricing}} for the Pro tier" | none read well |
| glossary/static-site | "{{pricing}} adds a custom domain when you want the page on your own address" | paid-plan nouns |
| glossary/https | "{{pricing}} adds custom domains that keep the same automatic HTTPS" | paid-plan nouns |
| glossary/ssl-certificate | "{{pricing}} adds custom domains that carry the same automatic certificate" | paid-plan nouns |
| glossary/bandwidth | "{{pricing}} raises the file-size ceiling for genuinely big files" | paid-plan nouns |
| glossary/custom-domain | "You can {{features-custom-domains}} on a paid tier, so {{pricing}} is where it starts" | paid-plan nouns |
| glossary (10 pages: 404-error, cors, cache, ftp, drag-and-drop, presigned-url, link-expiry, file-compression, qr-code, password-protection) | boilerplate closer "Hosting is free to start, and {{pricing}} covers/raises the limits/controls" | "the free plan" variant contradicts the first clause on every one of these |
| host/pdf | "On {{pricing}} you get 10 active PDFs at up to 25MB each" | "the free plan" only; all others publish wrong numbers |
| host/html | "Custom domains and unbranded links come with {{pricing}}" | paid-plan nouns |
| host/resume | "A custom domain and the removal of NudgeHost branding both come with {{pricing}}" | paid-plan nouns |
| host/docx | "Free with no signup; {{pricing}} adds the higher ceilings" | paid-plan nouns |
| host/pptx | "live on the paid tier; {{pricing}} when you need them" | "upgrade to Pro" |
| host/xlsx | "Ten active links on {{pricing}}, free with no signup" | "the free plan" only |
| host/txt | "for those, {{pricing}}, or trim the file first" | "upgrade to Pro" |
| host/md | "The same {{host-hub}} flow handles every file in the bundle, all under {{pricing}}" | noun variants |
| host/zip | "Ten active links are free with no signup, and {{pricing}} lifts the size ceiling" | paid-plan nouns |
| host/react-app | "Ten active builds on {{pricing}}, no signup needed" | "the free plan" only |
| host/vue-app | "Ten active links at 25MB each, free; {{pricing}} adds more headroom" | paid-plan nouns |
| host/json | "Ten active files free with no signup; {{pricing}} for higher limits" | paid-plan nouns |
| host/svg | "Free for ten active files; {{pricing}} for higher ceilings" | paid-plan nouns |
| host/chatgpt-html | "Free with no signup, and {{pricing}} sets the path up to higher tiers" | none read well |
| host/lovable-export | "Free for ten active links; {{pricing}} adds the higher ceilings" | paid-plan nouns |
| host/bolt-export | "Free for ten active links; {{pricing}} adds the higher ceilings" | paid-plan nouns |
| host/gif | "Free for ten active links; {{pricing}} adds more headroom" | paid-plan nouns |
| host/image | "No watermark, no signup, on {{pricing}}" | "the free plan" only |
| host/mp3 | "Free with no signup; {{pricing}} adds higher ceilings" | paid-plan nouns |
| use-cases/send-portfolio-to-recruiter | "{{pricing}} covers the basics, and on the Pro tier you can..." | "the free plan" only |
| use-cases/send-large-pdf-without-email | "For larger files, {{pricing}} sets the Pro ceilings" | paid-plan nouns |
| use-cases/share-deck-with-client | "For custom domains and branding removal, {{pricing}}; both are worth it" | "upgrade to Pro" |
| viewers/pdf | "custom domains, branded links, or password protection ... live on {{pricing}}" | paid-plan nouns |
| viewers/docx | "For custom domains, branded links, and password protection, {{pricing}}." | "upgrade to Pro" |
| viewers/csv | "Sharing extras are on {{pricing}}" | noun variants |
| viewers/json | "For account-level features, {{pricing}} on the Pro tier" | none read well |

The cheapest durable repair for the pricing rows: where the sentence states a plan fact, pin the anchor with the explicit form (`{{pricing|the Pro plan}}` etc.); reserve bare `{{pricing}}` for sentences that read with all seven variants.

### ADVISORY

- glossary/ftp, glossary/drag-and-drop: "You {{home}} by dropping the file..." reads redundantly when the rotation picks "drop a file to get started" ("drop ... by dropping").
- glossary/seo, og-image, mime-type: "{{home}} is where you start/drop the file in" is awkward with all three home variants.
- host/portfolio: "the {{host-pdf}} flow turns it into a URL" carries the same attributive-slot tension as host/resume.
- features/password-protection: "Pair the lock with {{features-link-previews}} you control" is rough with "rich link preview".

## 3. Per-page link inventory

78 pages. Columns: contextual link count (all tokens in the page chunk), cross-silo link present, money-page link present, destinations. Thresholds: below 3 links, duplicate destination on one page, above 12 links.

The JSX surfaces (homepage, /pricing, /about, the six silo hub pages, /blog index) carry no `{{token}}` prose by design; their links are the templated navigation tier from the two-link-systems model. No action needed there for this section (see section 6 for their copy drift).

| Page | Links | Cross-silo | Money | Flags | Destinations |
|---|---|---|---|---|---|
| blog/how-to-host-a-claude-artifact | 29 | y | y | **FIX: above 12; duplicates: host-claude-artifact, features-link-updating, features-full-screen-viewer, features-link-previews, features-html-rendering, features-public-links** | host-claude-artifact, features-link-updating, glossary-static-site, features-paste-html, features-full-screen-viewer, features-link-previews, compare-nudgehost-vs-tiiny-host, features-zip-upload, glossary-cdn, host-html, features-html-rendering, features-public-links, glossary-og-image, pricing, features-password-protection, features-custom-domains, host-lovable-export, host-v0-export, host-pdf |
| blog/how-to-share-a-lovable-site | 14 | y | y | ADVISORY: above 12 (reference page; 14 unique destinations, no duplicates) | host-lovable-export, features-link-updating, host-zip, host-html, glossary-static-site, glossary-custom-domain, pricing, use-case-recruiter, host-v0-export, blog-how-to-host-a-claude-artifact, compare-nudgehost-vs-tiiny-host, features-paste-html, host-react-app, host-portfolio |
| blog/how-to-send-a-large-pdf-without-email | 7 | y | y | ok | host-pdf, pricing, glossary-bandwidth, glossary-file-compression, viewer-pdf, host-zip, use-case-large-pdf |
| blog/how-to-share-a-resume-as-a-link | 6 | y | y | ok | host-pdf, glossary-og-image, host-portfolio, use-case-resume-link, use-case-recruiter, pricing |
| blog/how-to-host-a-v0-export | 6 | y | y | ok | host-html, host-v0-export, host-react-app, glossary-static-site, use-case-deck, pricing |
| compare/nudgehost-vs-tiiny-host | 5 | y | y | ok | home, host-pdf, host-html, compare-linkyhost, compare-tiiny-vs-linkyhost |
| compare/nudgehost-vs-linkyhost | 3 | y | y | ok | home, host-pdf, compare-tiiny |
| compare/tiiny-host-vs-linkyhost | 7 | y | y | **FIX: duplicates: host-pdf x2, pricing x2** | host-html, host-pdf, pricing, compare-tiiny, compare-linkyhost |
| converters/pdf-to-jpg | 5 | y | y | ok | host-pdf, viewer-pdf, converter-png-to-webp, host-hub, pricing |
| converters/docx-to-pdf | 5 | y | y | ok | host-pdf, use-case-resume-link, viewer-docx, converter-pdf-to-jpg, pricing |
| converters/png-to-webp | 5 | y | y | ok | host-html, converter-heic-to-jpg, host-hub, dev-tools-hub, pricing |
| converters/heic-to-jpg | 5 | y | y | ok | host-zip, host-hub, converter-png-to-webp, viewer-pdf, pricing |
| dev-tools/json-formatter | 7 | y | y | ok | viewer-json, host-json, dev-base64, dev-url-encoder, dev-jwt-decoder, dev-tools-hub, pricing |
| dev-tools/base64 | 5 | y | y | ok | dev-jwt-decoder, dev-json-formatter, host-hub, dev-tools-hub, pricing |
| dev-tools/url-encoder | 6 | y | y | ok | dev-base64, dev-json-formatter, dev-tools-hub, host-html, host-hub, pricing |
| dev-tools/jwt-decoder | 5 | y | y | ok | dev-base64, dev-json-formatter, host-hub, dev-tools-hub, pricing |
| features/link-updating | 5 | y | y | ok | host-claude-artifact, host-html, glossary-404-error, use-case-recruiter, pricing |
| features/zip-upload | 5 | y | y | ok | features-paste-html, glossary-static-site, host-react-app, host-zip, pricing |
| features/paste-html | 5 | y | y | ok | host-claude-artifact, host-chatgpt-html, features-link-updating, home, pricing |
| features/password-protection | 5 | y | y | ok | host-pdf, glossary-password-protection, use-case-recruiter, features-link-previews, pricing |
| features/custom-domains | 5 | y | y | ok | glossary-custom-domain, glossary-dns, glossary-ssl-certificate, features-link-previews, pricing |
| features/full-screen-viewer | 6 | y | y | ok | host-pdf, host-html, host-image, features-public-links, compare-tiiny, pricing |
| features/link-previews | 5 | y | y | ok | glossary-og-image, host-pdf, host-image, features-link-updating, pricing |
| features/public-links | 5 | y | y | ok | host-pdf, compare-tiiny, features-full-screen-viewer, pricing, home |
| features/html-rendering | 6 | y | y | ok | host-html, glossary-cdn, host-claude-artifact, features-paste-html, glossary-static-site, pricing |
| features/shareable-links | 5 | y | y | ok | compare-tiiny, glossary-qr-code, features-public-links, features-link-previews, home |
| glossary/static-site | 3 | y | y | ok | host-html, glossary-cdn, pricing |
| glossary/cdn | 3 | y | y | ok | glossary-cache, host-image, pricing |
| glossary/404-error | 3 | y | y | ok | use-case-recruiter, glossary-link-expiry, pricing |
| glossary/https | 3 | y | y | ok | glossary-ssl-certificate, host-pdf, pricing |
| glossary/cors | 3 | y | y | ok | host-react-app, host-chatgpt-html, pricing |
| glossary/dns | 3 | y | y | ok | glossary-custom-domain, pricing, host-html |
| glossary/ftp | 3 | N | y | **FIX: no cross-silo link** | glossary-drag-and-drop, home, pricing |
| glossary/cache | 3 | y | y | ok | host-html, converter-png-to-webp, pricing |
| glossary/seo | 3 | y | y | ok | host-html, glossary-og-image, home |
| glossary/og-image | 3 | y | y | ok | host-pdf, use-case-deck, home |
| glossary/qr-code | 3 | y | y | ok | use-case-wedding, host-pdf, pricing |
| glossary/file-compression | 3 | y | y | ok | host-zip, converter-png-to-webp, pricing |
| glossary/mime-type | 3 | y | y | ok | host-pdf, viewer-pdf, home |
| glossary/ssl-certificate | 3 | y | y | ok | glossary-https, host-pdf, pricing |
| glossary/bandwidth | 3 | y | y | ok | glossary-cdn, host-mp4, pricing |
| glossary/drag-and-drop | 3 | N | y | **FIX: no cross-silo link** | home, glossary-ftp, pricing |
| glossary/presigned-url | 3 | y | y | ok | host-pdf, glossary-link-expiry, pricing |
| glossary/link-expiry | 3 | y | y | ok | glossary-password-protection, use-case-large-pdf, pricing |
| glossary/password-protection | 4 | y | y | ok | use-case-deck, glossary-link-expiry, features-password-protection, pricing |
| glossary/custom-domain | 4 | y | y | ok | features-custom-domains, pricing, host-html, use-case-recruiter |
| host/pdf | 10 | y | y | ok | features-shareable-links, viewer-pdf, glossary-mime-type, converter-pdf-to-jpg, converters-hub, host-resume, pricing, use-case-large-pdf, blog-how-to-send-a-large-pdf-without-email, host-hub |
| host/html | 10 | y | y | ok | glossary-static-site, features-html-rendering, host-zip, host-claude-artifact, use-case-wedding, pricing, glossary-seo, host-hub, host-pdf, viewers-hub |
| host/claude-artifact | 9 | y | y | ok | features-paste-html, host-html, blog-how-to-host-a-claude-artifact, host-zip, host-pdf, pricing, features-link-updating, use-case-deck, use-cases-hub |
| host/resume | 6 | y | y | ok | host-pdf, host-portfolio, use-case-recruiter, glossary-404-error, pricing, compare-hub |
| host/portfolio | 7 | y | y | ok | host-pdf, host-html, host-image, host-zip, use-case-recruiter, pricing, host-hub |
| host/docx | 4 | y | y | ok | converter-docx-to-pdf, host-pdf, pricing, host-hub |
| host/pptx | 4 | y | y | ok | host-pdf, use-case-deck, host-hub, pricing |
| host/xlsx | 3 | N | y | **FIX: no cross-silo link** | host-pdf, host-hub, pricing |
| host/txt | 5 | y | y | ok | dev-json-formatter, host-html, host-md, pricing, host-hub |
| host/md | 6 | y | y | ok | dev-json-formatter, host-html, host-txt, host-pdf, host-hub, pricing |
| host/zip | 6 | y | y | ok | glossary-file-compression, host-react-app, host-html, host-claude-artifact, features-link-updating, pricing |
| host/react-app | 7 | y | y | ok | glossary-cors, converter-png-to-webp, host-zip, host-claude-artifact, host-v0-export, host-vue-app, pricing |
| host/vue-app | 5 | y | y | ok | host-react-app, host-html, pricing, converter-png-to-webp, host-hub |
| host/json | 3 | y | y | ok | dev-json-formatter, host-zip, pricing |
| host/svg | 4 | y | y | ok | host-html, pricing, converter-png-to-webp, host-image |
| host/chatgpt-html | 5 | y | y | ok | host-claude-artifact, host-html, host-zip, pricing, use-case-deck |
| host/lovable-export | 7 | y | y | ok | blog-how-to-share-a-lovable-site, host-react-app, host-v0-export, host-bolt-export, pricing, use-case-recruiter, host-hub |
| host/v0-export | 8 | y | y | ok | blog-how-to-host-a-v0-export, host-claude-artifact, host-chatgpt-html, pricing, glossary-dns, use-case-deck, host-hub, host-zip |
| host/bolt-export | 7 | y | y | ok | host-react-app, host-zip, pricing, use-case-recruiter, host-hub, host-lovable-export, host-v0-export |
| host/image | 6 | y | y | ok | converter-png-to-webp, converter-heic-to-jpg, host-svg, pricing, host-zip, host-html |
| host/gif | 5 | y | y | ok | host-mp4, pricing, host-html, host-image, converters-hub |
| host/mp4 | 8 | y | y | ok | glossary-bandwidth, host-gif, pricing, use-case-deck, host-hub, host-pdf, host-image, host-mp3 |
| host/mp3 | 4 | y | y | ok | pricing, host-mp4, use-case-deck, host-hub |
| use-cases/share-resume-as-link | 6 | y | y | ok | host-resume, converter-docx-to-pdf, use-case-recruiter, pricing, features-custom-domains, blog-how-to-share-a-resume-as-a-link |
| use-cases/send-portfolio-to-recruiter | 6 | y | y | ok | host-pdf, host-html, host-zip, use-case-resume-link, pricing, features-custom-domains |
| use-cases/send-large-pdf-without-email | 6 | y | y | ok | host-pdf, converter-pdf-to-jpg, host-hub, host-zip, glossary-presigned-url, pricing |
| use-cases/share-deck-with-client | 8 | y | y | ok | host-pdf, host-html, host-pptx, features-link-previews, features-password-protection, host-hub, host-zip, pricing |
| use-cases/share-wedding-website | 6 | y | y | ok | host-html, host-pdf, host-image, host-zip, glossary-qr-code, pricing |
| viewers/pdf | 4 | y | y | ok | host-pdf, converter-pdf-to-jpg, viewer-docx, pricing |
| viewers/docx | 5 | y | y | ok | host-docx, converter-docx-to-pdf, host-pdf, viewer-pdf, pricing |
| viewers/csv | 6 | y | y | ok | host-hub, host-xlsx, viewer-json, dev-json-formatter, home, pricing |
| viewers/json | 5 | y | y | ok | dev-json-formatter, viewer-csv, host-hub, dev-tools-hub, pricing |

Summary of section 3 flags:

- **FIX** blog/how-to-host-a-claude-artifact: 29 links with 6 destinations linked more than once. Six of the duplicates come from feature keys linked in both prose and the rich FAQ block. Trim to one link per destination and aim for the Lovable post's 14.
- **FIX** compare/tiiny-host-vs-linkyhost: host-pdf and pricing each appear twice.
- **FIX** Pages with no cross-silo link: glossary/ftp, glossary/drag-and-drop, host/xlsx. (host/xlsx links only inside its own silo plus pricing; the two glossary pages link only glossary plus money pages.)
- No page is below 3 links; the Lovable post at 14 is the only other page above 12 and it is the reference standard, so treat 12 to 15 as acceptable for long blog posts.

## 4. Destination health

- **Orphans (zero inbound contextual links): none.** Every registry destination has at least one inbound page.
- **Above 60% of pages: `pricing` (72/78).** No other destination is close (next: host-pdf 33, host-html 28, host-hub 24, host-zip 18).
- **Registry entries with fewer than 3 anchor variants: none.** Every entry has 3 or more (pricing 7, host-pdf 4, everything else 3).
- **ADVISORY** Long-tail weakness rather than orphanhood: 24 destinations have exactly 1 inbound link (host-docx, host-pptx, host-gif, host-md, host-txt, host-svg, host-json, host-mp3, host-vue-app, host-xlsx, host-bolt-export, dev-url-encoder, viewer-csv, glossary-cache, glossary-cors, glossary-ftp, glossary-https, glossary-mime-type, glossary-seo, glossary-presigned-url, glossary-drag-and-drop, features-shareable-links, features-zip-upload, use-cases-hub, viewers-hub, compare-hub and the 4 blog posts other than the Claude one). These are the natural beneficiaries of pricing diversification below.

### Pricing diversification candidates (20 pages where the pricing link adds least value)

All 20 use a generic plan mention not tied to any plan feature the page is about. Each page keeps a money link by swapping in `{{home}}` (currently only 11/78 pages link home, so there is ample headroom) or rewriting the closer around a feature destination.

1. dev-tools/json-formatter ("NudgeHost's paid plans on {{pricing}} are about hosting and sharing, not the tools themselves" - the page itself says pricing is irrelevant here)
2. dev-tools/base64 ("The hosting side lives separately under {{pricing}}")
3. dev-tools/url-encoder ("Hosting plans are on {{pricing}}")
4. dev-tools/jwt-decoder ("Hosting plans, unrelated to the tools, are on {{pricing}}")
5. glossary/404-error ("Hosting is free to start, and {{pricing}} covers the higher limits")
6. glossary/cors (same boilerplate)
7. glossary/cache (same)
8. glossary/ftp (same; also needs a cross-silo link, so this swap solves two findings)
9. glossary/dns ("the feature ... lives on a paid tier, so {{pricing}} is where that starts" - the feature tie is to custom domains, already linked)
10. glossary/presigned-url (boilerplate closer)
11. glossary/drag-and-drop (boilerplate; also needs a cross-silo link)
12. glossary/file-compression (boilerplate)
13. glossary/bandwidth (boilerplate; the page already explains no visitor caps without needing the plan link)
14. glossary/qr-code ("Hosting and the QR code are free, and {{pricing}} only enters the picture for things like custom domains")
15. glossary/https (boilerplate)
16. glossary/ssl-certificate (boilerplate)
17. glossary/cdn ("{{pricing}} keeps that true at higher limits")
18. glossary/static-site ("{{pricing}} adds a custom domain" - the custom-domain feature page is the better target)
19. glossary/link-expiry (boilerplate)
20. viewers/csv ("Sharing extras are on {{pricing}}")

Keep pricing on pages with a real plan tie: features/password-protection, features/custom-domains, host/pdf (plan numbers), compare pages, use-cases with Pro-feature mentions, glossary/password-protection and glossary/custom-domain (tier-gated features).

## 5. New-destination coverage

For each new or strengthened destination: current inbound sources, then the most natural additional source pages with where the link would sit.

### /host/zip (host-zip) - inbound 18, already healthy
Current sources cover the AI-builder and use-case silos well. Remaining natural additions:
1. host/pptx - the "supporting documents alongside the deck" sentence pattern already used on share-deck.
2. host/txt - the "server logs and chat exports" paragraph (zip a log bundle before uploading).
3. host/svg - the icon-sprite/asset-set paragraph (a folder of SVGs travels as one archive).
4. glossary/static-site - the closing "host one on NudgeHost" paragraph (a zipped site folder serves as a live site).
5. use-cases/share-resume-as-link - the "resume plus portfolio" paragraph (bundle work samples as one archive link).

### /host/docx (host-docx) - inbound 1 (viewers/docx)
1. converters/docx-to-pdf - the paragraph about checking the original Word file; "or host the DOCX itself" is the natural clause.
2. host/pdf - the "if your PDF is really a resume" pattern extends: "if your document is still a Word file".
3. host/xlsx - the Office-formats paragraph ("the PDFs and DOCXes that travel alongside it") already names DOCX without linking it.
4. host/pptx - the "PDF brief, Word agenda, CSV" list sentence names a Word agenda.
5. use-cases/share-resume-as-link - the "most resumes are PDFs; if yours is a Word file" sentence.
6. blog/how-to-share-a-resume-as-a-link - the Word-format paragraph in the body.
7. viewers/pdf - the "other file types NudgeHost handles" sentence could point at hosting a DOCX rather than only viewing.

### /viewers/docx (viewer-docx) - inbound 2 (converters/docx-to-pdf, viewers/pdf)
1. host/docx - the recipient-side sentence ("the recipient reads the document in their browser") describes exactly this viewer.
2. use-cases/share-resume-as-link - the "arrives as a clean URL" paragraph; the recruiter opens it in the browser viewer.
3. blog/how-to-share-a-resume-as-a-link - same recipient-experience angle.
4. features/full-screen-viewer - the document-viewer paragraph currently links only host-pdf; a Word document renders in the same viewer.
5. viewers/csv - the sibling-viewer closing paragraph (currently links viewer-json only).

### /host/lovable-export (host-lovable-export) - inbound 3 (both blog posts, host/bolt-export)
1. host/react-app - a Lovable export is a React build; the "same pipeline" paragraph.
2. host/chatgpt-html - the "any other AI builder" sentence.
3. host/claude-artifact - the cross-AI-tool paragraph near the use-cases link.
4. features/zip-upload - the build-tools paragraph ("run your production build, zip the output folder").
5. glossary/static-site - AI-builder exports are static builds; the definition paragraph.
6. use-cases/send-portfolio-to-recruiter - the "built site or interactive piece" sentence (job-hunting builders shipping a Lovable app).

### /host/v0-export (host-v0-export) - inbound 6
1. features/paste-html - the AI-output paragraph (v0 preview HTML pastes the same way Claude/ChatGPT output does).
2. host/html - the AI-flow paragraph currently links only host-claude-artifact.
3. use-cases/share-deck-with-client - the working-demo-as-pitch sentence (mirrors what the v0 page itself says about decks).
4. glossary/cors - the "something an AI tool built" sentence names the exact failure mode v0 apps hit.
5. host/image - weak; prefer the four above plus host/chatgpt-html's "other AI builders" line.

### /blog/how-to-host-a-claude-artifact (blog-how-to-host-a-claude-artifact) - inbound 2
1. features/paste-html - "For the full walkthrough, read..." closer, the pattern host/claude-artifact already uses.
2. features/html-rendering - the Claude-artifact paragraph already links the tool page; the post is the deeper resource.
3. host/chatgpt-html - the sibling-AI paragraph (the post covers the copy-the-source workflow in full).
4. glossary/cdn - the "libraries loaded from a CDN" paragraph mirrors the post's section on external libraries.
5. host/v0-export - the "same flow works when you host a Claude artifact" sentence.

### /blog/how-to-share-a-lovable-site (blog-how-to-share-a-lovable-site) - inbound 1
1. host/react-app - "for the AI-builder version of this flow, read..." closer.
2. host/bolt-export - sibling builder; the post's re-export section covers Bolt explicitly.
3. host/v0-export - same sibling pattern.
4. features/zip-upload - the front-end-build paragraph; the post is the worked example.
5. glossary/custom-domain - the post has a whole section on putting the app on your own domain.
6. use-cases/send-portfolio-to-recruiter - the post's job-hunting section.

### Subdomain serving as a concept
- **FIX** There is no destination for the concept. nudgehost.site subdomain serving is now described on at least 10 pages (host/zip, features/zip-upload, host/react-app, host/vue-app, host/portfolio, host/lovable-export, all three AI-builder pages, both new blog posts) and none of them can link to an explainer. Create one destination (suggest `glossary/subdomain` or `features/subdomain-serving`), register it with grammatically consistent anchors, and add inbound links from: host/zip, features/zip-upload, host/react-app, host/vue-app, host/lovable-export, host/v0-export, host/bolt-export, glossary/custom-domain (contrast: your domain vs the default subdomain), glossary/dns, blog/how-to-share-a-lovable-site.

## 6. Copy-drift scan

### ZIP / multi-file serving claims (sites serve at {slug}.nudgehost.site; only single files serve at nudgehost.com/f/)

- **BLOCKING** `lib/features-content.ts` (features/shareable-links, lines ~440 to 470): the entire page asserts the old model.
  - line 440: title "Shareable Links | Short nudgehost.com URLs for any file"
  - line 442: description "Every uploaded file gets a short nudgehost.com link."
  - line 444: lead "Every file you upload gets a short, readable nudgehost.com link."
  - line 446: keyPoint "Every uploaded file gets a short nudgehost.com/f/[slug] link with a readable slug."
  - line 449: keyPoint "The same link format works for a PDF, an HTML page, a ZIP, or any other file."
  - line 455: body "a PDF, an HTML page, and a ZIP archive all produce a link of the same clean shape."
  - line 467: FAQ "They follow the nudgehost.com/f/[slug] format..."
  A ZIP containing a site produces a {slug}.nudgehost.site link, not an /f/ path. Rewrite the page to describe both shapes (or scope it to single-file links explicitly).
- **FIX** `app/page.tsx:377` - Free plan card feature bullet "nudgehost.com subdomain". Wrong twice: file links are nudgehost.com/f/ paths, and site subdomains live on nudgehost.site.
- **FIX** `app/pricing/page.tsx:54` - same "nudgehost.com subdomain" bullet.

Everything else checked clean: host/zip, features/zip-upload, host/react-app, host/vue-app, host/portfolio, the AI-builder pages, compare pages, and both new blog posts all correctly say nudgehost.site / "its own subdomain" for served sites, and nudgehost.com only for single-file links.

### "Free trial" language
- None found anywhere in lib/, app/, or components/. Clean.

### Em-dashes in user-facing strings
- None found in any content map string or JSX text. The only hits are code comments (`components/spoke-page.tsx:188`, `lib/viewers-content.ts:16`), which CLAUDE.md allows. Clean.

### Banned vocabulary
- **FIX** `lib/host-content.ts:343` (host/pptx FAQ answer): "an awkward download for anyone outside Apple's ecosystem". "Ecosystem" used as metaphor is banned. Rewrite (e.g., "for anyone not on Apple devices").
- **ADVISORY** `lib/glossary-content.ts:608` (glossary/drag-and-drop): "whether you are at a desk or sharing something from the train". Not a sentence opener so it does not violate the letter of the rule; noted for awareness.
- All other banned terms (delve, crucial, robust, leverage, unlock, seamless, journey, furthermore, moreover, paragraph-opening Additionally, etc.): zero hits in user-facing copy. The "unlock" hits are code identifiers only.

## 7. Blog template parity

Parity target: the Lovable post. Matrix (y = present):

| Post | Links in In Short box | Also useful block | In-body FAQ block | Bottom gradient CTA | Modified date present |
|---|---|---|---|---|---|
| how-to-share-a-lovable-site (target) | y | y | y | y | y (2026-06-12, badge shows) |
| how-to-host-a-claude-artifact | y | y | y | y | y (2026-06-12) |
| how-to-send-a-large-pdf-without-email | **N** | **N** | **N** | **N** | N (modified == published 2026-05-25) |
| how-to-share-a-resume-as-a-link | **N** | **N** | **N** | **N** | N (modified == published) |
| how-to-host-a-v0-export | **N** | **N** | **N** | **N** | N (modified == published) |

- **FIX** The three older posts use v5 block bodies but carry none of the template's conversion or schema surfaces: no tokens in the tldr, no related/Also-useful block, no in-body FAQ block (their `faqs` arrays feed JSON-LD only), and no bottom gradient CTA. Bring each to the Lovable layout. Updating them will also produce a real modified date.

## 8. Fabricated-content scan

- **BLOCKING** `lib/blog-content.ts:247-249` (how-to-host-a-claude-artifact, testimonial block): "One freelance designer used this workflow to share 12 Claude prototypes with clients last month. Each link stayed live across revisions, and none of the recipients needed a NudgeHost account to view the work." Unattributed, unverifiable usage anecdote with a specific count. Verify with a real source or remove the block.
- **ADVISORY** `app/page.tsx:173` (homepage social-proof strip): heading "Trusted by people sharing files for" above a list of use-case categories. No customer is named and no number is claimed, but the "Trusted by" framing implies adoption evidence that does not exist. Consider "Built for..." or similar.
- Verified clean: no aggregateRating or review JSON-LD anywhere (comments in `app/page.tsx`, `app/pricing/page.tsx`, and `components/spoke-page.tsx` document its deliberate removal pending real reviews); no named-customer anecdotes, star ratings, user counts, or revenue/usage statistics anywhere else in marketing copy. Competitor facts on compare pages (Tiiny.host 3MB free cap, expiry rules) are external claims, not fabricated social proof; spot-check them separately for accuracy.

---

## Proposed batch plan

Cross-cutting prerequisite (do first, enables everything in batches 1 to 4): harmonize anchor grammar in `lib/internal-links.ts` so each key's variants share one part of speech (host-pdf, host-hub, all viewer/converter/dev-tool keys, the feature noun variants, the glossary "what X is" clauses), consolidate the duplicate compare-tiiny key, and adopt the rule that any sentence asserting a plan fact pins its anchor with `{{pricing|...}}`. Many table rows above then need no body-copy edit at all; re-run `node scripts/render-link-sentences.mjs` and `npm run link-audit` after each batch.

**Batch 1 - blocking grammar, copy drift, fabricated content (12 pages):** homepage, /pricing, features/shareable-links, features/zip-upload, features/html-rendering, features/full-screen-viewer, features/password-protection, host/html, host/pdf, host/mp4, blog/how-to-send-a-large-pdf-without-email, blog/how-to-host-a-claude-artifact (testimonial removal plus the 6 duplicate links and trim from 29).

**Batch 2 - blocking relative-clause breaks in glossary and use-cases (12 pages):** glossary/cors, glossary/cache, glossary/seo, glossary/qr-code, glossary/mime-type, glossary/ssl-certificate, glossary/https, glossary/bandwidth, glossary/drag-and-drop, use-cases/send-large-pdf-without-email, use-cases/share-wedding-website, use-cases/share-deck-with-client.

**Batch 3 - single-variant grammar and pricing-fact fixes: converters, dev-tools, viewers, compare (13 pages):** converters/pdf-to-jpg, converters/docx-to-pdf, converters/png-to-webp, converters/heic-to-jpg, dev-tools/json-formatter, dev-tools/base64, dev-tools/url-encoder, dev-tools/jwt-decoder, viewers/pdf, viewers/docx, viewers/csv, viewers/json, compare/tiiny-host-vs-linkyhost (including its duplicate links).

**Batch 4 - remaining host-silo grammar and pricing-fact fixes (15 pages):** host/resume, host/portfolio, host/docx, host/pptx, host/xlsx (plus its missing cross-silo link), host/txt, host/md, host/zip, host/react-app, host/vue-app, host/json, host/svg, host/chatgpt-html, host/image, host/mp3 (sweep host/gif, host/lovable-export, host/bolt-export pricing closers in the same pass; they are one-line fixes).

**Batch 5 - new-destination inbound links (12 source pages):** converters/docx-to-pdf, host/pdf, host/xlsx, host/pptx, use-cases/share-resume-as-link, blog/how-to-share-a-resume-as-a-link (host-docx and viewer-docx links); host/react-app, host/chatgpt-html, features/paste-html, features/html-rendering, use-cases/send-portfolio-to-recruiter, glossary/cdn (lovable/v0/blog-post links). Register no new keys; all destinations already exist.

**Batch 6 - blog parity and the subdomain destination (8 to 10 pages):** upgrade the three old blog posts to the Lovable template (In Short links, Also useful, in-body FAQ, bottom CTA); create the subdomain-serving destination page, register it, and add first inbound links from host/zip, features/zip-upload, host/react-app, host/vue-app, and the AI-builder pages.

**Batch 7 - pricing diversification (20 pages, two passes of 10):** the section 4 list. Pass A: the 4 dev-tools pages, viewers/csv, glossary/404-error, cors, cache, ftp, dns. Pass B: glossary/presigned-url, drag-and-drop, file-compression, bandwidth, qr-code, https, ssl-certificate, cdn, static-site, link-expiry. Each page keeps a money link via {{home}} or a rewritten feature-tied closer; re-run link-audit to confirm pricing drops below the 60% threshold (47/78 or fewer).
