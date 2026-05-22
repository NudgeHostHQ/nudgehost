// Central registry of every internal-linkable destination on the site.
//
// This is the "contextual link map" referenced in STRATEGY.md. It exists so that:
//  1. Anchor text is varied — each destination carries several natural phrasings,
//     and the template rotates them so the same anchor isn't repeated sitewide.
//  2. There is one source of truth for hrefs — rename a route once, here.
//  3. Pages can be checked for orphan status (no contextual links pointing in).
//
// Body copy in lib/host-content.ts (and the other silo content files) references
// these by key using the {{key}} token syntax — see renderProse() in
// components/contextual-prose.tsx.

export type LinkTarget = {
  href: string;
  // Several natural-language anchors for the same destination.
  // The prose renderer picks one; never hard-code anchor text in body copy.
  anchors: string[];
  // "money" pages get priority — every long-tail page should link to at least one.
  isMoneyPage?: boolean;
};

export const internalLinks: Record<string, LinkTarget> = {
  // --- Money pages -----------------------------------------------------------
  pricing: {
    href: "/pricing",
    anchors: ["the free plan", "upgrade to Pro", "our pricing", "a paid plan"],
    isMoneyPage: true,
  },
  home: {
    href: "/",
    anchors: ["drop a file to get started", "share a file now", "start for free"],
    isMoneyPage: true,
  },

  // --- Host silo -------------------------------------------------------------
  "host-hub": {
    href: "/host",
    anchors: ["host any file type", "all of NudgeHost's hosting tools", "host a file"],
  },
  "host-pdf": {
    href: "/host/pdf",
    anchors: ["host a PDF", "share a PDF as a link", "PDF link generator", "put a PDF online"],
  },
  "host-html": {
    href: "/host/html",
    anchors: ["host an HTML file", "publish an HTML page", "put an HTML file online"],
  },
  "host-zip": {
    href: "/host/zip",
    anchors: ["host a ZIP", "share a ZIP file", "upload a ZIP"],
  },
  "host-claude-artifact": {
    href: "/host/claude-artifact",
    anchors: ["host a Claude artifact", "publish a Claude artifact", "put a Claude output online"],
  },
  "host-resume": {
    href: "/host/resume",
    anchors: ["share your resume as a link", "host your resume", "send your CV as a link"],
  },
  "host-portfolio": {
    href: "/host/portfolio",
    anchors: ["host your portfolio", "share a portfolio with one link"],
  },

  // --- Viewers silo ----------------------------------------------------------
  "viewers-hub": {
    href: "/viewers",
    anchors: ["view any file online", "all of NudgeHost's file viewers"],
  },
  "viewer-pdf": {
    href: "/viewers/pdf",
    anchors: ["view a PDF in your browser", "open a PDF online", "the online PDF viewer"],
  },
  "viewer-docx": {
    href: "/viewers/docx",
    anchors: ["open a Word document online", "the DOCX viewer"],
  },
  "viewer-csv": {
    href: "/viewers/csv",
    anchors: ["view a CSV online", "open a spreadsheet in your browser", "the CSV viewer"],
  },
  "viewer-json": {
    href: "/viewers/json",
    anchors: ["view JSON in your browser", "inspect a JSON file online", "the JSON viewer"],
  },

  // --- Converters silo -------------------------------------------------------
  "converters-hub": {
    href: "/converters",
    anchors: ["convert a file", "all of NudgeHost's free converters"],
  },
  "converter-pdf-to-jpg": {
    href: "/converters/pdf-to-jpg",
    anchors: ["convert a PDF to JPG", "turn a PDF into images", "the PDF to JPG converter"],
  },
  "converter-docx-to-pdf": {
    href: "/converters/docx-to-pdf",
    anchors: ["convert a Word document to PDF", "the DOCX to PDF converter"],
  },
  "converter-png-to-webp": {
    href: "/converters/png-to-webp",
    anchors: ["convert PNG to WebP", "shrink an image with WebP", "the PNG to WebP converter"],
  },
  "converter-heic-to-jpg": {
    href: "/converters/heic-to-jpg",
    anchors: ["convert HEIC to JPG", "turn an iPhone photo into a JPG", "the HEIC to JPG converter"],
  },

  // --- Dev tools silo --------------------------------------------------------
  "dev-tools-hub": {
    href: "/dev-tools",
    anchors: ["free developer tools", "all of NudgeHost's dev tools"],
  },
  "dev-json-formatter": {
    href: "/dev-tools/json-formatter",
    anchors: ["format your JSON", "tidy up a JSON file", "the JSON formatter"],
  },
  "dev-base64": {
    href: "/dev-tools/base64",
    anchors: ["encode or decode Base64", "the Base64 encoder"],
  },
  "dev-url-encoder": {
    href: "/dev-tools/url-encoder",
    anchors: ["encode a URL", "the URL encoder"],
  },
  "dev-jwt-decoder": {
    href: "/dev-tools/jwt-decoder",
    anchors: ["decode a JWT", "inspect a JSON web token", "the JWT decoder"],
  },

  // --- Use cases silo --------------------------------------------------------
  "use-cases-hub": {
    href: "/use-cases",
    anchors: ["see what people use NudgeHost for", "browse common use cases"],
  },
  "use-case-recruiter": {
    href: "/use-cases/send-portfolio-to-recruiter",
    anchors: ["send a portfolio to a recruiter", "share your work with a recruiter"],
  },
  "use-case-large-pdf": {
    href: "/use-cases/send-large-pdf-without-email",
    anchors: ["send a large PDF without email", "share a big PDF without an attachment"],
  },
  "use-case-resume-link": {
    href: "/use-cases/share-resume-as-link",
    anchors: ["share your resume as a link", "send your CV without an attachment"],
  },
  "use-case-deck": {
    href: "/use-cases/share-deck-with-client",
    anchors: ["share a deck with a client", "send a presentation as a link"],
  },

  // --- Compare silo ----------------------------------------------------------
  "compare-hub": {
    href: "/compare",
    anchors: ["see how NudgeHost compares", "compare file-sharing tools"],
  },
  "compare-tiiny": {
    href: "/compare/nudgehost-vs-tiiny-host",
    anchors: ["how NudgeHost compares to Tiiny.host", "NudgeHost vs Tiiny.host"],
  },
  "compare-linkyhost": {
    href: "/compare/nudgehost-vs-linkyhost",
    anchors: ["how NudgeHost compares to Linkyhost", "NudgeHost vs Linkyhost"],
  },
};

// Deterministic anchor picker — given a destination key and a "salt" (usually the
// current page slug), always returns the same anchor for that page, but spreads
// different anchors across different pages. Keeps anchor text varied sitewide
// without being random on re-render.
export function pickAnchor(key: string, salt: string): string {
  const target = internalLinks[key];
  if (!target) return key;
  let hash = 0;
  const combined = key + "::" + salt;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) & 0x7fffffff;
  }
  return target.anchors[hash % target.anchors.length];
}
