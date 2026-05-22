// Shared content type for every programmatic spoke page across all silos
// (host, viewers, converters, dev-tools, use-cases, compare).
//
// Each silo keeps its own content map (lib/<silo>-content.ts) but they all
// conform to this shape, so the single <SpokePage /> renderer in
// components/spoke-page.tsx can render any of them.

export type Faq = { q: string; a: string };

export type SpokeContent = {
  slug: string;
  name: string; // human label, e.g. "PDF" or "PDF to JPG"
  title: string; // <title> tag
  description: string; // meta description
  h1: string;
  lead: string; // intro paragraph under the H1

  // Optional TL;DR / key points block, shown near the top of the page below the
  // lead. 3-4 short factual sentences that summarize the page. This is the
  // prose AI Overviews are most likely to lift verbatim — but write it for a
  // human who wants the gist fast, not for the model. Google's May 2026 AI
  // search guide explicitly warns against "chunking" content for AI; this is
  // a single short summary block, not a chunked page.
  keyPoints?: string[];

  body: string[]; // body paragraphs — may contain {{key}} contextual-link tokens
  faqs: Faq[];
  // Keys from the TOOL_REGISTRY in components/related-tools.tsx
  relatedToolSlugs: string[];

  // Optional pills shown inside the upload widget (only used on "upload"
  // hero variant). E.g. ["PDF", "Encrypted PDF", "Up to 25MB free"].
  filePillExamples?: string[];

  // Optional short filetype label for inline CTAs that read "Drop your X
  // here". On converters, name is "PDF to JPG" which doesn't fit that
  // phrasing — set this to the source format (e.g. "PDF") instead. Falls
  // back to name when unset.
  filetypeShort?: string;

  // Optional authoring metadata. When set, the page emits Article schema and
  // shows a small byline. Use on pages most likely to be cited by AI Overviews
  // (use cases, blog posts, comparisons). Pure tool pages can leave these
  // empty and skip the Article schema.
  author?: string; // e.g. "Mark Wilson, founder"
  datePublished?: string; // ISO 8601, e.g. "2026-05-21"
  dateModified?: string; // ISO 8601
};

// Per-silo configuration: how the silo presents itself.
export type SiloConfig = {
  key: string; // e.g. "viewers"
  basePath: string; // e.g. "/viewers"
  hubLabel: string; // breadcrumb + nav label, e.g. "Viewers"
  // The kind of JSON-LD a spoke in this silo should emit.
  schemaType: "SoftwareApplication" | "WebApplication";
  // Hero call-to-action style: an upload widget, or a simple CTA button.
  heroVariant: "upload" | "cta";
  // Verb used in CTA copy, e.g. "share", "view", "convert".
  ctaVerb: string;
  // Whether spoke pages in this silo render a visible "By {author} · {date}"
  // byline below the lead. Article schema is emitted on every spoke regardless;
  // this flag only controls the visible byline. Set true on use-cases and blog
  // silos — the page types most likely to be cited by AI Overviews.
  showByline?: boolean;
};
