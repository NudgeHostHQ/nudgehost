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
      "Viewing is only half the story, though. If the document is something you want other people to be able to open as easily as you just did, the natural next step is the {{host-pdf|PDF link generator}}. You get a permanent link, and anyone who clicks it lands on this same viewer with your document already loaded.",
      "If you need the PDF as images rather than a document, say for a slide, a thumbnail, or a social post, you can {{converter-pdf-to-jpg}} instead. The same in-browser approach works for other formats too. You can {{viewer-docx}} or any of the other file types NudgeHost handles.",
      "The viewer is free and unlimited. If you find yourself sharing documents regularly and want custom domains, branded links, or password protection, those live on {{pricing|the Pro plan}}.",
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
      "Open a Word document in your browser without Microsoft Word. Free online DOCX viewer with no install and no Office licence, readable on any device.",
    h1: "Open a Word document online.",
    lead: "Drop a DOCX file and read it in your browser. No copy of Microsoft Word required.",
    keyPoints: [
      "Drop a DOCX file and read it in your browser without Microsoft Word installed.",
      "Headings, lists, tables, and embedded images render readably on any modern device.",
      "Designed for reading and sharing. Editing still happens in your usual word processor.",
      "The download button always serves the original .docx, byte for byte.",
    ],
    body: [
      "Word documents are everywhere, but Microsoft Word is not. You can't count on it being installed on every phone, on every Chromebook, or on a machine you've borrowed for ten minutes. Opening a DOCX online removes that dependency entirely. The document renders readable in your browser, with headings, lists, tables, and images in place, and the original file one click away. The in-browser rendering is for .docx specifically; a legacy .doc hosts fine but is offered as a download instead.",
      "Anyone you share the link with gets the same reading view. You {{host-docx}} once, send the URL, and the recipient reads the document in their browser with no Word, no Google account, and no download step, then grabs the original if they want to edit.",
      "When the layout itself is the point, a print-ready contract or a designed one-pager, {{converter-docx-to-pdf}} first so every device shows identical pages, then {{host-pdf}} from there. For other document types, you can {{viewer-pdf}} the same way.",
      "This viewer is free with no limits. For custom domains, branded links, and password protection, {{pricing|upgrade to Pro}}.",
    ],
    faqs: [
      {
        q: "Will the formatting look exactly like Word?",
        a: "The view is built for reading. Headings, lists, tables, and images come through; elaborate page layouts simplify. For pixel-identical results, convert the document to PDF first. The download always serves your original file.",
      },
      {
        q: "Can I edit the document here?",
        a: "No. This is a viewer, not an editor. It's for reading and sharing, not authoring. Download the original .docx to edit in your usual word processor.",
      },
      {
        q: "Does this work on a phone?",
        a: "Yes. The viewer is browser-based, so any phone with a modern browser can read a DOCX.",
      },
    ],
    relatedToolSlugs: ["converter-docx-to-pdf", "host-pdf", "viewer-pdf", "host-html"],
    filePillExamples: ["DOCX", "No Word needed", "Readable view", "Up to 25MB free"],
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
      "Drop a CSV and open its link to see the data parsed into a clean, scrollable table. No Excel or Google Sheets needed.",
      "Comma, semicolon, and tab delimiters are detected, and quoted fields with embedded commas parse correctly.",
      "The first 500 rows render straight away; the download button covers the rest.",
      "Files up to 10MB open as a table in the browser; larger CSVs are offered as a download.",
    ],
    body: [
      "A CSV is just text, which means opening one in a plain text editor gives you an unreadable wall of commas. A proper viewer parses it into rows and columns so you can actually read it. Drop the file here, open its link, and the data renders as a clean table.",
      "If the data is something you need to hand to someone else, the same dashboard that lets you {{host-hub}} handles the CSV; you send a link instead of a file and the recipient opens it in this same table view, no Excel required. For native Excel files with multiple sheets or formulas, you can {{host-xlsx}} to keep the workbook structure intact. For structured data that's more nested than a flat table, you can {{viewer-json}} the same way. A Word document opens the same way too; you can {{viewer-docx}} with nothing installed.",
      "Developers working with CSV data often need to reshape it; when you need to inspect or tidy the JSON equivalent, you can {{dev-json-formatter}} alongside this viewer. And if you just need the file online fast, {{home}}.",
      "Free and unlimited. Sharing extras like {{features-password-protection|a password on the link}} live on the paid plans.",
    ],
    faqs: [
      {
        q: "How big a CSV can I open?",
        a: "Files up to 10MB render as a table in the browser, with the first 500 rows shown straight away. Bigger CSVs still host fine; the link offers them as a download instead.",
      },
      {
        q: "Does it handle different delimiters?",
        a: "Yes. Comma, semicolon, and tab-separated files are all detected, and quoted fields with embedded commas parse correctly.",
      },
      {
        q: "Can I share the table with someone?",
        a: "Yes. Host the CSV as a link and the recipient sees the same table view in their browser, no account needed.",
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
      "Branches render only when you expand them, so large structures stay responsive.",
      "Invalid JSON falls back to the raw text with the parse error shown, never an error page.",
      "A copy button puts the raw JSON on your clipboard; files up to 10MB open in the browser.",
    ],
    body: [
      "Raw JSON is readable in theory and painful in practice. A large API response or config file is hundreds of lines of nested braces. A tree viewer lets you collapse what you don't care about and drill into what you do. Drop a file here, open its link, and the structure becomes browsable.",
      "If the JSON is messy (minified, or inconsistently indented), {{dev-json-formatter}} first; it tidies the structure so the tree view is even easier to scan. For tabular data that arrived as JSON but would read better as rows and columns, you can {{viewer-csv}} instead.",
      "When you need to share the file, {{host-hub}} and send a link. That's how you hand a teammate an API response without pasting 500 lines into Slack. Developers will also find that NudgeHost's {{dev-tools-hub}} sit naturally alongside this viewer.",
      "The viewer is free with no limits. Account-level features like custom domains live on {{pricing|the Pro tier}}.",
    ],
    faqs: [
      {
        q: "Will it tell me if my JSON is invalid?",
        a: "Yes. If the file can't be parsed, the viewer shows the parse error and falls back to the raw text, so you still see the content.",
      },
      {
        q: "Can it handle large JSON files?",
        a: "Files up to 10MB open as a tree, and branches render as you expand them so deep structures stay responsive. Bigger files are offered as a download.",
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
