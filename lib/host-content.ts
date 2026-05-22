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
// *around* the link so the surrounding words supply topical context — that is
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
    title: "PDF Link Generator — Share a PDF as a link, free",
    description:
      "Upload a PDF, get a clean shareable link in seconds. Free, no signup needed. Optional password protection and view analytics. The friendly PDF link generator.",
    h1: "Share a PDF as a link.",
    lead: "Drop a PDF here and get a clean, shareable link in seconds. No sign-up required, no expiry, no upload limits on the file you're holding right now.",
    keyPoints: [
      "Drop a PDF, get a clean nudgehost.com link in seconds — no signup required.",
      "Free plan covers up to 10 active PDFs at 25MB each, with no link expiry by default.",
      "Recipients open the PDF directly in their browser — nothing to install or download.",
      "Built-in open analytics show when each PDF link is viewed and roughly from where.",
    ],
    body: [
      "Sending a PDF used to mean a cluttered email attachment, a Dropbox share link with a login prompt, or asking the recipient to download something they didn't really want to download. NudgeHost is the friendlier middle ground: you drop the PDF, we give you back a URL, you send the URL. The recipient clicks it and reads the PDF straight away — if you'd rather they see it without downloading anything, every shared file also opens in {{viewer-pdf}}, so there's nothing for them to install.",
      "If you need a flat image of a page instead of a clickable document — to drop into a slide deck, or to post somewhere that won't accept a PDF — you can {{converter-pdf-to-jpg}} and host the result the same way. That's one of many format jobs in NudgeHost's {{converters-hub}}. If your PDF is really a resume, there's a dedicated flow to {{host-resume}} that adds open-tracking so you know when a recruiter has looked at it.",
      "On {{pricing}} you get 10 active PDFs at up to 25MB each, with no expiry — your link stays live as long as you want it to. Larger files, password protection, custom domains, and branded links are all worth a paid plan once you're sharing PDFs regularly.",
      "Built-in analytics let you see when your PDF was opened and from where. That's particularly useful when you've sent a proposal or a contract and you're wondering whether it's been read yet. If the file is a big one, the guide on how to {{use-case-large-pdf}} covers the email-size-limit problem in full. The same uploader handles every other format too, so once you've sent your first PDF you can {{host-hub}} of any kind without learning anything new.",
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
    title: "Host HTML files online — Free static HTML hosting",
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
      "Sometimes you just need to put an HTML file on the internet. Maybe it's a prototype you want to show a client, a single-page landing page for a side project, or an HTML output you just generated from an AI tool and want to share with a friend. You don't need a server or a Vercel deployment for any of that. You just need a URL.",
      "NudgeHost takes any HTML file — a single page or a multi-file site — and puts it on the open web at a clean URL within seconds. If your project is more than one file, the simplest route is to zip everything together and {{host-zip}}; NudgeHost unpacks it and serves it as a site. If you're publishing something a model built for you, there's a purpose-built flow to {{host-claude-artifact}} that handles the copy-paste case directly.",
      "Want to keep your prototype private? Set a password on the link. Want it on your own domain, or without NudgeHost branding? Those come with {{pricing}}. Want to test how the page loads on a real CDN before publishing? It's already on one.",
      "HTML isn't the only thing you can put online this way — the same uploader will {{host-hub}} of any format, and a finished PDF export of your page can just as easily {{host-pdf}} for people who'd rather read than browse. If you only need to look at a file rather than publish it, NudgeHost's {{viewers-hub}} open common formats in the browser directly.",
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
    title: "Host a Claude artifact — share Claude-generated HTML as a link",
    description:
      "Publish a Claude artifact to a live URL. Copy the HTML from Claude, paste it into NudgeHost, get a shareable link instantly. Free.",
    h1: "Host a Claude artifact as a live URL.",
    lead: "Claude built you something brilliant. Now share it. Copy the HTML from your Claude conversation, paste it here, and get a live nudgehost.com link in seconds.",
    keyPoints: [
      "Copy the HTML source from your Claude artifact, paste it into NudgeHost, get a public link in seconds.",
      "No Anthropic account needed for the people you share the link with — the artifact runs directly in their browser.",
      "Free plan handles artifacts up to 25MB. Most artifacts are under 100KB, so this is rarely a constraint.",
      "Works the same way for ChatGPT HTML, v0 exports, Lovable exports, and Bolt exports.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-21",
    dateModified: "2026-05-22",
    body: [
      "Claude's artifacts feature is one of the most useful additions to chat AI in years. You can ask Claude for a dashboard, a calculator, a landing page, or a small game and get a working HTML/JS thing right there in the conversation. The catch: those artifacts live inside Claude. You can't easily send one to a friend, drop one into a Slack channel, or share one on Twitter without screenshotting it.",
      "NudgeHost fixes that gap. Open your artifact in Claude, copy the source HTML, paste it into NudgeHost, and you get a clean public URL that loads the artifact for anyone who clicks. No Anthropic account needed on their end. No screenshot. Under the hood this is the same flow you'd use to {{host-html}} of any kind — an artifact is just HTML — so anything you learn here applies to ordinary web pages too.",
      "If your artifact is split across several files, zip them together first and {{host-zip}} instead; NudgeHost unpacks the archive and serves it as a site. And if you want to hand someone a static, non-interactive version — a printable summary of a dashboard, say — you can always export it and {{host-pdf}} alongside the live one.",
      "On {{pricing}} your artifact stays live with no expiry. You can update it whenever Claude builds a v2 — same URL, new content — or set an expiry if you only want the link to live for a week. The same approach works for any single-file HTML output: ChatGPT-generated HTML, v0 exports, Lovable exports, Bolt exports. For more grounded examples of what people do with shared links — like how to {{use-case-deck}} — the {{use-cases-hub}} walks through them step by step.",
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
        a: "Yes. Replace the HTML in your NudgeHost dashboard and the link continues to work — same URL, new content.",
      },
      {
        q: "Is there a size limit?",
        a: "25MB on the free plan, which is enormous for an artifact. Most Claude artifacts are under 100KB.",
      },
      {
        q: "Does it work for ChatGPT, Gemini, Lovable, v0, Bolt outputs too?",
        a: "Yes. Any AI-generated HTML works the same way: copy the source, paste it here, share the link.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-zip", "host-pdf"],
    filePillExamples: ["Paste HTML", "ZIP", "Up to 25MB free", "Live in seconds"],
  },

  resume: {
    slug: "resume",
    name: "Resume",
    title: "Share your resume as a link — Free resume link generator",
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
      "Sending a resume as an email attachment is fine — until you realise the recruiter never told you whether they read it. A NudgeHost link to your resume tells you when it was opened, how many times, and roughly where from. Same email, same recruiter, much more useful to you. Most resumes are PDFs, and everything that's true of hosting one applies here too — this page is really the {{host-pdf}} flow with open-tracking turned on by default.",
      "Your link is clean: nudgehost.com/your-name. The recruiter opens it in their browser instantly. There's no download prompt, no Dropbox login, and no 'this file may be unsafe' warning to scare them off. If you're applying for design or front-end roles, a resume is rarely enough on its own; the natural next step is to {{host-portfolio}} and {{use-case-recruiter}} as a single link.",
      "Job-hunting? Make one resume link and put it in your LinkedIn, your email signature, and your application emails. When you update the resume, the link stays the same — just swap the file out and everyone who's already got the link sees the new version. A custom domain and the removal of NudgeHost branding both come with {{pricing}}, which is worth it if you're sending the link to dozens of employers. If you're still weighing tools, the {{compare-hub}} pages lay out how NudgeHost stacks up against the alternatives.",
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
        a: "Yes. You can create unlimited links on Pro, each tracking its own opens — useful if you want to know which company actually opened your resume.",
      },
      {
        q: "What file format should I upload?",
        a: "PDF is best — it preserves your formatting on every device. We accept DOCX too, but PDF is the standard.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-portfolio", "viewer-pdf"],
    filePillExamples: ["PDF", "DOCX", "1-2 pages", "ATS-friendly", "Up to 25MB"],
  },
};
