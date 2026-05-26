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
    lead: "Drop a PDF here and get a clean, shareable link in seconds. No sign-up required, no expiry, no upload limits on the file you're holding right now.",
    keyPoints: [
      "Drop a PDF, get a clean nudgehost.com link in seconds. No signup required.",
      "Free plan covers up to 10 active PDFs at 25MB each, with no link expiry by default.",
      "Recipients open the PDF in their browser. There's nothing to install or download.",
      "Built-in open analytics show when each PDF link is viewed and roughly from where.",
    ],
    body: [
      "Sending a PDF used to mean a cluttered email attachment, a Dropbox share link with a login prompt, or asking the recipient to download something they didn't really want to download. NudgeHost is the friendlier middle ground. You drop the PDF, we give you back a {{features-shareable-links}}, you send it. The recipient clicks it and reads the PDF straight away. If you'd rather they see it without downloading anything, every shared file also opens in {{viewer-pdf}}, so there's nothing for them to install. Whether a file opens in the browser or downloads is decided by its {{glossary-mime-type}}, which we set correctly for you.",
      "If you need a flat image of a page instead of a clickable document, perhaps to drop into a slide deck or to post somewhere that won't accept a PDF, you can {{converter-pdf-to-jpg}} and host the result the same way. That's one of many format jobs handled by {{converters-hub}}. If your PDF is really a resume, there's a tailored flow to {{host-resume}} that adds open-tracking so you know when a recruiter has looked at it.",
      "On {{pricing}} you get 10 active PDFs at up to 25MB each, with no expiry, so your link stays live as long as you want it to. Larger files, password protection, custom domains, and branded links are all worth a paid plan once you're sharing PDFs regularly.",
      "Built-in analytics let you see when your PDF was opened and from where. That's particularly useful when you've sent a proposal or a contract and you're wondering whether it's been read yet. If the file is a big one, the guide on how to {{use-case-large-pdf}} covers the email-size-limit problem in full. For a step-by-step version, read {{blog-how-to-send-a-large-pdf-without-email}}. The same uploader handles every other format too, so once you've sent your first PDF you can {{host-hub}} without learning anything new.",
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
        a: "Forever, by default. You can also set an expiry date if you want the link to self-destruct after a set time.",
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
      "Works for single-file pages, AI-generated outputs, and multi-file sites bundled as a ZIP.",
      "Client-side JavaScript runs as expected, which makes this a good fit for prototypes, demos, and AI artifacts.",
      "Free with no signup; custom domains, password protection, and unbranded links are on a paid plan.",
    ],
    body: [
      "Sometimes you just need to put an HTML file on the internet. Maybe it's a prototype you want to show a client, a single-page landing page for a side project, or an HTML output you just generated from an AI tool and want to share with a friend. You don't need a server or a Vercel deployment for any of that. You just need a URL. A page like this is a {{glossary-static-site}}, served exactly as it is with nothing building it on each visit.",
      "NudgeHost takes any HTML file, whether a single page or a multi-file site, and puts it on the open web at a clean URL within seconds. Scripts and styles run on the hosted page, since NudgeHost {{features-html-rendering}}. If your project is more than one file, the simplest route is to zip everything together and {{host-zip}}; NudgeHost unpacks it and serves it as a site. If you're publishing something a model built for you, there's a purpose-built flow to {{host-claude-artifact}} that handles the copy-paste case directly. For personal use cases like a one-page event site, the guide on how to {{use-case-wedding}} walks through that flow start to finish.",
      "Set a password on the link if you want the prototype private. Custom domains and unbranded links come with {{pricing}}. And the page is already running on a real CDN, so testing load behaviour before publishing isn't a separate step. A public page also benefits from {{glossary-seo}} once you want search engines to find it.",
      "HTML isn't the only thing you can put online this way. The same uploader will {{host-hub}}, and a finished PDF export of your page can just as easily {{host-pdf}} for people who'd rather read than browse. If you only need to look at a file rather than publish it, {{viewers-hub}} open common formats in the browser directly.",
    ],
    faqs: [
      {
        q: "Do I need to zip my HTML before uploading?",
        a: "Only if you have multiple files. A single HTML file uploads directly. If you've got CSS, JS, or images alongside it, zip everything into one file and upload that.",
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
    filePillExamples: ["HTML", "ZIP", "Paste HTML", "Multi-file", "AI outputs"],
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
      "If your artifact is split across several files, zip them together first and {{host-zip}} instead; NudgeHost unpacks the archive and serves it as a site. And if you want to hand someone a static, non-interactive version, say a printable summary of a dashboard, you can always export it and {{host-pdf}} alongside the live one.",
      "Under {{pricing}}, your artifact stays live with no expiry. You can {{features-link-updating}} whenever Claude builds a v2, so the address stays the same while the content changes, or set an expiry if you only want the link to live for a week. The same approach works for any single-file HTML output: ChatGPT-generated HTML, v0 exports, Lovable exports, Bolt exports. For more grounded examples of what people do with shared links, like how to {{use-case-deck}}, you can {{use-cases-hub}} step by step.",
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
      "Upload your CV and get a clean shareable link with open-tracking switched on by default.",
      "Recruiters open the resume in their browser, with no download, no Dropbox login, and no attachment to wrangle.",
      "Updating the file keeps the same URL, so every employer who already has the link sees the latest version.",
      "Free for one resume; custom domains and the removal of NudgeHost branding are on a paid plan.",
    ],
    body: [
      "Sending a resume as an email attachment is fine, until you realise the recruiter never told you whether they read it. A NudgeHost link to your resume tells you when it was opened, how many times, and roughly where from. Same email, same recruiter, much more useful to you. Most resumes are PDFs, and everything that's true of hosting one applies here too. This page is really the {{host-pdf}} flow with open-tracking turned on by default.",
      "Your link is short and clean, like nudgehost.com/your-name. The recruiter opens it in their browser instantly. There's no download prompt, no Dropbox login, and no 'this file may be unsafe' warning to scare them off. If you're applying for design or front-end roles, a resume is rarely enough on its own; the natural next step is to {{host-portfolio}}, then {{use-case-recruiter}} alongside the resume.",
      "If you're job-hunting, make one resume link and put it in your LinkedIn, your email signature, and your application emails. When you update the resume, the link stays the same. Just swap the file out and everyone who's already got the link sees the new version, with no {{glossary-404-error}} from a file that moved. A custom domain and the removal of NudgeHost branding both come with {{pricing}}, which is worth it if you're sending the link to dozens of employers. If you're still weighing tools, you can {{compare-hub}} and see how NudgeHost stacks up against the alternatives.",
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
      "Upload a portfolio PDF, a built HTML site, or a ZIP of pages, and get a clean shareable link in seconds.",
      "Recruiters, clients, and agencies open your work in the browser with no account, no download, and no login wall.",
      "Open-tracking shows when your portfolio was viewed, which helps before an interview or a pitch call.",
      "Update the file later and the link stays the same, so everyone who has it sees your latest work.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-25",
    dateModified: "2026-05-25",
    body: [
      "A portfolio only earns you anything if the person you sent it to actually opens it. Behance and Dribbble wrap your work in their own navigation, ads, and a 'suggested creators' rail that pulls attention toward other people. A Google Drive folder makes a recruiter sign in before they see a single piece. A 40MB PDF attachment gets stripped by a corporate mail server, or it sits unopened because nobody downloads files from someone they have not met. A plain link sidesteps all of it. Your work opens directly, on any device, with nothing in front of it.",
      "Most portfolios are one of three things, and each becomes a link the same way. A designed PDF is the simplest case, and the {{host-pdf}} flow turns it into a URL in seconds. If your portfolio is a built site, a Framer export or a hand-coded page, you {{host-html}} and it goes live at a clean address with the layout and fonts intact. Photographers who want to send a single hero shot or a contact sheet can {{host-image}} instead, and the picture renders full size in the browser rather than forcing a download. A multi-page case study with its own images and index travels best zipped into one archive, which NudgeHost unpacks and serves as a small site at a single URL.",
      "The single most common thing people do with a portfolio link is {{use-case-recruiter}}, usually attached to a job application. The recruiter clicks once and sees your work in the browser, with no account to create and no download to approve. Agencies and prospective clients get the same friction-free open, which matters when you are one of forty links in someone's inbox that week. Because the link reports opens, you also learn whether your portfolio was reviewed before an interview or whether the application is still unread. That tells you when a follow-up is worth sending and when you are waiting on a decision nobody has made yet.",
      "Work changes, and the link keeps up. Swap the file in your dashboard and the URL stays the same, so every studio and recruiter who already has it sees your latest pieces on the next refresh, with no need to resend anything. Hosting one portfolio costs nothing, and you can look at {{pricing}} when you want a custom domain on the link or the NudgeHost branding removed, both of which matter once you are sending it to dozens of studios. The same dashboard handles {{host-hub}}, so your portfolio, your CV, and a short cover note all sit under one tidy set of links instead of scattered across email threads.",
    ],
    faqs: [
      {
        q: "What format should my portfolio be in?",
        a: "Whatever you already have. A designed PDF, a built HTML site, a set of images, or a ZIP of all of them. Each one becomes a link the same way.",
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
    filePillExamples: ["PDF", "HTML site", "Images", "ZIP", "Up to 25MB free"],
  },

  docx: {
    slug: "docx",
    name: "DOCX",
    title: "Host a DOCX file online: share a Word document as a link",
    description:
      "Drop a Word document and get a shareable link in seconds. The recipient opens it in their browser without Microsoft Word. Free, no signup.",
    h1: "Host a Word document as a link.",
    lead: "Drop your .docx and we'll hand back a URL anyone can click. They read the document in their browser. They don't need Word.",
    keyPoints: [
      "Upload a Word document, get a public link, share the link. No Microsoft Word needed on the other end.",
      "Comments and track changes survive the upload, so the file you send is exactly the file the recipient sees.",
      "Update the .docx in your dashboard and the URL stays the same, useful when you're iterating on a contract.",
      "Free for 10 active links at 25MB per file. Most Word docs land well under 1MB.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Word documents travel badly. The recipient might be on Word for Mac while you're on Word for Windows, or on Google Docs, or on a Chromebook with neither. Fonts shift, track-changes bubbles drift, embedded images get rescaled. The cleanest fix is not to make them open the file at all. Drop your DOCX here, send the link, and let them read it in their browser through {{viewer-docx}} with the formatting intact.",
      "If you'd rather lock the formatting completely so nothing can shift on the recipient's end, send it through {{converter-docx-to-pdf}} first, then {{host-pdf}}. PDF is the only format that genuinely looks the same everywhere. DOCX is the right pick when the recipient still needs to edit it in their own copy of Word later, or when you want to keep iterating on it without re-sending the link.",
      "The link stays current as you update. Swap the .docx file in your dashboard and the URL doesn't change. Anyone who already has the link sees the new version on their next refresh. Handy when a contract is bouncing back and forth between you and a lawyer three times a day.",
      "Free with no signup; {{pricing}} adds the higher ceilings. The 25MB free-plan limit covers basically every Word document anyone writes; the only docs that exceed it tend to have embedded images that would be better off compressed first. Your DOCX lives in the same dashboard as {{host-hub}} for every other format, so a project's documents stay under a tidy set of links rather than scattered across email threads.",
    ],
    faqs: [
      {
        q: "Does the recipient need Microsoft Word?",
        a: "No. The link opens in any browser. Word is only needed if they want to edit it locally.",
      },
      {
        q: "Will comments and track changes show up?",
        a: "Yes. The browser viewer renders Word's revision marks. For a clean copy with no marks, accept all changes before uploading, or convert to PDF first.",
      },
      {
        q: "Can I password-protect the link?",
        a: "Yes, on Pro. Anyone clicking the link will need the password before they can view the document.",
      },
      {
        q: "What if the formatting looks slightly off in the viewer?",
        a: "Very complex layouts can shift fractionally in the browser-based viewer. Convert to PDF for a pixel-exact match.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-docx", "converter-docx-to-pdf", "host-resume"],
    filePillExamples: ["DOCX", "DOC", "Up to 25MB free", "No Word needed"],
  },

  pptx: {
    slug: "pptx",
    name: "PPTX",
    title: "Host a PowerPoint as a link: free .pptx hosting",
    description:
      "Drop a .pptx file and get a shareable link. The deck renders in any browser at 16:9 or 4:3 with embedded fonts preserved. No PowerPoint required.",
    h1: "Host a PowerPoint as a link.",
    lead: "Drop your .pptx and get a clean URL. The deck opens in the recipient's browser. No PowerPoint, no Keynote, no download dance.",
    keyPoints: [
      "Upload a .pptx file and get a public link in seconds, no signup needed.",
      "Recipients see the deck rendered as slides in their browser without PowerPoint installed.",
      "16:9 and 4:3 decks both render correctly, with embedded fonts preserved where the file includes them.",
      "Free plan handles decks up to 25MB; most decks fit comfortably unless they're image-heavy.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "PowerPoint decks are heavy and finicky. Different versions of PowerPoint render the same file slightly differently. Keynote refuses to open some .pptx files cleanly. Google Slides imports with fonts substituted. Sharing the file as an email attachment guarantees one of these will go wrong on the recipient's end. A NudgeHost link sidesteps all of it. The deck renders in the browser the same way for everyone, the slide order is preserved, and the deck opens in one click rather than five.",
      "For a client-facing deck where you want zero risk of formatting drift, export to PDF first, then run it through the {{host-pdf}} on NudgeHost. The PDF version locks the rendering completely, and the file size usually halves because PowerPoint's embedded media gets compressed in the export. The PPTX version is the right pick when you want the deck to remain editable, when you're going to keep updating it, or when the recipient might want to lift a slide into their own deck.",
      "There's a specific flow under {{use-case-deck}} that walks through doing this for a client presentation, including how the open-tracking lets you know whether the client previewed the deck before the call. The same upload-and-link approach extends across {{host-hub}}: a PDF brief, a Word agenda, a CSV of the underlying data.",
      "Free with no watermark. Branded links, custom domains, and password protection live on the paid tier; {{pricing}} when you need them. If you're sending a single deck to a single client, the free tier covers it; if you're sending decks to dozens of clients each quarter, the paid plan pays for itself in the polish of the link alone.",
    ],
    faqs: [
      {
        q: "Does the recipient need PowerPoint installed?",
        a: "No. The deck renders in their browser. PowerPoint is only required if they want to edit or present locally.",
      },
      {
        q: "Will animations and slide transitions work?",
        a: "Static slide content renders correctly. Built-in transitions and animations don't fire in the browser viewer. If those matter, export to video or PDF.",
      },
      {
        q: "Can I track who opened the deck?",
        a: "Yes. Open analytics show when the deck was viewed and from where, which is genuinely useful before a client meeting.",
      },
      {
        q: "What about Keynote files?",
        a: "Export your Keynote deck to .pptx first, then upload. NudgeHost runs the .pptx renderer; Keynote's .key format isn't supported natively yet.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "use-case-deck", "host-zip", "host-html"],
    filePillExamples: ["PPTX", "PPT", "16:9", "4:3", "Up to 25MB free"],
  },

  xlsx: {
    slug: "xlsx",
    name: "XLSX",
    title: "Host an Excel file online: share a spreadsheet as a link",
    description:
      "Drop an .xlsx and get a shareable link. Multi-sheet workbooks keep their tab bar; formulas display their last-computed values. No Excel needed.",
    h1: "Host an Excel spreadsheet as a link.",
    lead: "Drop your .xlsx and get a URL. The recipient opens the file in their browser, scrolls the rows, copies what they need. No Excel licence required.",
    keyPoints: [
      "Upload an Excel spreadsheet, get a public link, share it. No Excel install needed on the recipient's machine.",
      "Multiple sheets in one workbook all render correctly, with the tab bar preserved at the bottom.",
      "Formulas display as their last-computed values, since the viewer is a viewer rather than a calculation engine.",
      "Free with no signup; 25MB per file covers spreadsheets up to roughly 200k rows.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Excel files are heavier than they look. A spreadsheet that opens in a second on your machine can take six seconds to render in Numbers on a Mac and fifteen seconds in Google Sheets if the formulas are complicated. Hosting the .xlsx as a link gets around all of that. The recipient sees the values, not the file. They never wait for a calculation engine to load. If they want their own copy to edit, the link offers a download too.",
      "If the spreadsheet is essentially tabular data without formulas, export it to CSV first so you can {{viewer-csv}} faster and burn less bandwidth. The trade-off is that CSV strips formatting, formulas, and multiple sheets. Pick XLSX hosting when the spreadsheet's structure matters; pick CSV when only the data matters.",
      "Hosting matters in a few specific cases. When you're sending a model to a client and don't want them to accidentally edit it. When you're sharing data with a journalist who's on a phone. When you need a permanent URL that doesn't disappear from a Slack DM after the workspace retention window. Each of these is a NudgeHost-shaped problem, and the same {{host-hub}} flow that handles XLSX will handle the PDFs and DOCXes that travel alongside it.",
      "Ten active links on {{pricing}}, free with no signup. Excel files that exceed 25MB usually have embedded images or pivot tables built on millions of rows; for those cases the Pro plan's higher ceiling is the path. If you want the spreadsheet to expire after a deal closes, link expiry is a one-click setting in the dashboard.",
    ],
    faqs: [
      {
        q: "Will formulas recalculate when the recipient views the file?",
        a: "No. The viewer shows the last-computed values stored in the .xlsx. For a live recalculating spreadsheet, host the file and tell the recipient to download a copy to edit locally.",
      },
      {
        q: "Can the recipient download the spreadsheet?",
        a: "Yes, unless you turn downloads off in the link settings. By default the link allows both viewing and downloading.",
      },
      {
        q: "How big a spreadsheet can I upload?",
        a: "25MB on the free plan. That covers spreadsheets up to roughly 200k rows. Higher on paid plans.",
      },
      {
        q: "Do all sheets in the workbook render?",
        a: "Yes. The tab bar at the bottom lets the recipient switch between sheets just like they would in Excel.",
      },
    ],
    relatedToolSlugs: ["viewer-csv", "host-pdf", "host-html", "viewer-docx"],
    filePillExamples: ["XLSX", "XLS", "Multi-sheet", "Up to 25MB free"],
  },

  txt: {
    slug: "txt",
    name: "TXT",
    title: "Host a TXT file online: share a plain text file as a link",
    description:
      "Drop a .txt and get a shareable link. The text renders as readable monospaced UTF-8 in any browser; Windows CRLF and Unix LF both display correctly.",
    h1: "Host a plain text file as a link.",
    lead: "Drop a .txt file and get a URL. The text renders in the browser in a readable monospaced layout. Nothing to install.",
    keyPoints: [
      "Upload a .txt file, get a public link, share it. The text displays in any browser without download.",
      "Unicode characters render correctly; the viewer treats input as UTF-8 by default and detects other encodings.",
      "Both Windows CRLF and Unix LF line endings display as expected line breaks.",
      "Free with no signup; 25MB per file is enough for a novel-length manuscript.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "A .txt file is one of the most portable formats in computing, and one of the most awkward to share. Pasting a long block of text into Slack ruins the formatting and creates a wall of noise. Emailing it as an attachment makes the recipient download a file they could have just read. A NudgeHost link is the middle path. The .txt renders in the browser as readable text, copy-able, scrollable, with no install step on the recipient's end.",
      "If the file is really structured data dressed as plain text, formats like JSON and CSV have purpose-built viewers. Drop a JSON file in and you can {{viewer-json}} as a collapsible tree, or run it through {{dev-json-formatter}} first to tidy it. The equivalent for CSV is to {{viewer-csv}} as a clean table. If your prose has formatting (headings, lists, code blocks), you can {{host-md}} and the page renders as styled HTML. Plain prose, log files, transcripts, and exported chat history are where .txt hosting is the right answer.",
      "There are a few rough edges worth knowing about. A .txt exported from Notes or TextEdit on macOS may use Apple's smart quotes and em-dashes, which render fine but copy oddly into code editors. Windows .txt files use CRLF line endings and may display extra blank lines in some browsers; NudgeHost normalises this automatically. Files using ancient encodings like Windows-1252 still get detected, but if you control the source, UTF-8 is always the cleaner choice.",
      "The free plan covers ten active text files at 25MB each, enough for a full novel manuscript with margin to spare. Server logs and chat exports are the most common things that push past it; for those, {{pricing}}, or trim the file first. The same dashboard covers {{host-hub}} alongside the text.",
    ],
    faqs: [
      {
        q: "Does the recipient need a text editor?",
        a: "No. The .txt renders in any browser as readable text.",
      },
      {
        q: "Will the line endings look right?",
        a: "Yes. Windows CRLF and Unix LF both display as expected. The viewer normalises them on render.",
      },
      {
        q: "Can I share a multi-megabyte log file?",
        a: "Yes, up to 25MB on the free plan. Above that, either filter the log to the relevant lines or upgrade. The browser viewer streams long files rather than loading them all at once.",
      },
      {
        q: "Will my text wrap to the browser width?",
        a: "Yes. The viewer wraps lines softly so the text fits without horizontal scrolling. The underlying file is unchanged.",
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
      "Drop a Markdown file and get a shareable link. NudgeHost renders the .md as formatted HTML in the browser. Free, no signup.",
    h1: "Host a Markdown file as a link.",
    lead: "Drop a .md file and we'll render it as clean HTML at your own URL. Headings, lists, code blocks, and tables all come out the way you wrote them.",
    keyPoints: [
      "Upload a .md file, get a public link, share it. The Markdown renders to HTML automatically in the browser.",
      "GitHub-flavored Markdown is the default flavor, so code fences, tables, and task lists all work.",
      "Update the .md file in your dashboard and the rendered page updates instantly at the same URL.",
      "Free with no signup; 25MB per file handles anything short of a book-length manuscript.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Markdown is the writing format of every developer-adjacent tool. README files, documentation, blog drafts, design briefs, AI conversation exports. Most of them never need to be a full website, but they do need to be shareable. Pasting Markdown into Slack or email leaves you sending raw asterisks and pound signs to people who don't want to parse them. Hosting the .md file gives them a clean rendered HTML page at a URL, with the formatting intact.",
      "NudgeHost renders GitHub-flavored Markdown by default. Code fences with language hints get syntax highlighting, and when a fenced block holds messy JSON you can {{dev-json-formatter}} before pasting it in. Tables render as tables, not as pipe-separated text. Task lists with `- [ ]` and `- [x]` show as checkboxes. Footnotes work. Embedded HTML in the Markdown is allowed but sanitised, so a `<script>` tag won't execute and a `<style>` tag won't bleed into the page chrome.",
      "If you want full control over the rendered output rather than relying on the default Markdown styles, convert your .md to HTML locally first and {{host-html}}. That's the right path if you've built a custom layout in something like Pandoc or want to ship a specific theme. The hosted .md route is the right path when the default styling is fine and you want to keep editing the source file in your usual editor. For prose without any Markdown syntax at all, you can {{host-txt}} and skip the rendering step entirely.",
      "Markdown pairs naturally with other formats during a project. You can {{host-pdf}} for the polished final draft you send to a client, then host the working .md for everyone who wants to read or comment on the latest version. The same {{host-hub}} flow handles every file in the bundle, all under {{pricing}}.",
    ],
    faqs: [
      {
        q: "Which Markdown flavor does NudgeHost render?",
        a: "GitHub-flavored Markdown by default: code fences, tables, task lists, strikethrough, autolinks, footnotes. CommonMark is fully supported as a subset.",
      },
      {
        q: "Can I embed images in my Markdown?",
        a: "Yes. Linked images load from their source. If the image lives in your repo, host the image alongside the .md and reference it with a relative path; the link still resolves on NudgeHost.",
      },
      {
        q: "Does the recipient see the rendered page or the raw .md?",
        a: "The rendered HTML page by default. There's an option in the link settings to serve the raw .md instead, useful if you're sharing a file other tools will fetch.",
      },
      {
        q: "Can I host a multi-file Markdown site (like a docs folder)?",
        a: "Yes, but bundle it as a ZIP and host that instead, since the index will reference relative paths.",
      },

    ],
    relatedToolSlugs: ["host-html", "host-pdf", "host-txt", "host-zip"],
    filePillExamples: ["MD", "Markdown", "README", "Blog draft", "Up to 25MB free"],
  },

  zip: {
    slug: "zip",
    name: "ZIP",
    title: "Host a ZIP file online: share an archive as a link",
    description:
      "Drop a ZIP archive and get a shareable link in seconds. NudgeHost can unpack and serve the contents as a site, or hand back the archive intact. Free.",
    h1: "Host a ZIP file as a link.",
    lead: "Drop your .zip and get a URL. NudgeHost can either keep it as a downloadable archive or unpack it and serve the contents as a small site.",
    keyPoints: [
      "Upload a .zip, get a public link in seconds, choose whether to serve the archive or its contents as a site.",
      "Multi-file HTML sites work. An index.html in the archive becomes the entry point at your URL.",
      "macOS-style __MACOSX folders and .DS_Store files are filtered out automatically during unpack.",
      "Free with no signup; 25MB per file covers most static sites and project bundles.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "A ZIP file is the universal way to send something that's more than one file, and it is also {{glossary-file-compression}} in action, packing everything smaller for the trip. A small static site, the assets for a design project, a bundle of PDFs for a client, an export from a tool that won't give you a single download. The annoying part of sending one is that the recipient has to download it, unzip it, and find the file they actually wanted. NudgeHost cuts that down to one click. Drop the .zip, get a URL, the recipient browses the contents in their browser or downloads the archive intact, your choice.",
      "If the archive contains an `index.html` at the root, NudgeHost serves the unpacked contents as a small static site. It's the way to {{host-html}} when the project is more than one file, without setting up Netlify or Vercel. CSS, images, fonts, JavaScript files referenced by relative path all load normally. The same pipeline handles every {{host-claude-artifact}} or AI-builder export that ships as a folder of files rather than a single HTML. For the mechanics of detection and asset paths, see how to {{features-zip-upload}}.",
      "One small detail worth knowing about. ZIPs made on macOS by right-clicking 'Compress' tend to include a __MACOSX metadata folder and stray .DS_Store files at every directory level. NudgeHost strips these automatically on unpack, so your hosted site doesn't end up serving Apple's filesystem cruft as part of the URL structure. Encrypted ZIPs aren't supported on unpack mode; if the file is sensitive, password-protect the NudgeHost link instead.",
      "Ten active links at 25MB per archive, free; {{pricing}} adds the higher ceilings. Project bundles that exceed 25MB are usually packing source code that should be in Git instead, or media that would be lighter as a {{converter-png-to-webp}} pass before zipping. Hosting plans, larger uploads, and custom domains are all on Pro.",
    ],
    faqs: [
      {
        q: "Does NudgeHost unpack the ZIP automatically?",
        a: "Yes, when you choose 'serve as site'. If the archive contains an index.html, that becomes the entry point. Otherwise you can keep the ZIP downloadable as a single file.",
      },
      {
        q: "Can the recipient browse files inside the ZIP without downloading?",
        a: "Yes, in serve-as-site mode. Every file in the archive is reachable at its relative path under the link.",
      },
      {
        q: "What about encrypted ZIPs?",
        a: "Encrypted archives are hosted as opaque downloads only. The recipient downloads the .zip and unpacks it locally with the password. Use NudgeHost's own link password if you want gating instead.",
      },
      {
        q: "Will Mac-specific files leak into my hosted site?",
        a: "No. __MACOSX directories and .DS_Store files are filtered out during unpack.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-claude-artifact", "host-pdf", "host-react-app"],
    filePillExamples: ["ZIP", "Multi-file site", "Project bundle", "Up to 25MB free"],
  },

  "react-app": {
    slug: "react-app",
    name: "React app",
    title: "Host a React app: deploy a Vite or CRA build as a link",
    description:
      "Drop your React app's build folder as a ZIP and get a live URL in seconds. Works for Vite, Create React App, and any framework that emits a static build.",
    h1: "Host a React app as a live URL.",
    lead: "Zip up your `dist` or `build` folder, drop it here, and your React app goes live at a clean URL. No deploy config, no environment setup.",
    keyPoints: [
      "Zip the output folder from `vite build` or `npm run build` and upload; the app goes live at a public URL.",
      "Client-side routing works via a built-in SPA fallback that rewrites unknown paths to index.html.",
      "Static assets in the bundle (images, fonts, CSS) load from their hashed filenames as the build emits them.",
      "Free with no signup; 25MB compressed handles most prototype builds and small production apps.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "React apps built with Vite or Create React App produce a static `dist` or `build` folder once the build step finishes. That folder is the whole app. An index.html, a bundle of JavaScript, a stylesheet, the assets. Any static host can serve it. NudgeHost serves it from a URL after you zip the folder and upload the ZIP. That's the whole deploy step.",
      "Client-side routing is the one detail that catches people out. A React app using React Router or TanStack Router handles its own URLs in JavaScript, which means a direct request to `/about` would normally 404 on a static host because there's no `/about/index.html`. NudgeHost handles this with an SPA fallback. Any path that doesn't match a file in the bundle gets rewritten to `/index.html`, and the router takes it from there. If you'd rather opt out, the fallback is a per-link setting. When the app calls an external API, that request answers to {{glossary-cors}}, the browser rule the API itself has to allow.",
      "If your build is more than 25MB compressed, the usual culprit is unminified source maps or unused public-folder images shipped with the bundle. Strip source maps from the production build and audit the public folder before zipping; oversized hero images are a frequent offender, and you can {{converter-png-to-webp}} to shave them down first. For multi-page projects without a framework, you can {{host-zip}} and the bundle serves as a small static site, the same way you'd {{host-claude-artifact}} or {{host-v0-export}}. If you're working in Vue rather than React, you can {{host-vue-app}} from the sibling page that covers Vite and Nuxt static builds.",
      "Ten active builds on {{pricing}}, no signup needed. Build sizes for typical prototypes are well under the 25MB ceiling; production apps that ship hundreds of vendored libraries are where the Pro plan's higher limit pays off. Custom domains and password protection live on Pro too, which matter when the URL is going to a client rather than a friend.",
    ],
    faqs: [
      {
        q: "Which folder do I zip, `src` or `dist`?",
        a: "The build output folder, `dist` for Vite and `build` for Create React App. The source folder isn't directly servable.",
      },
      {
        q: "Will client-side routes like /about work?",
        a: "Yes. The SPA fallback rewrites unmatched paths to index.html so your router can pick them up. Switch it off in link settings if you'd rather get a real 404.",
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
    lead: "Zip up your `dist` folder, drop it here, and your Vue app goes live at a clean URL. No CLI, no deploy hooks, no config file.",
    keyPoints: [
      "Zip the `dist` folder from `vite build` (or `nuxt generate` for Nuxt static) and upload; the app goes live at a public URL.",
      "Vue Router in history mode works via the built-in SPA fallback that rewrites unknown paths to index.html.",
      "Pinia, composables, and any client-side state work normally since the runtime is just static files.",
      "Free with no signup; 25MB compressed covers most Vite prototypes and small Nuxt static builds.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Vue 3 with Vite or Nuxt 3 in static mode produces a `dist` folder that's already the complete app. Drop it in a ZIP, hand the ZIP to NudgeHost, and the app is live at a URL within seconds. There's nothing for you to configure, no deploy command to learn, no Git integration to set up first. The build artifact is the deploy.",
      "Vue Router's history mode is the one thing to be careful about. A direct visit to `/products/42` would 404 on a plain static host because no such file exists in the bundle. NudgeHost's SPA fallback rewrites those requests to `/index.html` so the router handles them, exactly the way it works when you {{host-react-app}}. Hash mode works without the fallback, since the path is always the index.",
      "If your project uses Nuxt with full SSR or any server-side feature, the static `nuxt generate` path is what works on NudgeHost. Server routes, API handlers, and `useFetch` against same-origin endpoints aren't available without a Node server backing them. For a fully-rendered Nuxt setup you'd want a host that runs Node; for a prototype, demo, or marketing page, the static build covers it. If your prototype is small enough to live in a single file, you can {{host-html}} and skip the build step entirely.",
      "Ten active links at 25MB each, free; {{pricing}} adds more headroom. Most Vue prototype bundles fit easily. Production builds that vendor a UI library, three icon packs, and a chart library will sometimes push the limit; tree-shaking the unused parts is usually the cheaper fix, and running any heavy bundle images through the step to {{converter-png-to-webp}} helps too. The same {{host-hub}} flow handles plain static sites, ZIPs, and AI builder exports if you're shipping a mixed bag.",
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
      "Drop a JSON file and get a shareable link. The recipient browses it as a collapsible tree; the viewer lazy-loads so multi-MB files stay responsive.",
    h1: "Host a JSON file as a link.",
    lead: "Drop your .json and get a clean URL. The recipient explores it as a collapsible tree rather than a wall of braces.",
    keyPoints: [
      "Upload a .json file and get a public link in seconds, no signup.",
      "Recipients see the JSON rendered as a collapsible tree, with arrays and objects expandable inline.",
      "Invalid JSON is flagged on upload with a pointer to the line where parsing breaks.",
      "Free with no signup; 25MB per file is enough for a long API response or a sizeable config dump.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "JSON is the data format every developer hands to every other developer. API responses, config exports, structured logs, anything that wants to be machine-readable and human-skimmable. The annoying part of sharing it is that pasting 800 lines of JSON into Slack turns the channel into static, and emailing it as an attachment makes the recipient open a text editor. A NudgeHost link gives them a clean URL where the JSON renders as a collapsible tree.",
      "The hosted file pairs naturally with the rest of NudgeHost's JSON tooling. The hosted page uses the same renderer as {{viewer-json}}, so the recipient gets the same explore-by-clicking experience. If the original file is messy (minified, inconsistently indented, or assembled from multiple sources), {{dev-json-formatter}} first; the tidied version is easier to read in either view.",
      "Big files behave differently from small ones. The viewer lazy-loads nested branches, so a 10MB JSON file with deeply nested arrays still opens quickly because the tree only renders the parts the recipient expands. Files past the 25MB free-plan ceiling are usually log dumps that would compress to a fraction of the size; gzip them and {{host-zip}} instead. For tabular JSON that's really a CSV in disguise, you can {{viewer-csv}} for the cleaner read.",
      "Ten active files free with no signup; {{pricing}} for higher limits. The hosted link includes a Raw JSON button so consumers who want the original file rather than the tree view get it in one click. If the JSON is something you want to keep editable, swapping the source file in your dashboard updates the link without changing the URL, which is convenient for sharing a dev API mock that keeps evolving.",
    ],
    faqs: [
      {
        q: "Will the JSON be readable to humans, or just to machines?",
        a: "Both. The page renders the JSON as a collapsible tree for human reading, with a Raw JSON button for tools that want to fetch the original file.",
      },
      {
        q: "What if my JSON is invalid?",
        a: "The upload step reports the parse error with the line number where it breaks. Fix it locally and re-upload, or paste it into the JSON formatter first.",
      },
      {
        q: "How big a JSON file can I host?",
        a: "25MB on the free plan. Above that, gzip and host as a ZIP. The viewer lazy-loads nested branches so big files stay responsive in the browser.",
      },
      {
        q: "Can I share a private JSON file?",
        a: "Yes, password-protect the link on the Pro plan. The viewer respects the password just like every other format.",
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
      "Drop a .svg and get a shareable link. The vector renders crisply at any size; inline scripts are stripped for security, CSS and SMIL animations still work.",
    h1: "Host an SVG file as a link.",
    lead: "Drop your .svg and get a URL. The vector renders crisply at every size, on every screen, with no rasterization step.",
    keyPoints: [
      "Upload a .svg file, get a public link in seconds, share it. The vector renders in any modern browser.",
      "Animations inside the SVG (CSS or SMIL) run normally, since SVG is just markup.",
      "Inline `<script>` tags are stripped on upload for security; static and animated SVGs work, scripted SVGs don't.",
      "Free with no signup; 25MB is enormous for an SVG (most logo files are under 50KB).",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "SVG is the vector format that won the web. Logos, icons, diagrams, illustrations. Anything that needs to look sharp at any zoom level ends up as SVG. Sharing one as a link rather than an attachment matters because email and Slack often render SVG attachments as a placeholder icon, where a URL renders the actual image inline in a link preview.",
      "Hosting an SVG on NudgeHost is the same as hosting any other file. Drop it, get a URL. The difference is what the URL points to. Instead of a download, the SVG renders directly in the browser at its native vector resolution. Designers handing off icons to engineers, brand teams sending a logo to a partner, illustrators sharing a working version of an artwork all want this.",
      "There's one security detail worth flagging. SVG is XML, which means it can carry inline JavaScript via `<script>` tags or event handlers. NudgeHost strips these on upload, since hosting a file that executes code on the recipient's machine would be a poor default. Static and animated SVGs (using CSS keyframes or SMIL `<animate>` elements) work exactly as designed; scripted SVGs do not. If you genuinely need scripted SVG behaviour, wrap the SVG in HTML and {{host-html}} instead.",
      "Free for ten active files; {{pricing}} for higher ceilings. SVG file sizes are usually small enough that the 25MB free-plan limit never matters; the exceptions tend to be SVGs exported from Illustrator with every artboard preserved, or SVG sprites containing hundreds of icons. For raster image work, you can {{converter-png-to-webp}} as the matching step, and the same uploader lets you {{host-image}} for the JPG, PNG, and WebP files that travel alongside vectors in a real project.",
    ],
    faqs: [
      {
        q: "Will animated SVGs animate when hosted?",
        a: "Yes, CSS animations and SMIL animations run normally. Scripted animations using JavaScript don't, since `<script>` is stripped on upload.",
      },
      {
        q: "Why are scripts stripped from my SVG?",
        a: "Hosting executable SVG code on someone else's domain is a security risk. If you need scripted behaviour, embed the SVG inside an HTML page and host that.",
      },
      {
        q: "Can I link directly to the SVG from a CSS background-image?",
        a: "Yes, the link serves the raw SVG with the correct content-type header, so it can be referenced from external CSS and HTML.",
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
      "NudgeHost is the missing step. Copy the HTML block out of ChatGPT (the Copy button on the code block does it cleanly), paste it into NudgeHost, and you get a public URL within seconds. Anyone who clicks the link sees the page. They don't need a ChatGPT account, they don't see your conversation, they just see the working page ChatGPT built. The same paste-and-share flow works when you {{host-claude-artifact}}, and equally well when you {{host-html}} from any other AI builder.",
      "If ChatGPT gave you something split across multiple files (`index.html`, `styles.css`, `script.js`), the easier path is to ask it to inline everything into one HTML file. ChatGPT does this reliably if you ask. If you'd rather keep the structure, zip the files together and {{host-zip}}; NudgeHost will serve them as a small site. Either route ends with the same shareable URL.",
      "Free with no signup, and {{pricing}} sets the path up to higher tiers. The 25MB free plan ceiling is so far above the size of any ChatGPT HTML response that it's effectively unlimited for this use case. If you're iterating with ChatGPT on the page, updating the source in your dashboard refreshes the live link without changing the URL, which means you can share the link once and keep improving the page behind it. If ChatGPT built you a pitch page or a microsite, you can {{use-case-deck}} so anyone you are pitching opens it in one click.",
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
        a: "Either ask ChatGPT to inline them into one HTML file (it will), or zip the files and host the ZIP.",
      },
    ],
    relatedToolSlugs: ["host-claude-artifact", "host-html", "host-lovable-export", "host-zip"],
    filePillExamples: ["Paste HTML", "From ChatGPT", "Up to 25MB free", "Live in seconds"],
  },

  "lovable-export": {
    slug: "lovable-export",
    name: "Lovable export",
    title: "Host a Lovable export: deploy a Lovable.dev app as a link",
    description:
      "Export from Lovable, drop the ZIP into NudgeHost, get a public URL. The simplest path to share what you built. Free.",
    h1: "Host a Lovable export as a live URL.",
    lead: "Export your Lovable app, drop the ZIP here, get a clean public URL. Skip the Lovable deploy step entirely.",
    keyPoints: [
      "Export your Lovable.dev project as a ZIP and upload it to get a public URL in seconds.",
      "Multi-file projects are unpacked automatically, with the React Router fallback in place for client-side routes.",
      "No Lovable account needed for the people you share the link with.",
      "Free plan handles exports up to 25MB compressed, which covers most prototype builds.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Lovable.dev is one of the cleanest AI-builder experiences right now. You describe what you want, Lovable generates the React app, you iterate in the chat. The catch is the share step. Lovable has its own deploy path, but if you want to put the result on your own domain, or skip the Lovable URL entirely, or just hand someone a link without onboarding them onto another tool, exporting the app and hosting it elsewhere is the cleaner route. For the full walkthrough, read {{blog-how-to-share-a-lovable-site}}.",
      "The export from Lovable is a ZIP of the built React app. Drop the ZIP here and NudgeHost unpacks it, serves the index.html, and rewrites unknown paths to that index so React Router works on direct URL visits. It's the same pipeline you'd use to {{host-react-app}} directly; the only difference is that the source happened to be an AI builder rather than a hand-built Vite project. The result is the same. A clean URL anyone can open.",
      "If Lovable's export gives you the source rather than the build, run `npm install && npm run build` locally first and zip the `dist` folder. Lovable's own export panel has a checkbox to include the built output, which avoids the local build step entirely. The same approach covers other AI builders: {{host-v0-export}} for v0.dev outputs and {{host-bolt-export}} for Bolt.new.",
      "Free for ten active links; {{pricing}} adds the higher ceilings. Most Lovable exports compress to well under the 25MB free-plan limit. Custom domains, password protection, and the removal of NudgeHost branding live on Pro, all of which matter when you're sharing the link with a client rather than testing internally. Builders who are job-hunting often show a working Lovable app, so you can {{use-case-recruiter}} with the live URL in your application. The same dashboard covers {{host-hub}} alongside the app, so static HTML, ZIPs, and any other artifact ship from the same place.",
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
      "Paste v0.dev's generated code or upload its export ZIP and get a public link in seconds.",
      "Self-contained components ship as a single HTML file via the paste-HTML route.",
      "Full React app exports work as a ZIP, with the SPA fallback rewriting unknown paths to index.html.",
      "Free plan handles exports up to 25MB, comfortably above any v0 output.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "v0.dev is Vercel's design-and-code generator. You describe a UI, v0 generates React + Tailwind code, you iterate. The default path forward is to deploy it on Vercel, which is reasonable if you're already in Vercel-land but heavier than necessary if you just want to share what v0 made. For the full walkthrough, read {{blog-how-to-host-a-v0-export}}.",
      "NudgeHost is the lightweight alternative. For a single self-contained component, copy v0's HTML output into the paste box and you get a URL in seconds. The same flow works when you {{host-claude-artifact}} or {{host-chatgpt-html}}, since the underlying problem is identical. AI builder gave you HTML, you want it on the open web. For a multi-file v0 app, the ZIP export uses the same pipeline you'd hit to {{host-react-app}}.",
      "There's one practical detail. v0's exports often reference Tailwind via CDN and shadcn/ui components inlined into the code. Both work out of the box when hosted. Tailwind loads from its CDN, and the inlined components ship with the HTML. If v0 split your output across many files (`page.tsx`, `components/*.tsx`), the cleaner path is to run a local build first and zip the result; the alternative is to paste v0's preview HTML, which is enough for static UI demos but loses TypeScript-level component reuse.",
      "All of this works on {{pricing}}. Pro adds custom domains, which you connect with {{glossary-dns}}, and password protection, both worth it when the URL goes to a client. When a v0 build is the centrepiece of a pitch, you can {{use-case-deck}} and hand it over as the working demo. The dashboard handles {{host-hub}} alongside the v0 demo. Project bundles work directly too. Just {{host-zip}} and the archive sits at its own link.",
    ],
    faqs: [
      {
        q: "Should I paste the code or upload a ZIP?",
        a: "Paste the code for a single-file HTML demo. Upload a ZIP for a multi-file React app where you've built the project locally.",
      },
      {
        q: "Will Tailwind classes work on the hosted page?",
        a: "Yes, if v0's output loads Tailwind from its CDN (the default). The CDN request fires from your hosted page normally.",
      },
      {
        q: "Can I host v0 components individually for an internal style guide?",
        a: "Yes. Host each component on its own link, or zip them together as a static gallery and host the bundle.",
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
    lead: "Bolt built you an app inside StackBlitz. Download the project as a ZIP, drop it here, get a public URL anyone can open.",
    keyPoints: [
      "Export from Bolt.new (Download via the StackBlitz menu) and upload the ZIP to get a public URL in seconds.",
      "Static builds run as-is; for source-only exports, run `npm install && npm run build` locally before zipping the dist folder.",
      "The recipient sees a normal URL and never sees Bolt or StackBlitz.",
      "Free plan handles exports up to 25MB compressed, well above the size of most prototypes.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Bolt.new from StackBlitz is the AI builder that runs the whole development environment in your browser. You describe what you want, Bolt builds the project inside an in-browser Node container, and you can preview the result without leaving the tab. The challenge starts when you want to share the result outside StackBlitz. The default options are 'send the StackBlitz preview link', which exposes the project structure, or 'deploy via StackBlitz', which has its own friction.",
      "Exporting and hosting on NudgeHost is the cleanest middle ground. Bolt lets you download the project as a ZIP through the StackBlitz UI; that ZIP either contains a `dist` folder ready to host, or contains source you'll need to build locally. Either path ends with a folder of static files. You can {{host-react-app}} directly, or you can {{host-zip}} and NudgeHost serves the archive as a small site. The recipient gets a clean URL on nudgehost.com (or your own domain on Pro), with no StackBlitz chrome anywhere in sight.",
      "If you're staying inside the Bolt loop and iterating, the deploy-to-NudgeHost step takes about twenty seconds. Download the new ZIP, drag-and-drop, and the link refreshes. The URL itself doesn't change between uploads, so anyone with the link gets the latest version automatically. That's particularly useful when you're showing progress to a client and want to keep iterating without re-pasting links.",
      "Free for ten active links; {{pricing}} adds the higher ceilings. Bolt outputs vary in size depending on what was generated, but most prototypes compress to a few MB. A working Bolt prototype is strong proof of skill in a job hunt, so you can {{use-case-recruiter}} with the live link. The dashboard handles {{host-hub}} alongside the Bolt app if you want to share supporting assets, and the same approach lets you {{host-lovable-export}} or {{host-v0-export}} for the other AI builders that work the same way.",
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
      "EXIF metadata (camera model, location, timestamp) is stripped automatically before publishing for privacy.",
      "Images serve with appropriate content-type headers, so the link works in image-only fields like forum posts.",
      "Free plan covers ten active images at 25MB each. Most photographs are well under 5MB.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Hosting an image as a link sounds trivial until you actually try to do it. Imgur compresses photos. Twitter and Reddit auto-crop the preview. iCloud Photo Sharing wants the recipient signed in. Google Photos albums expire when you forget about them. NudgeHost is the boring, reliable middle. Drop the file, get a URL, and the URL still works two years later.",
      "There's a small privacy detail that often gets missed. JPGs from a phone carry EXIF metadata including the camera model, the exact date and time, and (if your location services were on) the GPS coordinates of where the photo was taken. NudgeHost strips this on upload by default, so a photo you share publicly doesn't accidentally reveal that you took it inside your house at 3:14am. If you need the metadata preserved (for forensic or archival work), there's a per-upload toggle for it.",
      "For images that will live on the web, especially in pages you build yourself, file size matters. A 4MB iPhone photo can usually become a 400KB WebP without any visible quality loss; {{converter-png-to-webp}} handles the equivalent for screenshots. Photographs in HEIC (the format iPhones save in by default) won't open on non-Apple devices, so {{converter-heic-to-jpg}} before hosting and the photo opens anywhere. If the image is really a vector logo or icon, you can {{host-svg}} for the cleaner long-term result.",
      "No watermark, no signup, on {{pricing}}. The 25MB free-plan limit covers every photograph anyone produces without a medium-format camera. For a whole gallery, zip the images and {{host-zip}} for a single shareable link, or stick them inside an HTML layout and {{host-html}} instead. Custom domains and link expiry are on Pro.",
    ],
    faqs: [
      {
        q: "Does NudgeHost compress my image?",
        a: "No. The image is served at the resolution and quality you uploaded. If you want a lighter file, convert it before uploading.",
      },
      {
        q: "Will EXIF metadata be stripped?",
        a: "Yes by default. GPS, camera model, and timestamp data are removed on upload. Toggle the setting if you specifically need the EXIF preserved.",
      },
      {
        q: "What about animated GIFs?",
        a: "GIFs work, but for animations longer than a few seconds, hosting as MP4 is dramatically smaller. The MP4 hosting page covers the trade-off.",
      },
      {
        q: "Can I hotlink the image from another site?",
        a: "Yes. The link serves the image with the correct content-type header, so it works inline anywhere `<img src=\"...\">` would.",
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
      "GIFs serve with the correct content-type so the link works in image fields on forums and chat apps.",
      "For animations longer than 5 seconds, hosting as MP4 is typically 90 percent smaller with no visible difference.",
      "Free plan handles GIFs up to 25MB; most short clips fit comfortably.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "GIFs are everywhere despite being technically antique. The format was designed in 1987 for static images, then extended for short animations, then absorbed by the web culture of reaction loops and tutorials. Sharing one as a NudgeHost link is the cleanest way to put a GIF on a forum post, a documentation page, or a bug report where the host doesn't accept GIF uploads natively.",
      "There's a size trap worth knowing about. A two-second animated GIF can easily be 8MB. The same animation as an MP4 with H.264 encoding is usually under 200KB and looks identical. If your GIF is more than five seconds long, converting to MP4 first is almost always the right call. The page loads faster, the bandwidth is lighter, and the quality looks the same. You can {{host-mp4}} from the same dashboard once it's encoded. GIF hosting is the right pick when you specifically need GIF (forum software that won't accept MP4, Slack reactions, certain Reddit subs).",
      "Animated GIFs also have a subtle accessibility issue. They auto-play with no pause control. For documentation or onboarding flows where someone might want to slow down or stop a demo, an MP4 (which gets browser-native play/pause controls) is friendlier. For a quick reaction or a five-frame loop, GIF is fine; nobody needs to pause a celebration emoji.",
      "Free for ten active links; {{pricing}} adds more headroom. The 25MB free-plan limit holds most GIFs comfortably. For a documentation site with embedded demos, host the GIFs from your dashboard and reference them from the page where you {{host-html}}; that keeps everything under one set of URLs. The same uploader lets you {{host-image}} for static screenshots, and the matching tooling for raster conversion lives in {{converters-hub}}.",
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
      "Drop an MP4 video and get a shareable link in seconds. Plays in the browser with native controls, scrub bar, and HTTP range support. Free.",
    h1: "Host an MP4 video as a link.",
    lead: "Drop your MP4 and get a clean URL. The video plays inline with native browser controls. No YouTube account, no upload queue.",
    keyPoints: [
      "Upload an .mp4 file, get a public link in seconds, share it. The video plays inline in any modern browser.",
      "HTTP range requests are supported, so seeking forward in the video doesn't redownload it from the start.",
      "Native browser controls (play, pause, scrub, volume, fullscreen) appear automatically.",
      "Free plan handles video files up to 25MB. Short screen recordings and demos fit comfortably.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Putting a video online used to mean YouTube, with all the friction that implied: ads, autoplay of unrelated content, an upload queue, a public profile, copyright algorithms. For a short demo video, a screen recording, or a clip from a meeting, none of that is what you want. You want a URL. You drop the file, you get the URL, you send it.",
      "NudgeHost serves MP4s with HTTP range request support, which is the protocol detail that makes scrubbing work properly. Without it, jumping to the middle of a video would re-download the whole file. With it, the browser fetches only the bytes it needs for the current play position, exactly the way YouTube does it under the hood. Native browser controls appear automatically: play, pause, scrub, volume, fullscreen. No video player library needed.",
      "Compression matters more for video than for any other format, because every play spends {{glossary-bandwidth}} on the full file again. A 30-second screen recording from QuickTime can easily be 80MB at H.264 with default settings; the same recording exported with HandBrake's Web preset is usually under 5MB and looks identical at typical viewing sizes. If your file is over 25MB and you're on the free plan, re-encoding before upload is almost always the right move. For short looped animations where you don't need scrubbable controls, you can {{host-gif}} instead and the file stays lighter.",
      "Hosted free with no watermark; {{pricing}} adds the Pro tier. Larger videos and longer clips fit on Pro. A product demo video usually travels with a sales conversation, so you can {{use-case-deck}} and drop the video link into the shared page. For a marketing demo embedded in a landing page, host the MP4 here and reference it from the page where you {{host-html}} with a normal `<video>` tag. The dashboard handles {{host-hub}} alongside the video: a {{host-pdf}} for the script, somewhere to {{host-image}} for stills, and a place to {{host-mp3}} when you're shipping the audio track separately.",
    ],
    faqs: [
      {
        q: "Can the recipient scrub through the video?",
        a: "Yes. HTTP range requests are supported, so the browser only fetches the part of the video you've jumped to. Seeking works smoothly even on long videos.",
      },
      {
        q: "Will my video autoplay?",
        a: "No, unless the HTML page embedding it requests autoplay. The hosted page shows the first frame with a play button overlaid.",
      },
      {
        q: "What codec should the MP4 use?",
        a: "H.264 video with AAC audio is the safest combination. Every modern browser supports it. H.265 (HEVC) plays on Safari but not all Chromium browsers; stick with H.264 unless you have a specific reason.",
      },
      {
        q: "Can I embed the video in another page?",
        a: "Yes. The link works as the src of a `<video>` tag, with range requests handled correctly so scrubbing works in your custom player too.",
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
      "Drop an MP3 and get a shareable link. Plays inline with native HTML5 audio controls; the free 25MB ceiling fits about 25 minutes at 128kbps.",
    h1: "Host an MP3 audio file as a link.",
    lead: "Drop your MP3 and get a clean URL. The audio plays in the browser with native controls, no embed code, no podcast platform.",
    keyPoints: [
      "Upload an .mp3 file and get a public link in seconds, no signup.",
      "Plays inline in any modern browser with native play/pause/scrub controls.",
      "Works for podcast pilots, voiceovers, meeting recordings, and music demos without needing a platform.",
      "Free plan handles audio files up to 25MB, which is roughly 25 minutes at 128kbps.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Hosting an audio file as a link is the unglamorous middle path between 'send the file as an email attachment' and 'set up a SoundCloud account.' Voiceover demos, podcast pilots, meeting recordings, music sketches, language practice clips, any of it can sit at a NudgeHost URL with a single click of upload. The recipient gets a normal page with a play button. They don't need an account, an app, or even to download the file.",
      "There's a sizing detail that comes up. MP3 at 128kbps is around 1MB per minute; at 192kbps it's about 1.4MB per minute. The 25MB free-plan ceiling covers roughly 25 minutes at 128kbps, or 15 minutes at 192kbps. For a single demo or a short voiceover that's plenty. For a full podcast episode, either downsample before upload (most audio editors export at 96kbps for spoken-word content without any noticeable quality drop) or use Pro's higher ceiling.",
      "MP3 is also the format with the broadest decoder support of any audio format. Every browser, every operating system, every car stereo from the last twenty years. If you're sending an audio clip to someone whose device is unknown, MP3 is the safe bet. For higher-quality music sharing where every kilobyte matters less, FLAC is a better master format, though NudgeHost serves both interchangeably.",
      "Free with no signup; {{pricing}} adds higher ceilings. The hosted page includes a download button so the recipient can grab the file if they want to keep a copy. Audio for a marketing video pairs naturally with the video itself, which you can {{host-mp4}} from the same dashboard. A voiceover or a recorded narration that backs a pitch also fits the flow to {{use-case-deck}}, so the sound and the slides live together. NudgeHost will {{host-hub}} alongside the audio, covering every other format you'd ship in the same project.",
    ],
    faqs: [
      {
        q: "Does the recipient need a media player installed?",
        a: "No. The MP3 plays inline in their browser using native HTML5 audio. Every modern browser supports MP3 playback.",
      },
      {
        q: "Can I host other audio formats?",
        a: "Yes. WAV, FLAC, OGG, AAC, and M4A all work. MP3 is the most universally compatible format for sharing.",
      },
      {
        q: "Will the audio stream or fully download?",
        a: "It streams. HTTP range requests let the browser fetch parts of the file on demand, so the audio starts playing before the whole file has loaded.",
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
