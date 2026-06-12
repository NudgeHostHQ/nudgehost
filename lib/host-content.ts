// Centralized SEO content for /host/[slug] pages.
// Add new slugs here as you build out the silo. Each entry produces:
// - Unique <title> and meta description
// - Unique H1, intro, FAQs
// - SoftwareApplication + FAQPage JSON-LD
// - Breadcrumb schema
// - Optional Article schema (when author + datePublished are set)
//
// CONTEXTUAL LINKS: body[] paragraphs may contain {{key}} tokens, where `key`
// is an entry in lib/internal-links.ts. At render time each token becomes a
// real in-prose <Link> with naturally-varied anchor text. Write each sentence
// *around* the link so the surrounding words supply topical context. That is
// what makes it a strong contextual link rather than boilerplate. Aim for 3-6
// tokens per page, including at least one cross-silo link and one money page
// ({{pricing}} or {{home}}). See STRATEGY.md, "Internal linking strategy".
//
// KEY POINTS: optional 3-4 short factual sentences shown near the top of the
// page. Likely to be lifted verbatim by AI Overviews. Write for a human in a
// hurry, not for the model. See STRATEGY.md, "Optimizing for AI Overviews".
//
// Quality bar: copy must be human-written, ~400-600 words, NON-COMMODITY
// (containing first-hand detail you couldn't get from a competitor's page).

import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const hostSilo: SiloConfig = {
  key: "host",
  basePath: "/host",
  hubLabel: "Host",
  schemaType: "SoftwareApplication",
  heroVariant: "upload",
  ctaVerb: "share your file",
};

