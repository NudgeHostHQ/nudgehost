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
    anchors: [
      "the free plan",
      "upgrade to Pro",
      "our pricing",
      "a paid plan",
      "the Pro plan",
      "the paid tier",
      "the pricing page",
    ],
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
    anchors: [
      "host your portfolio",
      "share a portfolio with one link",
      "share your portfolio as a link",
    ],
  },
  "host-docx": {
    href: "/host/docx",
    anchors: ["host a Word document", "share a DOCX as a link", "put a Word doc online"],
  },
  "host-pptx": {
    href: "/host/pptx",
    anchors: ["host a PowerPoint deck", "share a .pptx as a link", "send a presentation as a URL"],
  },
  "host-xlsx": {
    href: "/host/xlsx",
    anchors: ["host an Excel spreadsheet", "share an .xlsx as a link", "send a spreadsheet by URL"],
  },
  "host-txt": {
    href: "/host/txt",
    anchors: ["host a plain text file", "share a .txt as a link", "publish a text file"],
  },
  "host-md": {
    href: "/host/md",
    anchors: ["host a Markdown file", "share a .md as a link", "publish a Markdown document"],
  },
  "host-react-app": {
    href: "/host/react-app",
    anchors: ["host a React app", "deploy a React build as a link", "publish a Vite or CRA build"],
  },
  "host-vue-app": {
    href: "/host/vue-app",
    anchors: ["host a Vue app", "deploy a Vue build as a link", "publish a Vite or Nuxt static build"],
  },
  "host-json": {
    href: "/host/json",
    anchors: ["host a JSON file", "share a JSON file as a link", "put a .json online"],
  },
  "host-svg": {
    href: "/host/svg",
    anchors: ["host an SVG file", "share a vector image as a link", "publish an SVG"],
  },
  "host-chatgpt-html": {
    href: "/host/chatgpt-html",
    anchors: ["host ChatGPT-generated HTML", "publish what ChatGPT built", "share a ChatGPT HTML page"],
  },
  "host-lovable-export": {
    href: "/host/lovable-export",
    anchors: ["host a Lovable export", "publish a Lovable.dev app", "deploy a Lovable build"],
  },
  "host-v0-export": {
    href: "/host/v0-export",
    anchors: ["host a v0 export", "publish a v0.dev component", "share what v0 generated"],
  },
  "host-bolt-export": {
    href: "/host/bolt-export",
    anchors: ["host a Bolt.new export", "publish a Bolt app", "deploy a StackBlitz-built project"],
  },
  "host-image": {
    href: "/host/image",
    anchors: ["host an image", "share a JPG, PNG, or WebP as a link", "put an image online"],
  },
  "host-gif": {
    href: "/host/gif",
    anchors: ["host an animated GIF", "share a GIF as a link", "put a GIF online"],
  },
  "host-mp4": {
    href: "/host/mp4",
    anchors: ["host an MP4 video", "share a video file as a link", "put an MP4 online"],
  },
  "host-mp3": {
    href: "/host/mp3",
    anchors: ["host an MP3 audio file", "share audio as a link", "put an MP3 online"],
  },

  // --- Viewers silo ----------------------------------------------------------
  "viewers-hub": {
    href: "/viewers",
    anchors: ["view any file online", "all of NudgeHost's file viewers", "open files in your browser"],
  },
  "viewer-pdf": {
    href: "/viewers/pdf",
    anchors: ["view a PDF in your browser", "open a PDF online", "the online PDF viewer"],
  },
  "viewer-docx": {
    href: "/viewers/docx",
    anchors: ["open a Word document online", "the DOCX viewer", "read a Word file in your browser"],
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
    anchors: ["convert a file", "all of NudgeHost's free converters", "the free file converters"],
  },
  "converter-pdf-to-jpg": {
    href: "/converters/pdf-to-jpg",
    anchors: ["convert a PDF to JPG", "turn a PDF into images", "the PDF to JPG converter"],
  },
  "converter-docx-to-pdf": {
    href: "/converters/docx-to-pdf",
    anchors: ["convert a Word document to PDF", "the DOCX to PDF converter", "turn a Word doc into a PDF"],
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
    anchors: ["free developer tools", "all of NudgeHost's dev tools", "the dev tools"],
  },
  "dev-json-formatter": {
    href: "/dev-tools/json-formatter",
    anchors: ["format your JSON", "tidy up a JSON file", "the JSON formatter"],
  },
  "dev-base64": {
    href: "/dev-tools/base64",
    anchors: ["encode or decode Base64", "the Base64 encoder", "convert text to Base64"],
  },
  "dev-url-encoder": {
    href: "/dev-tools/url-encoder",
    anchors: ["encode a URL", "the URL encoder", "encode a query string"],
  },
  "dev-jwt-decoder": {
    href: "/dev-tools/jwt-decoder",
    anchors: ["decode a JWT", "inspect a JSON web token", "the JWT decoder"],
  },

  // --- Use cases silo --------------------------------------------------------
  "use-cases-hub": {
    href: "/use-cases",
    anchors: ["see what people use NudgeHost for", "browse common use cases", "explore more use cases"],
  },
  "use-case-recruiter": {
    href: "/use-cases/send-portfolio-to-recruiter",
    anchors: [
      "send a portfolio to a recruiter",
      "share your work with a recruiter",
      "get your portfolio in front of a recruiter",
    ],
  },
  "use-case-large-pdf": {
    href: "/use-cases/send-large-pdf-without-email",
    anchors: [
      "send a large PDF without email",
      "share a big PDF without an attachment",
      "get around email size limits",
    ],
  },
  "use-case-resume-link": {
    href: "/use-cases/share-resume-as-link",
    anchors: [
      "share your resume as a link",
      "send your CV without an attachment",
      "turn your resume into a link",
    ],
  },
  "use-case-deck": {
    href: "/use-cases/share-deck-with-client",
    anchors: [
      "share a deck with a client",
      "send a presentation as a link",
      "share a presentation with a client",
    ],
  },
  "use-case-wedding": {
    href: "/use-cases/share-wedding-website",
    anchors: [
      "host a wedding website for free",
      "share your wedding details as a link",
      "skip the wedding website builder",
    ],
  },

  // --- Compare silo ----------------------------------------------------------
  "compare-hub": {
    href: "/compare",
    anchors: ["see how NudgeHost compares", "compare file-sharing tools", "weigh the alternatives"],
  },
  "compare-tiiny": {
    href: "/compare/nudgehost-vs-tiiny-host",
    anchors: [
      "how NudgeHost compares to Tiiny.host",
      "NudgeHost vs Tiiny.host",
      "the NudgeHost and Tiiny.host comparison",
    ],
  },
  "compare-linkyhost": {
    href: "/compare/nudgehost-vs-linkyhost",
    anchors: [
      "how NudgeHost compares to Linkyhost",
      "NudgeHost vs Linkyhost",
      "the NudgeHost and Linkyhost comparison",
    ],
  },
  "compare-tiiny-vs-linkyhost": {
    href: "/compare/tiiny-host-vs-linkyhost",
    anchors: [
      "Tiiny.host vs Linkyhost comparison",
      "how Tiiny and Linkyhost compare",
      "Tiiny.host and Linkyhost side by side",
    ],
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
