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
    anchors: ["host any file type", "put any file online", "host a file"],
  },
  "host-pdf": {
    href: "/host/pdf",
    anchors: ["host a PDF", "share a PDF as a link", "turn a PDF into a link", "put a PDF online"],
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
    anchors: ["the file viewers", "all of NudgeHost's file viewers", "the online file viewers"],
  },
  "viewer-pdf": {
    href: "/viewers/pdf",
    anchors: ["view a PDF in your browser", "open a PDF online", "read a PDF without Acrobat"],
  },
  "viewer-docx": {
    href: "/viewers/docx",
    anchors: ["open a Word document online", "preview a DOCX online", "read a Word file in your browser"],
  },
  "viewer-csv": {
    href: "/viewers/csv",
    anchors: ["view a CSV online", "open a spreadsheet in your browser", "load a CSV as a table"],
  },
  "viewer-json": {
    href: "/viewers/json",
    anchors: ["view JSON in your browser", "inspect a JSON file online", "browse JSON as a tree"],
  },

  // --- Converters silo -------------------------------------------------------
  "converters-hub": {
    href: "/converters",
    anchors: ["the conversion tools", "all of NudgeHost's free converters", "the free file converters"],
  },
  "converter-pdf-to-jpg": {
    href: "/converters/pdf-to-jpg",
    anchors: ["convert a PDF to JPG", "turn a PDF into images", "export PDF pages as JPGs"],
  },
  "converter-docx-to-pdf": {
    href: "/converters/docx-to-pdf",
    anchors: ["convert a Word document to PDF", "export the DOCX as a PDF", "turn a Word doc into a PDF"],
  },
  "converter-png-to-webp": {
    href: "/converters/png-to-webp",
    anchors: ["convert PNG to WebP", "shrink an image with WebP", "compress a PNG to WebP"],
  },
  "converter-heic-to-jpg": {
    href: "/converters/heic-to-jpg",
    anchors: ["convert HEIC to JPG", "turn an iPhone photo into a JPG", "swap HEIC for JPG"],
  },

  // --- Dev tools silo --------------------------------------------------------
  "dev-tools-hub": {
    href: "/dev-tools",
    anchors: ["free developer tools", "browser-based dev tools", "small dev utilities"],
  },
  "dev-json-formatter": {
    href: "/dev-tools/json-formatter",
    anchors: ["format your JSON", "tidy up a JSON file", "clean up minified JSON"],
  },
  "dev-base64": {
    href: "/dev-tools/base64",
    anchors: ["encode or decode Base64", "decode Base64 in the browser", "convert text to Base64"],
  },
  "dev-url-encoder": {
    href: "/dev-tools/url-encoder",
    anchors: ["encode a URL", "URL-encode a string", "encode a query string"],
  },
  "dev-jwt-decoder": {
    href: "/dev-tools/jwt-decoder",
    anchors: ["decode a JWT", "inspect a JSON web token", "peek inside a JWT"],
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
  "compare-nudgehost-vs-tiiny-host": {
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

  // --- Glossary silo ---------------------------------------------------------
  "glossary-static-site": {
    href: "/glossary/static-site",
    anchors: ["what a static site is", "static site hosting", "static sites"],
  },
  "glossary-cdn": {
    href: "/glossary/cdn",
    anchors: ["what a CDN is", "content delivery networks", "how a CDN speeds up files"],
  },
  "glossary-404-error": {
    href: "/glossary/404-error",
    anchors: ["what causes a 404 error", "404 errors", "broken-link 404s"],
  },
  "glossary-https": {
    href: "/glossary/https",
    anchors: ["why links are HTTPS", "what HTTPS means", "HTTPS security"],
  },
  "glossary-cors": {
    href: "/glossary/cors",
    anchors: ["what CORS is", "cross-origin requests", "CORS errors"],
  },
  "glossary-dns": {
    href: "/glossary/dns",
    anchors: ["how DNS works", "the domain name system", "what DNS is"],
  },
  "glossary-ftp": {
    href: "/glossary/ftp",
    anchors: ["what FTP is", "the old FTP workflow", "FTP uploads"],
  },
  "glossary-cache": {
    href: "/glossary/cache",
    anchors: ["how caching works", "browser and CDN caching", "what a cache is"],
  },
  "glossary-seo": {
    href: "/glossary/seo",
    anchors: ["SEO basics", "search engine optimization", "what SEO is"],
  },
  "glossary-og-image": {
    href: "/glossary/og-image",
    anchors: ["how link previews work", "open graph images", "what an og:image is"],
  },
  "glossary-qr-code": {
    href: "/glossary/qr-code",
    anchors: ["what a QR code is", "QR code sharing", "the free QR code on every link"],
  },
  "glossary-file-compression": {
    href: "/glossary/file-compression",
    anchors: ["how file compression works", "what file compression is", "compressing files"],
  },
  "glossary-mime-type": {
    href: "/glossary/mime-type",
    anchors: ["what a MIME type is", "view versus download behaviour", "MIME types"],
  },
  "glossary-ssl-certificate": {
    href: "/glossary/ssl-certificate",
    anchors: [
      "what an SSL certificate is",
      "the certificate behind HTTPS",
      "SSL certificates",
    ],
  },
  "glossary-bandwidth": {
    href: "/glossary/bandwidth",
    anchors: ["what bandwidth means", "bandwidth and visitor caps", "data transfer limits"],
  },
  "glossary-drag-and-drop": {
    href: "/glossary/drag-and-drop",
    anchors: ["drag-and-drop uploads", "the drag-and-drop pattern", "how drag and drop works"],
  },
  "glossary-presigned-url": {
    href: "/glossary/presigned-url",
    anchors: ["what a presigned URL is", "how cloud file sharing works", "signed file URLs"],
  },
  "glossary-link-expiry": {
    href: "/glossary/link-expiry",
    anchors: ["how link expiry works", "self-destructing links", "expiring share links"],
  },
  "glossary-password-protection": {
    href: "/glossary/password-protection",
    anchors: [
      "how password protection works",
      "password-protected links",
      "locking a link with a password",
    ],
  },
  "glossary-custom-domain": {
    href: "/glossary/custom-domain",
    anchors: ["what a custom domain is", "branded share links", "using your own domain"],
  },

  // --- Features silo ---------------------------------------------------------
  "features-link-updating": {
    href: "/features/link-updating",
    anchors: [
      "update the source later",
      "swap the file without changing the URL",
      "replace the file in your dashboard",
    ],
  },
  "features-zip-upload": {
    href: "/features/zip-upload",
    anchors: [
      "zip the files and upload the archive",
      "upload a ZIP file",
      "host a multi-file project from a ZIP",
    ],
  },
  "features-paste-html": {
    href: "/features/paste-html",
    anchors: ["paste HTML directly", "raw HTML paste", "paste mode for HTML"],
  },
  "features-password-protection": {
    href: "/features/password-protection",
    anchors: [
      "put a password on the link",
      "lock the link with a password",
      "add a password to your shared link",
    ],
  },
  "features-custom-domains": {
    href: "/features/custom-domains",
    anchors: [
      "serve links from your own domain",
      "use your own domain",
      "brand your link with a custom domain",
    ],
  },
  "features-full-screen-viewer": {
    href: "/features/full-screen-viewer",
    anchors: [
      "full-screen viewer",
      "clean, full-screen display",
      "distraction-free viewer",
    ],
  },
  "features-link-previews": {
    href: "/features/link-previews",
    anchors: [
      "branded link previews",
      "rich link preview",
      "link preview in Slack and iMessage",
    ],
  },
  "features-public-links": {
    href: "/features/public-links",
    anchors: [
      "public links",
      "no account needed to view",
      "no login wall for recipients",
    ],
  },
  "features-html-rendering": {
    href: "/features/html-rendering",
    anchors: [
      "treats HTML as a page, not text",
      "runs your HTML as a live page",
      "renders HTML instead of showing code",
    ],
  },
  "features-shareable-links": {
    href: "/features/shareable-links",
    anchors: [
      "shareable link",
      "short, shareable URL",
      "permanent short link",
    ],
  },

  // --- Blog ------------------------------------------------------------------
  "blog-how-to-host-a-claude-artifact": {
    href: "/blog/how-to-host-a-claude-artifact",
    anchors: [
      "the full guide to hosting a Claude artifact",
      "our Claude artifact walkthrough",
      "how to host a Claude artifact",
    ],
  },
  "blog-how-to-share-a-lovable-site": {
    href: "/blog/how-to-share-a-lovable-site",
    anchors: [
      "the guide to sharing a Lovable site",
      "our Lovable hosting walkthrough",
      "how to share a Lovable site",
    ],
  },
  "blog-how-to-send-a-large-pdf-without-email": {
    href: "/blog/how-to-send-a-large-pdf-without-email",
    anchors: [
      "the guide to sending a large PDF without email",
      "our walkthrough on emailing big PDFs",
      "how to send a large PDF without email",
    ],
  },
  "blog-how-to-share-a-resume-as-a-link": {
    href: "/blog/how-to-share-a-resume-as-a-link",
    anchors: [
      "the guide to sharing a resume as a link",
      "our resume link walkthrough",
      "how to share a resume as a link",
    ],
  },
  "blog-how-to-host-a-v0-export": {
    href: "/blog/how-to-host-a-v0-export",
    anchors: [
      "the guide to hosting a v0 export",
      "our v0 hosting walkthrough",
      "how to host a v0 export",
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