export const hostContentMap: Record<string, SpokeContent> = {
  pdf: {
    slug: "pdf",
    name: "PDF",
    title: "PDF Link Generator: share a PDF as a link, free",
    description:
      "Upload a PDF, get a clean shareable link in seconds. Free, no signup needed. Optional password protection and view analytics on every link.",
    h1: "Share a PDF as a link.",
    lead: "Drop a PDF here and get a clean, shareable link in seconds. No sign-up required, no expiry, and no account for anyone who opens it.",
    keyPoints: [
      "Drop a PDF, get a clean nudgehost.com link in seconds. No signup required.",
      "Free plan covers up to 10 active PDFs at 25MB each, with no link expiry by default.",
      "Recipients open the PDF in their browser. There's nothing to install or download.",
      "A view counter on every link shows how many times the PDF has been opened.",
    ],
    body: [
      "Sending a PDF used to mean a cluttered email attachment, a Dropbox share link with a login prompt, or asking the recipient to download something they didn't really want to download. NudgeHost is the friendlier middle ground. You drop the PDF, we give you back a {{features-shareable-links}}, you send it. The recipient clicks it and reads the PDF straight away. If you'd rather they see it without downloading anything, every shared file also opens in {{viewer-pdf|the online PDF viewer}}, so there's nothing for them to install. Whether a file opens in the browser or downloads is decided by its {{glossary-mime-type}}, which we set correctly for you.",
      "If you need a flat image of a page instead of a clickable document, perhaps to drop into a slide deck or to post somewhere that won't accept a PDF, you can {{converter-pdf-to-jpg}} and host the result the same way. That's one of many format jobs handled by {{converters-hub}}. If your PDF is really a resume, there's a tailored flow to {{host-resume}} that adds open-tracking so you know when a recruiter has looked at it. If the document is still a Word file, you can {{host-docx}} instead and the recipient reads it in their browser.",
      "On {{pricing|the free plan}} you get 10 active PDFs at up to 25MB each, with no expiry, so your link stays live as long as you want it to. Larger files, password protection, custom domains, and branded links are all worth a paid plan once you're sharing PDFs regularly.",
      "Every link counts its views, so you can tell whether a proposal or a contract has been opened yet. If the file is a big one, the guide on how to {{use-case-large-pdf}} covers the email-size-limit problem in full. For a step-by-step version, read {{blog-how-to-send-a-large-pdf-without-email}}. The same uploader handles every other format too, so once you've sent your first PDF you can {{host-hub}} without learning anything new.",
    ],
    faqs: [
      {
        q: "Is the PDF link generator really free?",
        a: "Yes. The free plan gives you 10 active PDFs, 25MB per file, no expiry. No credit card.",
      },
      {
        q: "Can I password-protect a PDF link?",
        a: "Yes, on the Pro plan. Anyone clicking the link will need the password before they can view the document.",
      },
      {
        q: "How long do my PDF links stay online?",
        a: "With a free account, there's no expiry by default; anonymous uploads stay live for 7 days. You can also set an expiry date if you want a link to self-destruct.",
      },
      {
        q: "Can people view the PDF without downloading it?",
        a: "Yes. Every shared PDF opens in our in-browser viewer. Visitors can read it without downloading, or download a copy if they want.",
      },
      {
        q: "Does the recipient need an account to view the PDF?",
        a: "No. They just click the link. Anyone with the URL can view the file.",
      },
    ],
    relatedToolSlugs: ["host-html", "viewer-pdf", "converter-pdf-to-jpg", "host-resume", "host-portfolio"],
    filePillExamples: ["PDF", "Encrypted PDF", "Scanned PDF", "Multi-page", "Up to 25MB free"],
  },

  html: {
    slug: "html",
    name: "HTML",
    title: "Host HTML files online: free static HTML hosting",
    description:
      "Drop an HTML file and get a live URL in seconds. Free static hosting for HTML pages, single-file sites, and AI-generated webpages. No build step, no setup.",
    h1: "Host an HTML file in seconds.",
    lead: "Paste your HTML or drop a file, and NudgeHost gives you a live URL. Perfect for single-page sites, AI-generated pages, and HTML prototypes.",
    keyPoints: [
      "Drop an HTML file or paste source directly to get a live nudgehost.com URL within seconds.",
      "Works for single-file pages and AI-generated outputs; a folder of files zips up and serves as a full site instead.",
      "Client-side JavaScript runs as expected, which makes this a good fit for prototypes, demos, and AI artifacts.",
      "Free with no signup; custom domains, password protection, and unbranded links are on a paid plan.",
    ],
    body: [
      "Sometimes you just need to put an HTML file on the internet. Maybe it's a prototype you want to show a client, a single-page landing page for a side project, or an HTML output you just generated from an AI tool and want to share with a friend. You don't need a server or a Vercel deployment for any of that. You just need a URL. A page like this is a static site, served exactly as it is with nothing building it on each visit; our glossary entry on {{glossary-static-site}} explains the model.",
      "NudgeHost takes a single HTML file and puts it on the open web at a clean URL within seconds. Scripts and styles run on the hosted page, since NudgeHost {{features-html-rendering}}. For a single-file upload, keep everything in the one file: inline your CSS and JavaScript, load libraries from CDNs, and reference images by absolute URL, because relative paths to sibling files won't resolve on a single hosted page. If the page has grown into a folder of assets, you can {{host-zip}} instead and the whole project serves as a live site at its own nudgehost.site link, relative paths intact. If you're publishing something a model built for you, there's a purpose-built flow to {{host-claude-artifact}} that handles the copy-paste case directly. For personal use cases like a one-page event site, the guide on how to {{use-case-wedding}} walks through that flow start to finish.",
      "Set a password on the link if you want the prototype private. Custom domains and unbranded links come with {{pricing|the Pro plan}}. And the page is already running on a real CDN, so testing load behaviour before publishing isn't a separate step. A public page also benefits from {{glossary-seo}} once you want search engines to find it.",
      "HTML isn't the only thing you can put online this way. The same uploader will {{host-hub}}, and for people who'd rather read than browse, you can export the page to PDF and {{host-pdf|host the PDF}} alongside it. If you only need to look at a file rather than publish it, {{viewers-hub}} cover that side.",
    ],
    faqs: [
      {
        q: "What about CSS, JS, or images that sit alongside my HTML?",
        a: "Either inline them or zip the folder. A single-file upload needs everything inside the one file, since relative references to sibling files don't resolve there. A ZIP of the folder serves as a live site at its own subdomain with relative paths working as built.",
      },
      {
        q: "Can I paste HTML instead of uploading a file?",
        a: "Yes. Paste mode is built in. Copy your HTML (for example, from a Claude or ChatGPT conversation), paste it, and you get a live URL.",
      },
      {
        q: "Will JavaScript work on my hosted page?",
        a: "Yes. Client-side JavaScript works exactly as expected. You can host single-file React/Vue prototypes, p5.js sketches, three.js scenes, anything that runs in a browser.",
      },
      {
        q: "Can I update my HTML file without changing the URL?",
        a: "Yes. From your dashboard, swap the file out and the URL stays the same. Useful for iterating with a client.",
      },
    ],
    relatedToolSlugs: ["host-claude-artifact", "host-zip", "viewer-pdf", "host-pdf"],
    filePillExamples: ["HTML", "Paste HTML", "AI outputs", "Up to 25MB free"],
  },

  "claude-artifact": {
    slug: "claude-artifact",
    name: "Claude artifact",
    title: "Host a Claude artifact: share Claude HTML as a link",
    description:
      "Publish a Claude artifact to a live URL. Copy the HTML from Claude, paste it into NudgeHost, get a shareable link instantly. Free.",
    h1: "Host a Claude artifact as a live URL.",
    lead: "Claude built you something brilliant. Now share it. Copy the HTML from your Claude conversation, paste it here, and get a live nudgehost.com link in seconds.",
    keyPoints: [
      "Copy the HTML source from your Claude artifact, paste it into NudgeHost, get a public link in seconds.",
      "No Anthropic account needed for the people you share the link with. The artifact runs directly in their browser.",
      "Free plan handles artifacts up to 25MB. Most artifacts are under 100KB, so this is rarely a constraint.",
      "Works the same way for ChatGPT HTML, v0 exports, Lovable exports, and Bolt exports.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-21",
    dateModified: "2026-05-22",
    body: [
      "Claude's artifacts feature is one of the most useful additions to chat AI in years. You can ask Claude for a dashboard, a calculator, a landing page, or a small game and get a working HTML/JS thing right there in the conversation. There's a catch. Those artifacts live inside Claude. You can't easily send one to a friend, drop one into a Slack channel, or share one on Twitter without screenshotting it.",
      "NudgeHost fixes that gap. Open your artifact in Claude, copy the source HTML, paste it into NudgeHost, and you get a clean public URL that loads the artifact for anyone who clicks. No Anthropic account needed on their end. No screenshot. It uses {{features-paste-html}}, so the artifact moves from the chat to a live page without a file ever touching your disk. Under the hood it's the same flow you'd use to {{host-html}}, since an artifact is just HTML. Anything you learn here applies to ordinary web pages too. For the full step-by-step version, read {{blog-how-to-host-a-claude-artifact}}.",
      "If your artifact is split across several files, ask Claude to inline everything into one HTML file; it does this reliably, and the live page needs everything in the one file. A multi-file bundle still works when you {{host-zip}}. With an index.html inside it serves as a live site, and without one it travels as one download. And if you want to hand someone a static, non-interactive version, say a printable summary of a dashboard, you can always export it and {{host-pdf}} alongside the live one.",
      "Under {{pricing|the free plan}}, your artifact stays live with no expiry. You can {{features-link-updating}} whenever Claude builds a v2, so the address stays the same while the content changes, or set an expiry if you only want the link to live for a week. The same approach works for any single-file HTML output: ChatGPT-generated HTML, v0 exports, Lovable exports, Bolt exports. For more grounded examples of what people do with shared links, like how to {{use-case-deck}}, you can {{use-cases-hub}} step by step.",
    ],
    faqs: [
      {
        q: "How do I get the HTML out of Claude?",
        a: "In Claude's artifact view, there's a code/source toggle that shows you the underlying HTML. Copy it. Or, in some cases, ask Claude directly: 'Give me the HTML source for that artifact.' Then paste it into NudgeHost.",
      },
      {
        q: "Will the artifact work the same once it's hosted?",
        a: "Yes, as long as it's self-contained. Claude artifacts that pull from external scripts (e.g. Tailwind CDN, React via CDN) will load those scripts as normal from the hosted page.",
      },
      {
        q: "Can I update the artifact later?",
        a: "Yes. Replace the HTML in your NudgeHost dashboard and the link continues to work. Same URL, new content.",
      },
      {
        q: "Is there a size limit?",
        a: "25MB on the free plan, which is enormous for an artifact. Most Claude artifacts are under 100KB.",
      },
      {
        q: "Does it work for ChatGPT, Gemini, Lovable, v0, Bolt outputs too?",
        a: "Yes. Any AI-generated HTML works the same way. Copy the source, paste it here, share the link.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-zip", "host-pdf"],
    filePillExamples: ["Paste HTML", "ZIP", "Up to 25MB free", "Live in seconds"],
    widgetDefaultTab: "paste",
  },

  resume: {
    slug: "resume",
    name: "Resume",
    title: "Share your resume as a link: free resume link generator",
    description:
      "Stop sending PDFs as email attachments. Upload your resume and get a clean shareable link with view tracking, so you know when a recruiter has opened it.",
    h1: "Share your resume as a link.",
    lead: "Drop your CV here and we'll give you a clean URL to share with recruiters. You'll see when they open it. They don't need to download a thing.",
    keyPoints: [
      "Upload your CV and get a clean shareable link with a view counter on by default.",
      "Recruiters open the resume in their browser, with no download, no Dropbox login, and no attachment to wrangle.",
      "Updating the file keeps the same URL, so every employer who already has the link sees the latest version.",
      "Free for one resume; custom domains and the removal of NudgeHost branding are on a paid plan.",
    ],
    body: [
      "Sending a resume as an email attachment is fine, until you realise the recruiter never told you whether they read it. A NudgeHost link to your resume counts how many times it has been opened. Same email, same recruiter, much more useful to you. Most resumes are PDFs, and everything that's true of hosting one applies here too. This page is really the {{host-pdf|PDF link generator}} flow with open-tracking turned on by default.",
      "Your link is short and clean, like nudgehost.com/your-name. The recruiter opens it in their browser instantly. There's no download prompt, no Dropbox login, and no 'this file may be unsafe' warning to scare them off. If you're applying for design or front-end roles, a resume is rarely enough on its own; the natural next step is to {{host-portfolio}}, then {{use-case-recruiter}} alongside the resume.",
      "If you're job-hunting, make one resume link and put it in your LinkedIn, your email signature, and your application emails. When you update the resume, the link stays the same. Just swap the file out and everyone who's already got the link sees the new version, with no {{glossary-404-error}} from a file that moved. A custom domain and the removal of NudgeHost branding both come with {{pricing|the Pro plan}}, which is worth it if you're sending the link to dozens of employers. If you're still weighing tools, you can {{compare-hub}} before committing.",
    ],
    faqs: [
      {
        q: "Will the recruiter know I'm tracking them?",
        a: "No. The link looks like a normal link. Analytics are visible to you alone, in your dashboard.",
      },
      {
        q: "Can I update my resume without changing the link?",
        a: "Yes. Replace the file in your dashboard. Same URL, new resume.",
      },
      {
        q: "Can I have one resume per application?",
        a: "Yes. You can create unlimited links on Pro, each tracking its own opens. That's useful if you want to know which company actually opened your resume.",
      },
      {
        q: "What file format should I upload?",
        a: "PDF is best because it preserves your formatting on every device. We accept DOCX too, but PDF is the standard.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-portfolio", "viewer-pdf"],
    filePillExamples: ["PDF", "DOCX", "1-2 pages", "ATS-friendly", "Up to 25MB"],
  },

  portfolio: {
    slug: "portfolio",
    name: "Portfolio",
    title: "Host a portfolio: share your work as one clean link",
    description:
      "Put your design, photography, or writing portfolio online as a single shareable link, with no site builder, no login wall, and no heavy attachment.",
    h1: "Share your portfolio as a link.",
    lead: "One link to your work, opening in the browser the moment a recruiter or client clicks, with no login wall, no heavy attachment, and no annual site builder fee.",
    keyPoints: [
      "Upload a portfolio PDF, an HTML page, a hero image, or a zipped site export, and get a clean shareable link in seconds.",
      "Recruiters, clients, and agencies open your work in the browser with no account, no download, and no login wall.",
      "A view counter shows whether your portfolio has been opened, which helps before an interview or a pitch call.",
      "Update the file later and the link stays the same, so everyone who has it sees your latest work.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-25",
    dateModified: "2026-06-12",
    body: [
      "A portfolio only earns you anything if the person you sent it to actually opens it. Behance and Dribbble wrap your work in their own navigation, ads, and a 'suggested creators' rail that pulls attention toward other people. A Google Drive folder makes a recruiter sign in before they see a single piece. A 40MB PDF attachment gets stripped by a corporate mail server, or it sits unopened because nobody downloads files from someone they have not met. A plain link sidesteps all of it. Your work opens directly, on any device, with nothing in front of it.",
      "Most portfolios are one of three things, and each becomes a link the same way. A designed PDF is the simplest case, and the {{host-pdf|PDF link generator}} flow turns it into a URL in seconds. If your portfolio is a hand-coded or exported page that fits in one self-contained HTML file, you {{host-html}} and it goes live at a clean address with the layout intact. Photographers who want to send a single hero shot or a contact sheet can {{host-image}} instead, and the picture renders full size in the browser rather than forcing a download. A multi-page portfolio site, exported from a builder or hand-coded, zips up so you can {{host-zip}}, and it serves as a real browsable site at its own nudgehost.site link, navigation and all.",
      "The single most common thing people do with a portfolio link is {{use-case-recruiter}}, usually attached to a job application. The recruiter clicks once and sees your work in the browser, with no account to create and no download to approve. Agencies and prospective clients get the same friction-free open, which matters when you are one of forty links in someone's inbox that week. Because the link reports opens, you also learn whether your portfolio was reviewed before an interview or whether the application is still unread. That tells you when a follow-up is worth sending and when you are waiting on a decision nobody has made yet.",
      "Work changes, and the link keeps up. Swap the file in your dashboard and the URL stays the same, so every studio and recruiter who already has it sees your latest pieces on the next refresh, with no need to resend anything. Hosting one portfolio costs nothing, and you can look at {{pricing|our pricing}} when you want a custom domain on the link or the NudgeHost branding removed, both of which matter once you are sending it to dozens of studios. The same dashboard lets you {{host-hub}}, so your portfolio, your CV, and a short cover note all sit under one tidy set of links instead of scattered across email threads.",
    ],
    faqs: [
      {
        q: "What format should my portfolio be in?",
        a: "A designed PDF, a single-file HTML page, a hero image, or a zipped site export. The documents and images open in the viewer; a zipped site serves as a browsable site at its own subdomain.",
      },
      {
        q: "Will a recruiter need an account to open it?",
        a: "No. Anyone with the link opens your portfolio in their browser. There is no sign-in and no download step.",
      },
      {
        q: "Can I tell whether my portfolio was opened?",
        a: "Yes. The link reports opens, so you can see whether your work was viewed before an interview or a pitch call.",
      },
      {
        q: "Can I update my portfolio without sending a new link?",
        a: "Yes. Replace the file in your dashboard and the URL stays the same. Everyone who already has the link sees the new version on their next visit.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-html", "host-image", "use-case-recruiter", "host-resume"],
    filePillExamples: ["PDF", "HTML", "Images", "Up to 25MB free"],
  },

  docx: {
    slug: "docx",
    name: "DOCX",
    title: "Host a DOCX file online: share a Word document as a link",
    description:
      "Drop a Word document and get a shareable link. The recipient reads the .docx in the browser, no Word needed, and can download the original. Free.",
    h1: "Host a Word document as a link.",
    lead: "Drop your .docx and we'll hand back a URL anyone can click. The document opens readable in the browser, and the original file is one click away.",
    keyPoints: [
      "Upload a Word document, get a public link, share it. The recipient reads the .docx in the browser, no Word required.",
      "Headings, lists, tables, and embedded images come through in the rendered view.",
      "The download button serves your original file byte for byte, with comments and tracked changes intact.",
      "Update the .docx in your dashboard and the URL stays the same, useful when you're iterating on a contract.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "Word documents travel badly over email. Attachments get buried in threads, clipped by mail servers, and resent in four versions nobody can tell apart. A link fixes both halves of the problem now. Drop your .docx here, send the URL, and the recipient lands on the document itself, rendered readable in {{viewer-docx|the browser DOCX viewer}} with no copy of Word, no Google account, and no download step. The original file sits behind the download button for anyone who wants to open it in Word, Google Docs, or LibreOffice. Legacy .doc files host fine but stay download-only; the in-browser reading view is for .docx.",
      "The browser view is built for reading, not for print fidelity. If the recipient needs your exact page layout, fonts, and pagination, PDF is still the format that locks rendering. Export it from Word (the page on how to {{converter-docx-to-pdf}} covers the menus), then {{host-pdf}}. DOCX is the right pick when the file needs to stay editable in the recipient's own software, or when you want to keep iterating without re-sending the link.",
      "The link stays current as you update. Swap the .docx file in your dashboard and the URL doesn't change. Anyone who already has the link sees the new version on their next refresh. Handy when a contract is bouncing back and forth between you and a lawyer three times a day.",
      "Free with no signup; {{pricing|the Pro plan}} adds the higher ceilings. The 25MB free-plan limit covers basically every Word document anyone writes; the only docs that exceed it tend to have embedded images that would be better off compressed first. Your DOCX lives in the same dashboard that lets you {{host-hub}}, so a project's documents stay under a tidy set of links rather than scattered across email threads.",
    ],
    faqs: [
      {
        q: "Does the recipient need Microsoft Word?",
        a: "No. The link opens the document readable in the browser on any device. Word, Google Docs, or LibreOffice only enter the picture if they download the original to edit it.",
      },
      {
        q: "Will comments and track changes show up?",
        a: "In the downloaded file, yes; it's your original, byte for byte. The reading view in the browser doesn't display revision marks, so accept changes before uploading if reviewers should see them resolved.",
      },
      {
        q: "Can I password-protect the link?",
        a: "Yes, on Pro. Anyone clicking the link will need the password before they can read or download the document.",
      },
      {
        q: "Will the recipient see my exact formatting?",
        a: "The browser view is readable rather than pixel-exact. Headings, lists, tables, and images come through; elaborate page layouts simplify. The download is your original file, and PDF remains the format that looks identical everywhere.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-docx", "converter-docx-to-pdf", "host-resume"],
    filePillExamples: ["DOCX", "Readable in the browser", "Up to 25MB free", "Share as a link"],
  },

  pptx: {
    slug: "pptx",
    name: "PPTX",
    title: "Host a PowerPoint as a link: free .pptx hosting",
    description:
      "Drop a .pptx file and get a shareable link. The recipient downloads the deck from a clean page. Export to PDF first for one-click reading in the browser. Free.",
    h1: "Host a PowerPoint as a link.",
    lead: "Drop your .pptx and get a clean URL. The recipient downloads the deck from the link. For a deck that opens in the browser with no download, send the PDF export.",
    keyPoints: [
      "Upload a .pptx file and get a public link in seconds, no signup needed.",
      "The recipient downloads the deck from a clean page and opens it in PowerPoint, Keynote, or Google Slides.",
      "The file arrives exactly as you built it, with embedded fonts and media intact.",
      "Free plan handles decks up to 25MB; most decks fit comfortably unless they're image-heavy.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "PowerPoint decks are heavy and awkward to email. Attachments hit mailbox size limits, arrive flagged as suspicious, or sit in a thread where nobody can tell v3 from v3-final. A link fixes the delivery. Drop the .pptx here and the recipient gets a clean page with the filename, the size, and a download button. One click, and the deck is on their machine ready to open in whatever presentation software they use.",
      "For a client-facing deck where you want zero risk of formatting drift, export to PDF first, then run it through the {{host-pdf|PDF link generator}} on NudgeHost. The PDF version locks the rendering completely, and the file size usually halves because PowerPoint's embedded media gets compressed in the export. The PPTX version is the right pick when you want the deck to remain editable, when you're going to keep updating it, or when the recipient might want to lift a slide into their own deck.",
      "There's a specific flow under {{use-case-deck}} that walks through doing this for a client presentation, including how the view counter tells you whether the link was opened before the call. The same upload-and-link approach lets you {{host-hub}}: a PDF brief, {{host-docx|a Word agenda}}, a CSV of the underlying data. Zip the lot and the bundle travels as {{host-zip|one ZIP link}}.",
      "Free with no watermark. Branded links, custom domains, and password protection live on the paid tier; {{pricing|upgrade to Pro}} when you need them. If you're sending a single deck to a single client, the free tier covers it; if you're sending decks to dozens of clients each quarter, the paid plan pays for itself in the polish of the link alone.",
    ],
    faqs: [
      {
        q: "Does the recipient need PowerPoint installed?",
        a: "They need something that opens .pptx files: PowerPoint, Keynote, and Google Slides all do. For a deck that opens in the browser with nothing installed, export to PDF first and host that.",
      },
      {
        q: "Will animations and slide transitions survive?",
        a: "Yes. The recipient downloads your original file, so everything you built ships with it and plays when they present from their own software.",
      },
      {
        q: "Can I tell whether the deck was opened?",
        a: "Yes. Every link has a view counter in your dashboard, which is genuinely useful before a client meeting.",
      },
      {
        q: "What about Keynote files?",
        a: "Export to .pptx or PDF from Keynote first, then upload. A raw .key file would be an awkward download for anyone outside Apple's ecosystem.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "use-case-deck", "host-zip", "host-html"],
    filePillExamples: ["PPTX", "PPT", "Up to 25MB free", "Share as a link"],
  },

  xlsx: {
    slug: "xlsx",
    name: "XLSX",
    title: "Host an Excel file online: share a spreadsheet as a link",
    description:
      "Drop an .xlsx and get a shareable link. The recipient downloads the workbook intact, with every sheet and formula as you saved it. Free, no signup.",
    h1: "Host an Excel spreadsheet as a link.",
    lead: "Drop your .xlsx and get a URL. The recipient downloads the workbook from a clean page and opens it in their own spreadsheet software, everything intact.",
    keyPoints: [
      "Upload an Excel spreadsheet, get a public link, share it. The recipient downloads the workbook in one click.",
      "Every sheet, formula, and formatting choice arrives exactly as you saved it.",
      "A link beats an attachment: no mailbox size limit, no version confusion, and you can replace the file without resending.",
      "Free with no signup; 25MB per file covers spreadsheets up to roughly 200k rows.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Excel files are awkward to send. They trip mailbox size limits, they arrive in threads as four indistinguishable versions, and corporate filters love to quarantine them. A link fixes the delivery. Drop the .xlsx here and the recipient gets a clean page with the filename and a download button; one click and the workbook is theirs to open in Excel, Numbers, Google Sheets, or LibreOffice.",
      "If the audience only needs to read a summary rather than work the numbers, a PDF travels better. Export the key sheet to PDF and {{host-pdf}}; that link opens in the browser with no download and no spreadsheet software at all. Pick XLSX hosting when the recipient needs the live workbook; pick the PDF route when they just need to see the result.",
      "Hosting matters in a few specific cases. When you're sending a model to a client and don't want them to accidentally edit it. When you're sharing data with a journalist who's on a phone. When you need a permanent URL that doesn't disappear from a Slack DM after the workspace retention window. Each of these is a NudgeHost-shaped problem, and the same uploader that lets you {{host-hub}} handles the PDFs that travel alongside the XLSX, and you can {{host-docx}} from the same dashboard.",
      "Ten active links on {{pricing|the free plan}}, free with no signup. Excel files that exceed 25MB usually have embedded images or pivot tables built on millions of rows; for those cases the Pro plan's higher ceiling is the path. If you want the spreadsheet to expire after a deal closes, link expiry is a one-click setting in the dashboard.",
    ],
    faqs: [
      {
        q: "Will formulas work when the recipient opens the file?",
        a: "Yes. They download your original workbook, so formulas recalculate normally in their own spreadsheet software.",
      },
      {
        q: "Does the recipient need Excel?",
        a: "They need something that opens .xlsx: Excel, Google Sheets, Numbers, or LibreOffice all do. For a read-only summary nobody has to open in a spreadsheet, export to PDF and host that instead.",
      },
      {
        q: "How big a spreadsheet can I upload?",
        a: "25MB on the free plan. That covers spreadsheets up to roughly 200k rows. Higher on paid plans.",
      },
      {
        q: "Do all sheets in the workbook survive?",
        a: "Yes. The file arrives byte-for-byte as you saved it: every sheet, formula, pivot table, and formatting choice included.",
      },
    ],
    relatedToolSlugs: ["viewer-csv", "host-pdf", "host-html", "viewer-docx"],
    filePillExamples: ["XLSX", "XLS", "Up to 25MB free", "Share as a link"],
  },

  txt: {
    slug: "txt",
    name: "TXT",
    title: "Host a TXT file online: share a plain text file as a link",
    description:
      "Drop a .txt and get a shareable link. The recipient grabs the file from a clean download page, byte-for-byte as you saved it. Free, no signup, up to 25MB.",
    h1: "Host a plain text file as a link.",
    lead: "Drop a .txt file and get a URL. The recipient downloads the text from a clean page. Nothing to install on either end.",
    keyPoints: [
      "Upload a .txt file, get a public link, share it. The recipient downloads the file in one click.",
      "The file is stored and served byte-for-byte, so encoding and line endings stay exactly as you saved them.",
      "One link beats pasting a wall of text into chat or burying an attachment in a thread.",
      "Free with no signup; 25MB per file is enough for a novel-length manuscript.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "A .txt file is one of the most portable formats in computing, and one of the most awkward to share. Pasting a long block of text into Slack ruins the formatting and creates a wall of noise. Squeezing it into an email body mangles the line breaks. A NudgeHost link is the tidy alternative. The recipient gets a clean page with the filename and a download button, and the text arrives on their machine exactly as you saved it.",
      "If the file is really structured data dressed as plain text, treat it as the format it is. When it's messy JSON, you can {{dev-json-formatter}} before you share it. If you want the reader to see formatted output in the browser rather than a downloaded file, put the content in a single HTML page and {{host-html}}; for prose written in Markdown you can {{host-md}} to keep the source moving as a file. Plain prose, log files, transcripts, and exported chat history are where .txt hosting is the right answer.",
      "One property worth knowing about. The file travels byte-for-byte, with nothing rewritten on the way through. Whatever encoding and line endings you saved are what the recipient gets, which is exactly what you want for logs and transcripts where fidelity matters. If you control the source, UTF-8 is always the cleaner choice for anything another person will open.",
      "The free plan covers ten active text files at 25MB each, enough for a full novel manuscript with margin to spare. Server logs and chat exports are the most common things that push past it. For those, {{pricing|upgrade to Pro}} or zip the file first; logs compress hard, and you can {{host-zip}} so the archive travels as one download. The same dashboard lets you {{host-hub}} alongside the text.",
    ],
    faqs: [
      {
        q: "Does the recipient need a text editor?",
        a: "Every operating system opens plain text out of the box. The link hands them the file; their device does the rest.",
      },
      {
        q: "Will the line endings survive?",
        a: "Yes. The file is stored and served byte-for-byte, so Windows CRLF and Unix LF arrive exactly as you saved them.",
      },
      {
        q: "Can I share a multi-megabyte log file?",
        a: "Yes, up to 25MB on the free plan. Above that, either filter the log to the relevant lines first or upgrade.",
      },
      {
        q: "What does the recipient see when they click?",
        a: "A clean page with the filename, the size, and a download button. No account needed on their end.",
      },
    ],
    relatedToolSlugs: ["host-md", "viewer-json", "host-zip", "host-html"],
    filePillExamples: ["TXT", "Log file", "Transcript", "Manuscript", "Up to 25MB free"],
  },

  md: {
    slug: "md",
    name: "Markdown",
    title: "Host a Markdown file online: share a .md file as a link",
    description:
      "Drop a Markdown file and get a shareable link for the source. For a rendered page, convert the .md to HTML locally and host that. Free, no signup.",
    h1: "Host a Markdown file as a link.",
    lead: "Drop a .md file and share the source at a clean URL. For a formatted page readers open in the browser, convert the Markdown to HTML and host that instead.",
    keyPoints: [
      "Upload a .md file, get a public link, share it. The recipient downloads the source file in one click.",
      "The Markdown travels unchanged, so it opens cleanly in any editor or tool that reads .md.",
      "For a rendered page, export HTML from your editor or converter and host that file; it opens in the browser at its own link.",
      "Free with no signup; 25MB per file handles anything short of a book-length manuscript.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Markdown is the writing format of every developer-adjacent tool. README files, documentation, blog drafts, design briefs, AI conversation exports. Most of them never need to be a full website, but they do need to be shareable. A link to the .md file beats pasting raw asterisks and pound signs into Slack; the recipient downloads the source and opens it in their own editor, formatting syntax intact.",
      "When the audience should see formatted output rather than source, do the rendering before you upload. Nearly every Markdown editor exports HTML (VS Code's preview, Obsidian, Typora, and command-line converters in the Pandoc family all do it in one step), and when a code fence holds messy JSON you can {{dev-json-formatter}} before you export. The exported HTML is a single file, which is exactly what hosting wants.",
      "That HTML export is the path to a live page. Convert your .md locally and {{host-html}}; the result opens in the browser at its own URL with your styles applied. The hosted .md route is the right path when the readers are people who work in Markdown anyway and want the source. For prose without any Markdown syntax at all, you can {{host-txt}} and skip the format question entirely.",
      "Markdown pairs naturally with other formats during a project. You can {{host-pdf}} for the polished final draft you send to a client, then host the working .md for everyone who wants to read or comment on the latest version. The same flow lets you {{host-hub}} for every file in the bundle, all under {{pricing|the free plan}}.",
    ],
    faqs: [
      {
        q: "Does NudgeHost render my Markdown to HTML?",
        a: "No. The .md travels as a file the recipient downloads. For a rendered page, export HTML from your editor or converter and host that; it opens in the browser at its own link.",
      },
      {
        q: "What about images referenced in the Markdown?",
        a: "Image references are just text inside the file. Absolute URLs work wherever the recipient opens the file; relative paths point at files that didn't travel with it.",
      },
      {
        q: "Does the recipient see the rendered page or the raw .md?",
        a: "The raw .md, from a clean download page. Rendering happens in whatever tool they open it with.",
      },
      {
        q: "Can I host a multi-file Markdown site (like a docs folder)?",
        a: "For a browsable site, render to HTML first; most docs generators emit a static site, and zipping that output serves it at its own subdomain. A ZIP of the raw .md files uploads too, travelling as one download.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-pdf", "host-txt", "host-zip"],
    filePillExamples: ["MD", "Markdown", "README", "Blog draft", "Up to 25MB free"],
  },

  zip: {
    slug: "zip",
    name: "ZIP",
    title: "Host a ZIP file online: upload a site, get a live URL",
    description:
      "Upload a ZIP of a static site or app build and it serves as a live site at its own nudgehost.site link. Any other ZIP shares as a one-click download. Free.",
    h1: "Host a ZIP file as a live site.",
    lead: "Drop a .zip of your site or build folder and it goes live at its own link on nudgehost.site, served from the root so everything loads the way you built it.",
    keyPoints: [
      "Upload a ZIP of a static site or SPA build and it serves at its own subdomain, like your-name.nudgehost.site.",
      "Stylesheets, scripts, images, and fonts load from the root exactly as the build references them.",
      "Client-side routing works; a direct visit to a route serves your index.html and the router takes over.",
      "A ZIP without an index.html shares as a one-click download instead, so a bundle of PDFs or photos still travels as one link.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "A finished site is rarely one file. There's an index page, a stylesheet, a folder of images, a few scripts, and all of it has to travel together with its relative paths intact. Zipping the folder solves the travel (a refresher on {{glossary-file-compression}} explains why the archive is smaller than the folder), and NudgeHost takes the archive the rest of the way. Drop the .zip and the contents are unpacked and served as a live site at {{features-subdomain-sites}}. Your project gets its own address, not a path on someone else's page.",
      "Serving at the root of that subdomain is what makes exported builds work untouched. A bundle that references /assets/index-Ab12Cd34.js finds the file where it expects it, and a client-side router that owns its URLs keeps working because a direct visit to any route serves your index.html. This is the same pipeline behind the page to {{host-react-app}}, and it covers Vue, Svelte, and plain hand-written multi-page sites equally.",
      "Served sites have two limits. An archive can hold up to 200 files, and the unpacked size counts against the file ceiling on your plan, 25MB on the free tier. The entry point is the shallowest index.html in the archive, and a single wrapper folder like dist or my-app is stripped automatically, so zipping the folder rather than its contents is fine. macOS junk like __MACOSX and .DS_Store is filtered on unpack and never reaches the served site. Password-protected archives are the one thing to avoid, since the unpacker cannot read them; leave the archive open and put a password on the link itself instead.",
      "An archive with an index.html serves as a site; any other ZIP shares as a one-click download at its own link, which covers a bundle of PDFs, a folder of photos, or a project handoff without any ceremony, bounded only by the normal per-file cap. If you're sharing a single page rather than a project, it's quicker to {{host-html}} directly or {{host-claude-artifact}} from a paste. Once the link is live, you can {{features-link-updating}}, so a client who bookmarked it always sees the newest version. Ten active links are free with no signup, and {{pricing|the Pro plan}} lifts the size ceiling when a production bundle runs heavy.",
    ],
    faqs: [
      {
        q: "Does NudgeHost unpack the ZIP?",
        a: "Yes. The archive is unpacked and served as a live site at its own nudgehost.site subdomain, with your index.html as the entry point.",
      },
      {
        q: "Will client-side routes work?",
        a: "Yes. A direct visit to a route that isn't a file in the archive serves your index.html, so React Router, Vue Router, and friends handle it from there. Missing assets still return a real 404.",
      },
      {
        q: "What if my ZIP has no index.html?",
        a: "It uploads and shares as a plain downloadable file. The recipient gets a clean page with a download button and the archive arrives intact. Add an index.html when you want the contents served as a site; it can sit at the root or inside the single folder you zipped.",
      },
      {
        q: "What about encrypted ZIPs?",
        a: "The unpacker can't read password-protected archives, so they're declined at upload. Leave the archive itself open and put a password on the NudgeHost link instead.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-claude-artifact", "host-pdf", "host-react-app"],
    filePillExamples: ["ZIP", "Site build", "SPA", "File bundle", "Up to 25MB free"],
  },

  "react-app": {
    slug: "react-app",
    name: "React app",
    title: "Host a React app: deploy a Vite or CRA build as a link",
    description:
      "Drop your React app's build folder as a ZIP and get a live URL in seconds. Works for Vite, Create React App, and any framework that emits a static build.",
    h1: "Host a React app as a live URL.",
    lead: "Zip up your `dist` or `build` folder, drop it here, and your React app goes live at its own link on nudgehost.site. No deploy config, no environment setup.",
    keyPoints: [
      "Zip the output folder from `vite build` or `npm run build` and upload; the app goes live at its own subdomain, like your-name.nudgehost.site.",
      "Client-side routing works via a built-in SPA fallback that rewrites unknown paths to index.html.",
      "The app serves at the root of its link, so hashed asset paths (images, fonts, CSS) load exactly as the build emits them.",
      "Free with no signup; 25MB unpacked handles most prototype builds and small production apps.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "React apps built with Vite or Create React App produce a static `dist` or `build` folder once the build step finishes. That folder is the whole app. An index.html, a bundle of JavaScript, a stylesheet, the assets. Any static host can serve it. NudgeHost serves it from its own subdomain on nudgehost.site after you zip the folder and upload the ZIP. The app sits at the root of that link, so root-absolute asset paths resolve exactly as the build wrote them. That's the whole deploy step. An AI-built React app is no different; you can {{host-lovable-export}} through the identical flow.",
      "Client-side routing is the one detail that catches people out. A React app using React Router or TanStack Router handles its own URLs in JavaScript, which means a direct request to `/about` would normally 404 on a static host because there's no `/about/index.html`. NudgeHost handles this with an SPA fallback. Any path that doesn't match a file in the bundle gets rewritten to `/index.html`, and the router takes it from there; requests for actual files that are missing still 404. When the app calls an external API, that request answers to {{glossary-cors|CORS}}, the browser rule the API itself has to allow.",
      "If your build is more than 25MB compressed, the usual culprit is unminified source maps or unused public-folder images shipped with the bundle. Strip source maps from the production build and audit the public folder before zipping; oversized hero images are a frequent offender, and you can {{converter-png-to-webp}} to shave them down first. For multi-page projects without a framework, you can {{host-zip}} and the bundle serves as a small static site, the same way you'd {{host-claude-artifact}} or {{host-v0-export}}. If you're working in Vue rather than React, you can {{host-vue-app}} from the sibling page that covers Vite and Nuxt static builds.",
      "Ten active builds on {{pricing|the free plan}}, no signup needed. Build sizes for typical prototypes are well under the 25MB ceiling; production apps that ship hundreds of vendored libraries are where the Pro plan's higher limit pays off. Custom domains and password protection live on Pro too, which matter when the URL is going to a client rather than a friend.",
    ],
    faqs: [
      {
        q: "Which folder do I zip, `src` or `dist`?",
        a: "The build output folder, `dist` for Vite and `build` for Create React App. The source folder isn't directly servable.",
      },
      {
        q: "Will client-side routes like /about work?",
        a: "Yes. The SPA fallback rewrites unmatched paths to index.html so your router can pick them up. Requests for files that don't exist in the bundle still return a real 404.",
      },
      {
        q: "Can I use environment variables?",
        a: "Anything inlined at build time (the standard `VITE_` or `REACT_APP_` prefix) ships inside your bundle and works normally. Server-side env vars are not relevant here since there's no server.",
      },
      {
        q: "What about API calls from the app?",
        a: "Calls to external HTTPS APIs work as long as the API allows the NudgeHost origin via CORS. There's no built-in server, so anything requiring a backend will need one hosted elsewhere.",
      },
    ],
    relatedToolSlugs: ["host-vue-app", "host-zip", "host-html", "host-v0-export"],
    filePillExamples: ["ZIP", "Vite build", "CRA build", "SPA", "Up to 25MB free"],
  },

  "vue-app": {
    slug: "vue-app",
    name: "Vue app",
    title: "Host a Vue app: deploy a Vite or Nuxt static build as a link",
    description:
      "Drop your Vue app's build folder as a ZIP and get a live URL in seconds. Works for Vite, Nuxt static, and any Vue setup that emits a static bundle.",
    h1: "Host a Vue app as a live URL.",
    lead: "Zip up your `dist` folder, drop it here, and your Vue app goes live at its own link on nudgehost.site. No CLI, no deploy hooks, no config file.",
    keyPoints: [
      "Zip the `dist` folder from `vite build` (or `nuxt generate` for Nuxt static) and upload; the app goes live at its own subdomain on nudgehost.site.",
      "Vue Router in history mode works via the built-in SPA fallback that rewrites unknown paths to index.html.",
      "Pinia, composables, and any client-side state work normally since the runtime is just static files.",
      "Free with no signup; 25MB unpacked covers most Vite prototypes and small Nuxt static builds.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "Vue 3 with Vite or Nuxt 3 in static mode produces a `dist` folder that's already the complete app. Drop it in a ZIP, hand the ZIP to NudgeHost, and the app is live at its own subdomain on nudgehost.site within seconds, served from the root so the build's asset paths resolve untouched. There's nothing for you to configure, no deploy command to learn, no Git integration to set up first. The build artifact is the deploy.",
      "Vue Router's history mode is the one thing to be careful about. A direct visit to `/products/42` would 404 on a plain static host because no such file exists in the bundle. NudgeHost's SPA fallback rewrites those requests to `/index.html` so the router handles them, exactly the way it works when you {{host-react-app}}. Hash mode works without the fallback, since the path is always the index.",
      "If your project uses Nuxt with full SSR or any server-side feature, the static `nuxt generate` path is what works on NudgeHost. Server routes, API handlers, and `useFetch` against same-origin endpoints aren't available without a Node server backing them. For a fully-rendered Nuxt setup you'd want a host that runs Node; for a prototype, demo, or marketing page, the static build covers it. If your prototype is small enough to live in a single file, you can {{host-html}} and skip the build step entirely.",
      "Ten active links at 25MB each, free; {{pricing|the Pro plan}} adds more headroom. Most Vue prototype bundles fit easily. Production builds that vendor a UI library, three icon packs, and a chart library will sometimes push the limit; tree-shaking the unused parts is usually the cheaper fix, and running any heavy bundle images through the step to {{converter-png-to-webp}} helps too. The same flow lets you {{host-hub}}, covering plain static sites, ZIPs, and AI builder exports if you're shipping a mixed bag.",
    ],
    faqs: [
      {
        q: "Does this work with Vue 2?",
        a: "Yes, as long as your build output is a folder of static files (which Vue CLI emits to `dist`). The hosting is framework-agnostic on the runtime side.",
      },
      {
        q: "Will Vue Router work in history mode?",
        a: "Yes. The SPA fallback rewrites unknown paths to index.html so the router can handle them. Hash mode works without the fallback.",
      },
      {
        q: "Can I host a Nuxt app?",
        a: "Yes, when built with `nuxt generate` (full static mode). Server-rendered Nuxt needs a Node host instead.",
      },
      {
        q: "What about API calls from the Vue app?",
        a: "External HTTPS APIs work as long as their CORS allows the NudgeHost origin. There's no backend on NudgeHost, so anything requiring server code needs to live elsewhere.",
      },
    ],
    relatedToolSlugs: ["host-react-app", "host-zip", "host-html", "host-v0-export"],
    filePillExamples: ["ZIP", "Vite build", "Nuxt static", "SPA", "Up to 25MB free"],
  },

  json: {
    slug: "json",
    name: "JSON",
    title: "Host a JSON file online: share a JSON file as a link",
    description:
      "Drop a JSON file and get a shareable link. The recipient explores it as a collapsible tree in the browser instead of scrolling a chat paste. Free, no signup.",
    h1: "Host a JSON file as a link.",
    lead: "Drop your .json and get a clean URL. The link opens as a collapsible tree in the browser, and the raw file is one click away.",
    keyPoints: [
      "Upload a .json file and get a public link in seconds, no signup.",
      "The link renders the data as a collapsible tree in the browser; the download serves the file exactly as you saved it.",
      "Tidy messy JSON in the free formatter first, so what you share is readable.",
      "Free with no signup; 25MB per file is enough for a long API response or a sizeable config dump.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "JSON is the data format every developer hands to every other developer. API responses, config exports, structured logs, anything that wants to be machine-readable and human-skimmable. The annoying part of sharing it is that pasting 800 lines of JSON into Slack turns the channel into static, and emailing it as an attachment makes a small thing feel heavy. A NudgeHost link opens the data as a collapsible tree in the recipient's browser, with a download button for grabbing the raw file.",
      "The file is stored exactly as you upload it, so the kindness happens before the upload. If the JSON is messy (minified, inconsistently indented, or assembled from multiple sources), {{dev-json-formatter}} first; what lands in your teammate's editor is then something a human can actually scan.",
      "Files past the 25MB free-plan ceiling are usually log dumps that would compress to a fraction of the size; zip or gzip them first and you can {{host-zip}}, with the archive travelling as one download. JSON that's really tabular data may be friendlier to non-developers as a CSV export from your tooling.",
      "Ten active files free with no signup; {{pricing|upgrade to Pro}} for higher limits. If the JSON is something you want to keep editable, swapping the source file in your dashboard updates the link without changing the URL, which is convenient for sharing a dev API mock that keeps evolving.",
    ],
    faqs: [
      {
        q: "What does the recipient get when they click?",
        a: "The JSON rendered as a collapsible tree in the browser, for files up to 10MB, plus a download button. The raw file arrives exactly as you saved it.",
      },
      {
        q: "Does NudgeHost validate my JSON?",
        a: "No. The file is stored as uploaded. Run it through the free JSON formatter first if you want it checked and tidied before sharing.",
      },
      {
        q: "How big a JSON file can I host?",
        a: "25MB on the free plan. Above that, zip or gzip the file and host the archive; it travels as one download.",
      },
      {
        q: "Can I share a private JSON file?",
        a: "Yes, password-protect the link on the Pro plan. The password gate sits in front of the download.",
      },
    ],
    relatedToolSlugs: ["viewer-json", "dev-json-formatter", "host-txt", "host-zip"],
    filePillExamples: ["JSON", "API response", "Config", "Log dump", "Up to 25MB free"],
  },

  svg: {
    slug: "svg",
    name: "SVG",
    title: "Host an SVG file online: share a vector image as a link",
    description:
      "Drop a .svg and get a shareable link. The vector renders crisply at any size; CSS and SMIL animations play, scripts never run in the image context.",
    h1: "Host an SVG file as a link.",
    lead: "Drop your .svg and get a URL. The vector renders crisply at every size, on every screen, with no rasterization step.",
    keyPoints: [
      "Upload a .svg file, get a public link in seconds, share it. The vector renders in any modern browser.",
      "Animations inside the SVG (CSS or SMIL) run normally, since SVG is just markup.",
      "Scripts inside the SVG never run for viewers, since the page renders the file in an image context; static and animated SVGs work, scripted SVGs don't.",
      "Free with no signup; 25MB is enormous for an SVG (most logo files are under 50KB).",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "SVG is the vector format that won the web. Logos, icons, diagrams, illustrations. Anything that needs to look sharp at any zoom level ends up as SVG. Sharing one as a link rather than an attachment matters because email and Slack often render SVG attachments as a placeholder icon, where a URL renders the actual image inline in a link preview.",
      "Hosting an SVG on NudgeHost is the same as hosting any other file. Drop it, get a URL. The difference is what the URL points to. Instead of a download, the SVG renders directly in the browser at its native vector resolution. Designers handing off icons to engineers, brand teams sending a logo to a partner, illustrators sharing a working version of an artwork all want this.",
      "There's one security detail worth flagging. SVG is XML, which means it can carry inline JavaScript via `<script>` tags or event handlers. On NudgeHost the file renders in an image context, and browsers never execute scripts inside an image-rendered SVG, so nothing in the file runs code on the viewer's machine. Static and animated SVGs (using CSS keyframes or SMIL `<animate>` elements) work exactly as designed; scripted SVGs do not. If you genuinely need scripted SVG behaviour, wrap the SVG in HTML and {{host-html}} instead.",
      "Free for ten active files; {{pricing|the Pro plan}} for higher ceilings. SVG file sizes are usually small enough that the 25MB free-plan limit never matters; the exceptions tend to be SVGs exported from Illustrator with every artboard preserved, or SVG sprites containing hundreds of icons. For a whole icon set, you can {{host-zip}} and one link carries the set. For raster image work, you can {{converter-png-to-webp}} as the matching step, and the same uploader lets you {{host-image}} for the JPG, PNG, and WebP files that travel alongside vectors in a real project.",
    ],
    faqs: [
      {
        q: "Will animated SVGs animate when hosted?",
        a: "Yes, CSS animations and SMIL animations run normally. Scripted animations using JavaScript don't, since the image context never executes scripts.",
      },
      {
        q: "Do scripts inside my SVG run?",
        a: "No. The page renders the SVG as an image, and browsers don't execute scripts in that context. If you need scripted behaviour, embed the SVG inside an HTML page and host that.",
      },
      {
        q: "Can I link directly to the SVG from a CSS background-image?",
        a: "No. The share link opens a viewer page rather than serving the raw .svg file, so it can't be referenced from external CSS or an img tag on another site.",
      },
      {
        q: "What if my SVG references external fonts?",
        a: "External font requests work from the hosted page, but for guaranteed rendering, convert the text to outlines in your vector editor before exporting.",
      },
    ],
    relatedToolSlugs: ["host-image", "converter-png-to-webp", "host-html", "host-zip"],
    filePillExamples: ["SVG", "Logo", "Icon", "Diagram", "Up to 25MB free"],
  },

  "chatgpt-html": {
    slug: "chatgpt-html",
    name: "ChatGPT HTML",
    title: "Host ChatGPT-generated HTML as a link",
    description:
      "Copy HTML from a ChatGPT conversation, paste it into NudgeHost, get a live URL. The fastest way to share something ChatGPT just built. Free.",
    h1: "Host ChatGPT-generated HTML as a live URL.",
    lead: "ChatGPT built you a working page, a calculator, a quiz, a tool. Paste the HTML here and get a public URL so anyone can see it.",
    keyPoints: [
      "Paste HTML from a ChatGPT conversation and get a public link in seconds.",
      "No ChatGPT account or login needed for the people you share the link with.",
      "Self-contained pages with inline CSS and JavaScript work without any configuration.",
      "Free plan handles HTML outputs up to 25MB, which is far more than any ChatGPT response will produce.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "ChatGPT will happily build you a working webpage. A landing page, a small dashboard, a quiz, a colour picker, a meeting cost calculator. The output is usually a single block of HTML with CSS and JavaScript inlined, which ChatGPT shows in a code block in the conversation. The hard part isn't generating it. The hard part is sharing the result with someone who isn't sitting next to you.",
      "NudgeHost is the missing step. Copy the HTML block out of ChatGPT (the Copy button on the code block does it cleanly), paste it into NudgeHost, and you get a public URL within seconds. Anyone who clicks the link sees the page. They don't need a ChatGPT account, they don't see your conversation, they just see the working page ChatGPT built. The same paste-and-share flow works when you {{host-claude-artifact}}, and equally well when you {{host-html}} from any other AI builder; {{blog-how-to-host-a-claude-artifact}} covers that version step by step. For full app exports rather than single pages, you can {{host-lovable-export}} the same way.",
      "If ChatGPT gave you something split across multiple files (`index.html`, `styles.css`, `script.js`), ask it to inline everything into one HTML file. ChatGPT does this reliably, and the live page needs everything in the one file. If you'd rather keep the structure, zip the files together and {{host-zip}}; the project then serves as a live site at its own nudgehost.site link, with index.html as the entry point.",
      "Free with no signup, and {{pricing|the Pro plan}} is there when you need higher ceilings. The 25MB free plan ceiling is so far above the size of any ChatGPT HTML response that it's effectively unlimited for this use case. If you're iterating with ChatGPT on the page, updating the source in your dashboard refreshes the live link without changing the URL, which means you can share the link once and keep improving the page behind it. If ChatGPT built you a pitch page or a microsite, you can {{use-case-deck}} so anyone you are pitching opens it in one click.",
    ],
    faqs: [
      {
        q: "How do I copy the HTML from a ChatGPT conversation?",
        a: "When ChatGPT outputs code, hover the code block and click the Copy button at the top right. That gives you the raw HTML on your clipboard.",
      },
      {
        q: "Does the recipient need a ChatGPT account?",
        a: "No. The hosted link is a normal public URL. Your conversation never goes to NudgeHost; only the final HTML block does.",
      },
      {
        q: "Will external scripts and CDN links work?",
        a: "Yes. If the HTML loads Tailwind, React, or any other library from a CDN, those requests fire as normal from the hosted page.",
      },
      {
        q: "What if ChatGPT gave me multiple files?",
        a: "Ask ChatGPT to inline them into one HTML file; it does this reliably. Or zip the files and the archive serves as a live site at its own subdomain, with index.html as the entry point.",
      },
    ],
    relatedToolSlugs: ["host-claude-artifact", "host-html", "host-lovable-export", "host-zip"],
    filePillExamples: ["Paste HTML", "From ChatGPT", "Up to 25MB free", "Live in seconds"],
    widgetDefaultTab: "paste",
  },

  "lovable-export": {
    slug: "lovable-export",
    name: "Lovable export",
    title: "Host a Lovable export: deploy a Lovable.dev app as a link",
    description:
      "Export from Lovable, drop the ZIP into NudgeHost, get a public URL. The simplest path to share what you built. Free.",
    h1: "Host a Lovable export as a live URL.",
    lead: "Export your Lovable app, drop the ZIP here, and it goes live at its own link on nudgehost.site. Skip the Lovable deploy step entirely.",
    keyPoints: [
      "Export your Lovable.dev project as a ZIP and upload it; the app goes live at its own subdomain in seconds.",
      "Multi-file projects are unpacked automatically, with the React Router fallback in place for client-side routes.",
      "No Lovable account needed for the people you share the link with.",
      "Free plan handles exports up to 25MB unpacked, which covers most prototype builds.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "Lovable.dev is one of the cleanest AI-builder experiences right now. You describe what you want, Lovable generates the React app, you iterate in the chat. The catch is the share step. Lovable has its own deploy path, but if you want to put the result on your own domain, or skip the Lovable URL entirely, or just hand someone a link without onboarding them onto another tool, exporting the app and hosting it elsewhere is the cleaner route. For the full walkthrough, read {{blog-how-to-share-a-lovable-site}}.",
      "The export from Lovable is a ZIP of the built React app. Drop the ZIP here and NudgeHost unpacks it and serves it at {{features-subdomain-sites}}, with assets loading from the root as the build references them and unknown paths rewritten to your index so React Router works on direct URL visits. It's the same pipeline you'd use to {{host-react-app}} directly; the only difference is that the source happened to be an AI builder rather than a hand-built Vite project. The result is the same. A link of the project's own that anyone can open.",
      "If Lovable's export gives you the source rather than the build, run `npm install && npm run build` locally first and zip the `dist` folder. Lovable's own export panel has a checkbox to include the built output, which avoids the local build step entirely. The same approach covers other AI builders: {{host-v0-export}} for v0.dev outputs and {{host-bolt-export}} for Bolt.new.",
      "Free for ten active links; {{pricing|the Pro plan}} adds the higher ceilings. Most Lovable exports compress to well under the 25MB free-plan limit. Custom domains, password protection, and the removal of NudgeHost branding live on Pro, all of which matter when you're sharing the link with a client rather than testing internally. Builders who are job-hunting often show a working Lovable app, so you can {{use-case-recruiter}} with the live URL in your application. The same dashboard lets you {{host-hub}} alongside the app, so static HTML, ZIPs, and any other artifact ship from the same place.",
    ],
    faqs: [
      {
        q: "Do I export source code or the built app?",
        a: "Export the built app where Lovable offers it. If you only have source, run `npm install && npm run build` locally and zip the dist folder.",
      },
      {
        q: "Will React Router work?",
        a: "Yes. The SPA fallback rewrites unknown paths to index.html so the router can handle them.",
      },
      {
        q: "Can I update the app without changing the URL?",
        a: "Yes. Re-export from Lovable, upload the new ZIP to your existing link, and the URL stays the same.",
      },
      {
        q: "Does Lovable's `lovable.dev` URL still work after I host on NudgeHost?",
        a: "Yes. NudgeHost is a separate destination, not a redirect. Both URLs continue to work; you choose which one to share.",
      },
    ],
    relatedToolSlugs: ["host-v0-export", "host-bolt-export", "host-react-app", "host-zip"],
    filePillExamples: ["ZIP", "Lovable export", "React build", "Up to 25MB free"],
  },

  "v0-export": {
    slug: "v0-export",
    name: "v0 export",
    title: "Host a v0 export: deploy a v0.dev component or app as a link",
    description:
      "Export from v0.dev, upload the code or ZIP to NudgeHost, get a public URL. Share what v0 built without a Vercel account. Free.",
    h1: "Host a v0 export as a live URL.",
    lead: "v0 built you a component or a full app. Paste the code or drop the ZIP here, get a public URL. No Vercel deploy required.",
    keyPoints: [
      "Paste v0.dev's generated HTML and get a public link in seconds.",
      "Self-contained components ship as a single HTML file via the paste-HTML route.",
      "Multi-file apps work too; build the project, zip the dist folder, and it serves as a live site with routing intact.",
      "Free plan handles exports up to 25MB, comfortably above any v0 output.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "v0.dev is Vercel's design-and-code generator. You describe a UI, v0 generates React + Tailwind code, you iterate. The default path forward is to deploy it on Vercel, which is reasonable if you're already in Vercel-land but heavier than necessary if you just want to share what v0 made. For the full walkthrough, read {{blog-how-to-host-a-v0-export}}.",
      "NudgeHost is the lightweight alternative. For a single self-contained component, copy v0's HTML output into the paste box and you get a URL in seconds. The same flow works when you {{host-claude-artifact}} or {{host-chatgpt-html}}, since the underlying problem is identical. AI builder gave you HTML, you want it on the open web. A multi-file v0 app works too. Build it, zip the dist folder, and the ZIP serves as a live site at its own nudgehost.site link.",
      "There's one practical detail. v0's exports often reference Tailwind via CDN and shadcn/ui components inlined into the code. Both work out of the box when hosted. Tailwind loads from its CDN, and the inlined components ship with the HTML. If v0 split your output across many files (`page.tsx`, `components/*.tsx`), paste the preview HTML for a quick static demo, or run the build locally and zip the output folder; the built app then serves at its own subdomain with client-side routing working.",
      "All of this works on {{pricing|the free plan}}. Pro adds custom domains, which you connect with {{glossary-dns}}, and password protection, both worth it when the URL goes to a client. When a v0 build is the centrepiece of a pitch, you can {{use-case-deck}} and hand it over as the working demo. The dashboard lets you {{host-hub}} alongside the v0 demo. Project bundles work directly too. Just {{host-zip}} and the archive sits at its own link.",
    ],
    faqs: [
      {
        q: "Should I paste the code or upload a ZIP?",
        a: "Paste the code for a single-file HTML demo. For a multi-file app, build it locally and upload the dist folder as a ZIP; it serves as a running site at its own subdomain.",
      },
      {
        q: "Will Tailwind classes work on the hosted page?",
        a: "Yes, if v0's output loads Tailwind from its CDN (the default). The CDN request fires from your hosted page normally.",
      },
      {
        q: "Can I host v0 components individually for an internal style guide?",
        a: "Yes. Host each self-contained component on its own link and keep the set in your dashboard.",
      },
      {
        q: "Does this skip the Vercel deploy step entirely?",
        a: "Yes. The hosted URL is on NudgeHost; you can use it without ever touching Vercel.",
      },
    ],
    relatedToolSlugs: ["host-react-app", "host-claude-artifact", "host-html", "host-zip"],
    filePillExamples: ["Paste HTML", "ZIP", "v0 export", "Up to 25MB free"],
  },

  "bolt-export": {
    slug: "bolt-export",
    name: "Bolt export",
    title: "Host a Bolt.new export: deploy a Bolt app as a link",
    description:
      "Export from Bolt.new, drop the ZIP into NudgeHost, get a public URL. Skip the StackBlitz preview and share a real link. Free.",
    h1: "Host a Bolt.new export as a live URL.",
    lead: "Bolt built you an app inside StackBlitz. Download the project as a ZIP, drop it here, and it goes live at its own link on nudgehost.site.",
    keyPoints: [
      "Export from Bolt.new (Download via the StackBlitz menu) and upload the ZIP; the app goes live at its own subdomain in seconds.",
      "Static builds run as-is; for source-only exports, run `npm install && npm run build` locally before zipping the dist folder.",
      "The recipient sees a normal URL and never sees Bolt or StackBlitz.",
      "Free plan handles exports up to 25MB unpacked, well above the size of most prototypes.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-06-12",
    body: [
      "Bolt.new from StackBlitz is the AI builder that runs the whole development environment in your browser. You describe what you want, Bolt builds the project inside an in-browser Node container, and you can preview the result without leaving the tab. The challenge starts when you want to share the result outside StackBlitz. The default options are 'send the StackBlitz preview link', which exposes the project structure, or 'deploy via StackBlitz', which has its own friction.",
      "Exporting and hosting on NudgeHost is the cleanest middle ground. Bolt lets you download the project as a ZIP through the StackBlitz UI; that ZIP either contains a `dist` folder ready to host, or contains source you'll need to build locally. Either path ends with a folder of static files. You can {{host-react-app}} directly, or you can {{host-zip}} and NudgeHost serves the archive as a site at its own subdomain, with client-side routes working on direct visits. The recipient gets a clean link of the project's own on nudgehost.site (or your own domain on Pro), with no StackBlitz chrome anywhere in sight.",
      "If you're staying inside the Bolt loop and iterating, the deploy-to-NudgeHost step takes about twenty seconds. Download the new ZIP, drag-and-drop, and the link refreshes. The URL itself doesn't change between uploads, so anyone with the link gets the latest version automatically. That's particularly useful when you're showing progress to a client and want to keep iterating without re-pasting links.",
      "Free for ten active links; {{pricing|the Pro plan}} adds the higher ceilings. Bolt outputs vary in size depending on what was generated, but most prototypes compress to a few MB. A working Bolt prototype is strong proof of skill in a job hunt, so you can {{use-case-recruiter}} with the live link. The dashboard lets you {{host-hub}} alongside the Bolt app if you want to share supporting assets, and the same approach lets you {{host-lovable-export}} or {{host-v0-export}} for the other AI builders that work the same way; {{blog-how-to-share-a-lovable-site}} covers that flow in full.",
    ],
    faqs: [
      {
        q: "Where do I find the export option in Bolt?",
        a: "In the StackBlitz interface that backs Bolt, look for the Download project option in the file menu. It produces a ZIP of the whole project.",
      },
      {
        q: "Do I host the source or the built app?",
        a: "The built app. If your export only has source, run `npm install && npm run build` locally and zip the dist or build folder.",
      },
      {
        q: "Will the StackBlitz preview URL still work?",
        a: "Yes, the StackBlitz preview is unaffected. Your NudgeHost URL is a separate, parallel link you control.",
      },
      {
        q: "Can I update the app without changing the URL?",
        a: "Yes. Re-export from Bolt, upload the new ZIP to the same NudgeHost link, and the URL stays the same.",
      },
    ],
    relatedToolSlugs: ["host-lovable-export", "host-v0-export", "host-react-app", "host-zip"],
    filePillExamples: ["ZIP", "Bolt export", "StackBlitz", "Up to 25MB free"],
  },

  image: {
    slug: "image",
    name: "Image",
    title: "Host an image online: share a JPG, PNG, or WebP as a link",
    description:
      "Drop an image and get a clean shareable link. Works for JPG, PNG, WebP, GIF, and SVG. Free, no signup, no watermark.",
    h1: "Host an image as a link.",
    lead: "Drop a JPG, PNG, or WebP and get a clean URL. Perfect for forum posts, design handoffs, and anywhere you'd otherwise paste a screenshot.",
    keyPoints: [
      "Upload an image (JPG, PNG, WebP, GIF, or SVG) and get a public link in seconds, no signup.",
      "The image serves exactly as uploaded, full resolution, with no compression and no watermark.",
      "Viewers see the image full size in the browser, with no account and no download step.",
      "Free plan covers ten active images at 25MB each. Most photographs are well under 5MB.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Hosting an image as a link sounds trivial until you actually try to do it. Imgur compresses photos. Twitter and Reddit auto-crop the preview. iCloud Photo Sharing wants the recipient signed in. Google Photos albums expire when you forget about them. NudgeHost is the boring, reliable middle. Drop the file, get a URL, and the URL still works two years later.",
      "There's a small privacy detail that often gets missed. JPGs from a phone carry EXIF metadata including the camera model, the exact date and time, and (if your location services were on) the GPS coordinates of where the photo was taken. NudgeHost stores the file exactly as you upload it and does not strip this, so check before sharing a photo publicly. Every major phone and desktop OS can remove location data on export; do that first if the metadata shouldn't travel.",
      "For images that will live on the web, especially in pages you build yourself, file size matters. A 4MB iPhone photo can usually become a 400KB WebP without any visible quality loss; for screenshots, you can {{converter-png-to-webp}} the same way. Photographs in HEIC (the format iPhones save in by default) won't open on non-Apple devices, so {{converter-heic-to-jpg}} before hosting and the photo opens anywhere. If the image is really a vector logo or icon, you can {{host-svg}} for the cleaner long-term result.",
      "No watermark, no signup, on {{pricing|the free plan}}. The 25MB free-plan limit covers every photograph anyone produces without a medium-format camera. For a whole gallery, zip the images and {{host-zip}} for a single shareable link, or stick them inside an HTML layout and {{host-html}} instead. Custom domains and link expiry are on Pro.",
    ],
    faqs: [
      {
        q: "Does NudgeHost compress my image?",
        a: "No. The image is served at the resolution and quality you uploaded. If you want a lighter file, convert it before uploading.",
      },
      {
        q: "Will EXIF metadata be stripped?",
        a: "No. The file is stored byte-for-byte as uploaded, metadata included. Remove location data before uploading if the image is going somewhere public; every major OS has an export option that does it.",
      },
      {
        q: "What about animated GIFs?",
        a: "GIFs work, but for animations longer than a few seconds, hosting as MP4 is dramatically smaller. The MP4 hosting page covers the trade-off.",
      },
      {
        q: "Can I hotlink the image from another site?",
        a: "No. The share link opens a viewer page rather than serving the raw image file, so it won't work inside an img tag elsewhere. It's built for sharing with people, not embedding.",
      },
    ],
    relatedToolSlugs: ["host-svg", "host-gif", "converter-png-to-webp", "converter-heic-to-jpg"],
    filePillExamples: ["JPG", "PNG", "WebP", "GIF", "Up to 25MB free"],
  },

  gif: {
    slug: "gif",
    name: "GIF",
    title: "Host a GIF online: share an animated GIF as a link",
    description:
      "Drop a GIF and get a shareable link. Animation plays in any modern browser; for clips over 5 seconds, hosting as MP4 is usually 90 percent smaller.",
    h1: "Host a GIF as a link.",
    lead: "Drop an animated GIF and get a URL. The animation plays in the browser the moment they click.",
    keyPoints: [
      "Upload a .gif, get a public link in seconds, share it. The animation plays in any modern browser.",
      "Viewers see the GIF playing full size on the link page, with no account and no download step.",
      "For animations longer than 5 seconds, hosting as MP4 is typically 90 percent smaller with no visible difference.",
      "Free plan handles GIFs up to 25MB; most short clips fit comfortably.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "GIFs are everywhere despite being technically antique. The format was designed in 1987 for static images, then extended for short animations, then absorbed by the web culture of reaction loops and tutorials. Sharing one as a NudgeHost link is the cleanest way to hand someone a GIF that's too big for a chat upload, or to keep a demo clip at a stable URL for a bug report.",
      "There's a size trap worth knowing about. A two-second animated GIF can easily be 8MB. The same animation as an MP4 with H.264 encoding is usually under 200KB and looks identical. If your GIF is more than five seconds long, converting to MP4 first is almost always the right call. The page loads faster, the bandwidth is lighter, and the quality looks the same. You can {{host-mp4}} from the same dashboard once it's encoded. GIF hosting is the right pick when you specifically need GIF (forum software that won't accept MP4, Slack reactions, certain Reddit subs).",
      "Animated GIFs also have a subtle accessibility issue. They auto-play with no pause control. For documentation or onboarding flows where someone might want to slow down or stop a demo, an MP4 (which gets browser-native play/pause controls) is friendlier. For a quick reaction or a five-frame loop, GIF is fine; nobody needs to pause a celebration emoji.",
      "Free for ten active links; {{pricing|a paid plan}} adds more headroom. The 25MB free-plan limit holds most GIFs comfortably. For a documentation page with demos, host the GIFs from your dashboard and link to them from the page you {{host-html}}; that keeps everything under one set of URLs. The same uploader lets you {{host-image}} for static screenshots, and the matching tooling for raster conversion lives in {{converters-hub}}.",
    ],
    faqs: [
      {
        q: "Will the animation play in any browser?",
        a: "Yes. GIF animation playback is universally supported across every browser made in the last decade.",
      },
      {
        q: "Should I convert my GIF to MP4 first?",
        a: "If it's longer than about 5 seconds, yes. MP4 is dramatically smaller for the same animation. For short loops, GIF is fine.",
      },
      {
        q: "Why is my GIF so large?",
        a: "GIF uses per-pixel palette indexing rather than modern video compression. Hundreds of frames of similar content still each pay the full bitmap cost. MP4 codecs collapse that into a fraction of the size.",
      },
      {
        q: "Can I host a static GIF (single frame)?",
        a: "Yes, though for static images, PNG or WebP are smaller and sharper. The same NudgeHost flow handles all three.",
      },
    ],
    relatedToolSlugs: ["host-mp4", "host-image", "converter-png-to-webp", "host-html"],
    filePillExamples: ["GIF", "Animated", "Loop", "Up to 25MB free"],
  },

  mp4: {
    slug: "mp4",
    name: "MP4",
    title: "Host an MP4 online: share a video file as a link",
    description:
      "Drop an MP4 video and get a shareable link in seconds. It plays right on the link page with native browser controls. Free up to 25MB.",
    h1: "Host an MP4 video as a link.",
    lead: "Drop your MP4 and get a clean URL. The video plays on the link page with the browser's own controls. No YouTube account, no upload queue.",
    keyPoints: [
      "Upload an .mp4 file, get a public link in seconds, share it. The video plays right on the link page.",
      "Native browser controls: play, pause, scrub, volume, fullscreen. No player library, no platform chrome.",
      "H.264 with AAC audio plays everywhere; a codec the browser can't decode falls back to a clean download.",
      "Free plan handles video files up to 25MB. Short screen recordings and demos fit comfortably.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Putting a video online used to mean YouTube, with all the friction that implied: ads, autoplay of unrelated content, an upload queue, a public profile, copyright algorithms. For a short demo video, a screen recording, or a clip from a meeting, none of that is what you want. You want a URL. You drop the file, you get the URL, you send it.",
      "The link lands the recipient on a clean page where the video plays inline with the browser's native controls: play, pause, scrub, volume, fullscreen. The player loads metadata first, so opening the page doesn't pull the whole file before anyone presses play. If the recipient's browser can't decode the codec inside the container, the page swaps to a download card instead of a broken player, and the download button in the header is always there for keeping a copy.",
      "Compression matters more for video than for any other format, because every play spends {{glossary-bandwidth|bandwidth}} on the full file again. A 30-second screen recording from QuickTime can easily be 80MB at H.264 with default settings; the same recording exported with HandBrake's Web preset is usually under 5MB and looks identical at typical viewing sizes. If your file is over 25MB and you're on the free plan, re-encoding before upload is almost always the right move. For short looped animations where you don't need scrubbable controls, you can {{host-gif}} instead and the file stays lighter.",
      "Hosted free with no watermark, and larger videos and longer clips fit on {{pricing|the Pro plan}}. A product demo video usually travels with a sales conversation, so you can {{use-case-deck}} and drop the video link alongside the deck. The dashboard lets you {{host-hub}} next to the video: a {{host-pdf|PDF link generator}} for the script, somewhere to {{host-image}} for stills, and a place to {{host-mp3}} when you're shipping the audio track separately.",
    ],
    faqs: [
      {
        q: "Does the video play on the link page?",
        a: "Yes. It plays inline with the browser's native controls. If the browser can't decode the codec, the page falls back to a download card instead.",
      },
      {
        q: "What does the recipient need to play it?",
        a: "Nothing. Every modern browser plays H.264 MP4 on the page itself; there's no app or player to install.",
      },
      {
        q: "What codec should the MP4 use?",
        a: "H.264 video with AAC audio is the safest combination. H.265 (HEVC) support is patchier across devices; stick with H.264 unless you have a specific reason.",
      },
      {
        q: "Can I embed the video in another page?",
        a: "No. The share link is a page, not a raw video URL, so it doesn't work as the src of a video tag. It's built for handing the file to a person.",
      },
    ],
    relatedToolSlugs: ["host-gif", "host-image", "host-html", "host-mp3"],
    filePillExamples: ["MP4", "H.264", "Demo", "Screen recording", "Up to 25MB free"],
  },

  mp3: {
    slug: "mp3",
    name: "MP3",
    title: "Host an MP3 online: share an audio file as a link",
    description:
      "Drop an MP3 and get a shareable link. It plays right on the link page with native audio controls; the free 25MB ceiling fits about 25 minutes at 128kbps.",
    h1: "Host an MP3 audio file as a link.",
    lead: "Drop your MP3 and get a clean URL. The audio plays on the link page with the browser's own controls, no embed code, no podcast platform.",
    keyPoints: [
      "Upload an .mp3 file and get a public link in seconds, no signup.",
      "Plays right on the link page with native play, pause, and scrub controls.",
      "Works for podcast pilots, voiceovers, meeting recordings, and music demos without needing a platform.",
      "Free plan handles audio files up to 25MB, which is roughly 25 minutes at 128kbps.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Hosting an audio file as a link is the unglamorous middle path between 'send the file as an email attachment' and 'set up a SoundCloud account.' Voiceover demos, podcast pilots, meeting recordings, music sketches, language practice clips, any of it can sit at a NudgeHost URL with a single click of upload. The recipient gets a tidy page where the clip plays with the browser's built-in controls, plus a download button if they want to keep a copy. No account, no app.",
      "There's a sizing detail that comes up. MP3 at 128kbps is around 1MB per minute; at 192kbps it's about 1.4MB per minute. The 25MB free-plan ceiling covers roughly 25 minutes at 128kbps, or 15 minutes at 192kbps. For a single demo or a short voiceover that's plenty. For a full podcast episode, either downsample before upload (most audio editors export at 96kbps for spoken-word content without any noticeable quality drop) or use Pro's higher ceiling.",
      "MP3 is also the format with the broadest decoder support of any audio format. Every browser, every operating system, every car stereo from the last twenty years. If you're sending an audio clip to someone whose device is unknown, MP3 is the safe bet. For higher-quality music sharing where every kilobyte matters less, FLAC is a better master format, though NudgeHost serves both interchangeably.",
      "Free with no signup; {{pricing|the Pro plan}} adds higher ceilings. The hosted page includes a download button so the recipient can grab the file if they want to keep a copy. Audio for a marketing video pairs naturally with the video itself, which you can {{host-mp4}} from the same dashboard. A voiceover or a recorded narration that backs a pitch also fits the flow to {{use-case-deck}}, so the sound and the slides live together. NudgeHost will {{host-hub}} alongside the audio, covering every other format you'd ship in the same project.",
    ],
    faqs: [
      {
        q: "Does the recipient need a media player installed?",
        a: "No. The clip plays on the link page using the browser's built-in audio controls. Every modern browser plays MP3.",
      },
      {
        q: "Can I host other audio formats?",
        a: "Yes. WAV, OGG, and M4A also play on the link page; a format the browser can't decode falls back to a download. FLAC and the rest host fine as downloads.",
      },
      {
        q: "Does the audio play on the link page?",
        a: "Yes, with native play, pause, and scrub controls. There's also a download button for keeping a copy.",
      },
      {
        q: "How long an audio clip can I host on the free plan?",
        a: "About 25 minutes at 128kbps, or 15 minutes at 192kbps. Re-encode to 96kbps for spoken-word content if you need to squeeze in more time.",
      },
    ],
    relatedToolSlugs: ["host-mp4", "host-image", "host-zip", "host-html"],
    filePillExamples: ["MP3", "Audio", "Voiceover", "Podcast pilot", "Up to 25MB free"],
  },
};
