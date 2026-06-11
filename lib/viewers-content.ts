import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

// Silo configuration for /viewers/*
export const viewersSilo: SiloConfig = {
  key: "viewers",
  basePath: "/viewers",
  hubLabel: "Viewers",
  schemaType: "WebApplication",
  heroVariant: "upload",
  // A viewer page takes a file to view; a Paste HTML tab makes no sense here,
  // so the widget shows the file mode only (same reasoning as converters).
  uploadTabs: "file",
  ctaVerb: "view your file online",
};

// Body paragraphs may embed {{key}} contextual-link tokens — see
// lib/internal-links.ts and components/contextual-prose.tsx.
export const viewersContentMap: Record<string, SpokeContent> = {
  pdf: {
    slug: "pdf",
    name: "PDF",
    title: "PDF Viewer: open and read any PDF online, free",
    description:
      "Open a PDF in your browser instantly. No download, no Acrobat, no signup. Free online PDF viewer that works on any device.",
    h1: "View a PDF online.",
    lead: "Drop a PDF and read it straight away in your browser. Nothing to install, nothing to download. It just opens.",
    keyPoints: [
      "Drop a PDF and read it in your browser instantly. No Acrobat install, no signup.",
      "Works on any modern browser, on phones and desktops, free with no signup.",
      "Text in the PDF stays selectable so you can copy content out.",
      "The same upload can be hosted as a public link from the same flow.",
    ],
    body: [
      "There are still moments where you have a PDF and no good way to open it: a locked-down work laptop with no PDF reader, a phone that wants to download the file before showing it, a shared computer where you'd rather not install anything. A browser-based viewer sidesteps all of that. Drop the file here and it renders immediately.",
      "Viewing is only half the story, though. If the document is something you want other people to be able to open as easily as you just did, the natural next step is the {{host-pdf}}. You get a permanent link, and anyone who clicks it lands on this same viewer with your document already loaded.",
      "If you need the PDF as images rather than a document, say for a slide, a thumbnail, or a social post, send it through {{converter-pdf-to-jpg}} instead. The same in-browser approach works for other formats too. You can {{viewer-docx}} or any of the other file types NudgeHost handles.",
      "The viewer is free and unlimited. If you find yourself sharing documents regularly and want custom domains, branded links, or password protection, those live on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Do I need Adobe Acrobat to view a PDF here?",
        a: "No. The viewer runs entirely in your browser. Any modern browser on any device can open a PDF this way.",
      },
      {
        q: "Is my PDF uploaded to a server?",
        a: "Yes. Viewing works by uploading the file and opening its link, so the PDF is stored on NudgeHost until you delete it. Don't upload documents you can't store with a third party.",
      },
      {
        q: "Can other people view the same PDF?",
        a: "Yes. Host the PDF as a link and anyone you send it to opens it in this same viewer, no account needed.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-docx", "converter-pdf-to-jpg", "use-case-large-pdf"],
    filePillExamples: ["PDF", "Multi-page", "Scanned PDF", "Up to 25MB free"],
  },

  docx: {
    slug: "docx",
    name: "DOCX",
    title: "DOCX Viewer: open Word documents online, free",
    description:
      "Open a Word document in your browser without Microsoft Word. Free online DOCX viewer with no install and no Office licence, works anywhere.",
    h1: "Open a Word document online.",
    lead: "Drop a DOCX file and read it in your browser. No copy of Microsoft Word required.",
    keyPoints: [
      "Drop a DOCX file and read it in your browser without Microsoft Word installed.",
      "Renders the document with its formatting intact on any modern device.",
      "Designed for reading and sharing. Editing still happens in your usual word processor.",
      "Convert to PDF first if you need pixel-identical results before sending the file on.",
    ],
    body: [
      "Word documents are everywhere, but Microsoft Word is not. You can't count on it being installed on every phone, on every Chromebook, or on a machine you've borrowed for ten minutes. Opening a DOCX online removes that dependency entirely. The document renders in your browser with its formatting intact.",
      "If you want to send the document to someone else, the cleaner path is usually to convert it first. Run it through {{converter-docx-to-pdf}} so the recipient sees identical formatting on every device, then {{host-pdf}} from there so they open it with a single click. PDF travels better than DOCX precisely because it doesn't depend on the reader's software.",
      "You can also keep the file as a Word doc and {{host-docx}} in its original format. The recipient lands on a viewer like this one. For other document types, you can {{viewer-pdf}} the same way.",
      "This viewer is free with no limits. For custom domains, branded links, and password protection, {{pricing}}.",
    ],
    faqs: [
      {
        q: "Will the formatting look exactly like Word?",
        a: "Very close. Complex layouts can shift slightly. For pixel-identical results, convert the document to PDF first.",
      },
      {
        q: "Can I edit the document here?",
        a: "No. This is a viewer, not an editor. It's for reading and sharing, not authoring.",
      },
      {
        q: "Does this work on a phone?",
        a: "Yes. The viewer is browser-based, so any phone with a modern browser can open a DOCX.",
      },
    ],
    relatedToolSlugs: ["converter-docx-to-pdf", "host-pdf", "viewer-pdf", "host-html"],
    filePillExamples: ["DOCX", "DOC", "No Word needed", "Up to 25MB free"],
  },

  csv: {
    slug: "csv",
    name: "CSV",
    title: "CSV Viewer: open spreadsheets online, free",
    description:
      "Open a CSV file in your browser as a clean table. No Excel, no Google Sheets, no signup. Free online CSV viewer.",
    h1: "View a CSV file online.",
    lead: "Drop a CSV and see it as a tidy, scrollable table. No spreadsheet software needed.",
    keyPoints: [
      "Drop a CSV and see it parsed into a clean, scrollable table. No Excel or Google Sheets needed.",
      "Automatically detects comma, semicolon, and tab delimiters.",
      "Handles files up to the free plan's 25MB limit, which is a very large spreadsheet.",
      "The same upload can be shared as a public link in the same flow.",
    ],
    body: [
      "A CSV is just text, which means opening one in a plain text editor gives you an unreadable wall of commas. A proper viewer parses it into rows and columns so you can actually read it. Drop the file here and it becomes a clean table in seconds.",
      "If the data is something you need to hand to someone else, the same dashboard that powers {{host-hub}} handles the CSV; you send a link instead of a file and the recipient opens it in this same table view, no Excel required. For native Excel files with multiple sheets or formulas, you can {{host-xlsx}} to keep the workbook structure intact. For structured data that's more nested than a flat table, you can {{viewer-json}} the same way.",
      "Developers working with CSV data often need to reshape it; when you need to inspect or tidy the JSON equivalent, {{dev-json-formatter}} pairs naturally with this viewer. And if you just need the file online fast, {{home}}.",
      "Free and unlimited. Sharing extras are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "How big a CSV can I open?",
        a: "The viewer comfortably handles files up to the free plan's 25MB limit, which is a very large spreadsheet.",
      },
      {
        q: "Does it handle different delimiters?",
        a: "Yes. Comma, semicolon, and tab-separated files are all detected automatically.",
      },
      {
        q: "Can I share the table with someone?",
        a: "Yes. Host the CSV as a link and the recipient sees the same table view in their browser.",
      },
    ],
    relatedToolSlugs: ["viewer-json", "dev-json-formatter", "host-zip", "host-pdf"],
    filePillExamples: ["CSV", "TSV", "Tab-separated", "Up to 25MB free"],
  },

  json: {
    slug: "json",
    name: "JSON",
    title: "JSON Viewer: inspect and explore JSON online, free",
    description:
      "Open a JSON file in your browser as a clean, collapsible tree. Free online JSON viewer with no install and no signup.",
    h1: "View JSON in your browser.",
    lead: "Drop a JSON file and explore it as a collapsible tree instead of a wall of brackets.",
    keyPoints: [
      "Drop a JSON file and explore it as a collapsible tree instead of a wall of brackets.",
      "Lazy-loads large structures so multi-megabyte files stay responsive.",
      "Invalid JSON is caught immediately with a pointer to where the syntax breaks.",
      "Pairs naturally with the JSON formatter for tidying messy input first.",
    ],
    body: [
      "Raw JSON is readable in theory and painful in practice. A large API response or config file is hundreds of lines of nested braces. A tree viewer lets you collapse what you don't care about and drill into what you do. Drop a file here and it becomes browsable immediately.",
      "If the JSON is messy (minified, or inconsistently indented), run it through {{dev-json-formatter}} first; it tidies the structure so the tree view is even easier to scan. For tabular data that arrived as JSON but would read better as rows and columns, {{viewer-csv}} is the companion tool.",
      "When you need to share the file, {{host-hub}} and send a link. That's how you hand a teammate an API response without pasting 500 lines into Slack. Developers will also find that NudgeHost's {{dev-tools-hub}} sit naturally alongside this viewer.",
      "The viewer is free with no limits. For account-level features, {{pricing}} on the Pro tier.",
    ],
    faqs: [
      {
        q: "Will it tell me if my JSON is invalid?",
        a: "Yes. If the file can't be parsed, the viewer points you to where the syntax breaks.",
      },
      {
        q: "Can it handle large JSON files?",
        a: "Yes, up to the 25MB free-plan limit. The tree loads lazily so big files stay responsive.",
      },
      {
        q: "Is this the same as a JSON formatter?",
        a: "Related but different. The viewer explores structure; the formatter rewrites the file with clean indentation. Use them together.",
      },
    ],
    relatedToolSlugs: ["dev-json-formatter", "viewer-csv", "dev-base64", "host-html"],
    filePillExamples: ["JSON", "API response", "Config", "Up to 25MB free"],
  },
};
