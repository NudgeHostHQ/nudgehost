// Blog content. Posts are the densest contextual-linking surface on the site:
// each one links into several tool, use-case, glossary, and money pages so blog
// authority flows down to the pages that convert.
//
// A post's `body` is either a plain string (legacy: split into paragraphs and
// rendered through ContextualProse) or an array of typed content blocks (the v5
// format: prose, headings, step cards, comparison tables, testimonials, CTAs,
// screenshots, related-post boxes, FAQs, and a bottom CTA). All text fields that
// carry prose support {{key}} contextual-link tokens (see lib/internal-links.ts);
// the renderer resolves them through renderTokens().

import { internalLinks } from "./internal-links";

export type BlogFaq = { question: string; answer: string };

// FAQ block items use short q/a keys; post.faqs (for JSON-LD) uses the longer
// question/answer keys. plain() strips {{tokens}} to their first anchor so the
// JSON-LD answer reads as natural prose with no link markup leaking through.
export type BlogFaqItem = { q: string; a: string };

function plain(text: string): string {
  return text.replace(/\{\{([a-z0-9-]+)(?:\|([^}]*))?\}\}/g, (_, key, anchor) => {
    if (anchor) return anchor;
    const target = internalLinks[key];
    return target ? target.anchors[0] : key;
  });
}

// --- Content blocks --------------------------------------------------------

export type ProseBlock = { type: "prose"; text: string };
export type H2Block = { type: "h2"; text: string; id: string };
export type H3Block = { type: "h3"; text: string };

export type StepItem = { title: string; desc: string };
export type StepsBlock = { type: "steps"; items: StepItem[] };

export type CompareRow = { cells: string[]; nhCol: number };
export type CompareBlock = {
  type: "compare";
  headers: string[];
  rows: CompareRow[];
};

export type TestimonialBlock = {
  type: "testimonial";
  text: string;
  attribution?: string;
};

export type CtaBlock = {
  type: "cta";
  title: string;
  text: string;
  link: string;
  label: string;
  icon?: string; // emoji shown in the coral icon box; defaults to ⚡
};

export type ScreenshotBlock = { type: "screenshot"; alt: string; caption?: string };

export type ImageBlock = { type: "image"; src: string; alt: string; caption?: string };

export type RelatedItem = {
  title: string;
  href: string;
  desc: string;
  icon: string;
};
export type RelatedBlock = { type: "related"; items: RelatedItem[] };

export type FaqBlock = { type: "faq"; items: BlogFaqItem[] };

export type BottomCtaBlock = {
  type: "bottom-cta";
  title: string;
  text: string;
  link: string;
  label: string;
};

export type ContentBlock =
  | ProseBlock
  | H2Block
  | H3Block
  | StepsBlock
  | CompareBlock
  | TestimonialBlock
  | CtaBlock
  | ScreenshotBlock
  | ImageBlock
  | RelatedBlock
  | FaqBlock
  | BottomCtaBlock;

// --- Sidebar ---------------------------------------------------------------

export type SidebarLink = { label: string; href: string };
export type TocEntry = { label: string; id: string };
export type BlogSidebar = {
  toc?: TocEntry[]; // explicit TOC labels; falls back to auto-generation from h2 blocks
  useCases?: SidebarLink[];
  relatedTools?: SidebarLink[];
};

export type BlogPost = {
  slug: string;
  title: string; // <title>
  metaDescription: string;
  h1: string;
  shortTitle?: string; // breadcrumb label; falls back to h1
  author: string;
  authorBio?: string; // one-line bio for the author box
  publishedDate: string; // ISO
  modifiedDate: string; // ISO
  readTime?: string; // e.g. "7 min read"; falls back to a word-count estimate
  showUpdatedBadge?: boolean; // force the "Updated" badge; defaults to dates differing
  heroComponent?: "claude-artifact"; // optional decorative hero illustration
  pillar: "sharing-files" | "ai-publishing" | "hosting-vs-cloud";
  tldr: string; // 3-4 sentence key-points block; supports {{key}} tokens
  body: string | ContentBlock[]; // legacy string OR v5 typed blocks
  faqs: BlogFaq[]; // canonical FAQ source for JSON-LD (plain text, no tokens)
  relatedToolSlugs: string[]; // TOOL_REGISTRY keys for the Related tools grid
  sidebar?: BlogSidebar; // per-post sidebar; falls back to sensible defaults
};

// --- Claude artifact post FAQs ---------------------------------------------
// Authored with {{key|anchor}} tokens for the rich FAQ block; plain() derives
// the token-free copy used in the FAQPage JSON-LD. Wording is matched verbatim
// to the approved v5 design mockup.
const claudeArtifactFaqs: BlogFaqItem[] = [
  {
    q: "How do I get the HTML out of a Claude artifact?",
    a: 'In the artifact view, switch to the code or source toggle. You see the raw HTML. Copy the whole block. You can also ask Claude directly: "Give me the full HTML source of this artifact."',
  },
  {
    q: "Does the recipient need a Claude account?",
    a: "No. The hosted link is a normal {{features-public-links|public URL}}. Your conversation never leaves Claude. Only the HTML you paste reaches NudgeHost.",
  },
  {
    q: "Will external libraries (React, Tailwind) still work?",
    a: "Yes. If the artifact loads libraries from an {{glossary-cdn|external library host}}, those requests fire normally from the hosted page. The artifact behaves online exactly as it did inside Claude.",
  },
  {
    q: "What if Claude gives me multiple files?",
    a: "Ask Claude to inline everything into a single HTML file (it does this reliably). Or {{features-zip-upload|zip the files and upload}} the archive. NudgeHost unpacks it and serves index.html.",
  },
  {
    q: "Can I password-protect an artifact link?",
    a: "Yes. You can {{features-password-protection|lock the link with a password}} on the {{pricing|Pro plan}}. The recipient enters a password before seeing the artifact.",
  },
  {
    q: "Can I use a custom domain for my artifact?",
    a: "Yes. You can {{features-custom-domains|use your own domain}} to serve the artifact from yourname.com instead of nudgehost.com. Available on Pro and Team plans.",
  },
  {
    q: "What other file types does NudgeHost support?",
    a: "PDF, DOCX, ZIP, images, and 20+ other formats. See all {{host-hub|NudgeHost hosting options}}.",
  },
];

export const blogContentMap: Record<string, BlogPost> = {
  "how-to-host-a-claude-artifact": {
    slug: "how-to-host-a-claude-artifact",
    title: "How to host a Claude artifact as a live, shareable link | NudgeHost Blog",
    metaDescription:
      "A step-by-step guide to publishing a Claude artifact. Copy the HTML, paste it into NudgeHost, and get a public link anyone can open with no Anthropic account.",
    h1: "How to host a Claude artifact as a live, shareable link",
    shortTitle: "How to host a Claude artifact",
    author: "Mark Boreland",
    authorBio:
      "Builder of NudgeHost. Shares files, PDFs, and AI-generated HTML for a living. Previously built CheckoutReceipt and PeptideFile.",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    readTime: "7 min read",
    showUpdatedBadge: true,
    heroComponent: "claude-artifact",
    pillar: "ai-publishing",
    tldr: "Claude builds working HTML artifacts inside a conversation, but they stay trapped there. {{host-claude-artifact|Copy the source and paste it into NudgeHost}}, and you get a public link in seconds. No Anthropic account needed for the recipient. {{features-link-updating|Update the source later}} and the link stays the same.",
    body: [
      {
        type: "h2",
        text: "Why Claude artifacts are hard to share",
        id: "why-hard-to-share",
      },
      {
        type: "prose",
        text: `Claude's artifacts feature turns a prompt into something real: a dashboard, a calculator, a landing page, a small game, all rendered live in the conversation. The problem starts when you want someone else to see it.

The artifact lives inside Claude, behind your account. There is no public URL to send. Screenshotting it loses the interactivity. Inviting someone into your Claude account is not practical. An artifact is almost always self-contained HTML, which is why it hosts so cleanly as a {{glossary-static-site|static site}}. You just need somewhere to put it.`,
      },
      {
        type: "h2",
        text: "How to publish a Claude artifact (step by step)",
        id: "step-by-step",
      },
      {
        type: "steps",
        items: [
          {
            title: "Open the artifact and switch to code view",
            desc: 'In Claude, click the artifact to expand it, then toggle to "Code" or "Source" view. You see the raw HTML, CSS, and JavaScript that powers the artifact.',
          },
          {
            title: "Copy the full HTML",
            desc: "Select all and copy. Claude's code view has a copy button in the top corner that grabs everything cleanly. The output is almost always a single self-contained file.",
          },
          {
            title: "Paste into NudgeHost",
            desc: "Go to {{host-claude-artifact|the Claude artifact uploader}} and paste the HTML directly. No need to save a file first. NudgeHost accepts {{features-paste-html|raw HTML paste}}.",
          },
          {
            title: "Share your public link",
            desc: "A short nudgehost.com link comes back in seconds. The page renders {{features-full-screen-viewer|full screen}}, and the {{features-link-previews|link preview}} unfurls with a sensible title and image when shared in Slack or iMessage.",
          },
        ],
      },
      {
        type: "image",
        src: "/blog/claude-code-view.png",
        alt: "Claude artifact code view showing raw HTML source",
        caption: "Step 1: Switch to code view in Claude to see the raw HTML.",
      },
      {
        type: "image",
        src: "/blog/nudgehost-paste-html.png",
        alt: "NudgeHost paste HTML box with code pasted in",
        caption: "Step 2: Paste the HTML into NudgeHost.",
      },
      {
        type: "image",
        src: "/blog/nudgehost-link-ready.png",
        alt: "NudgeHost success screen showing the shareable link",
        caption: "Step 3: Your link is ready to share.",
      },
      {
        type: "h2",
        text: "Updating an artifact without changing the URL",
        id: "updating",
      },
      {
        type: "prose",
        text: `Artifacts evolve. You ask Claude for a second version, it rebuilds the thing, and you want the same link to show the new output. {{features-link-updating|Swap the source in your dashboard}} and the URL does not change. Everyone who already has the link sees the update on their next visit.

This is the part screenshots and one-off uploads get wrong. Every change means a new file and a new link to redistribute. With NudgeHost, one link serves every version. {{compare-nudgehost-vs-tiiny-host|Unlike hosts that expire free links after 30 days}}, NudgeHost keeps your artifact live as long as you want.`,
      },
      {
        type: "testimonial",
        text: "One freelance designer used this workflow to share 12 Claude prototypes with clients last month. Each link stayed live across revisions, and none of the recipients needed a NudgeHost account to view the work.",
      },
      {
        type: "h2",
        text: "When to use a ZIP file instead",
        id: "zip-files",
      },
      {
        type: "prose",
        text: `Most artifacts are a single HTML file. Occasionally Claude splits things across several files, or you have built something larger around it. In that case, {{features-zip-upload|zip the files together and upload the archive}}. NudgeHost unpacks it and serves the index.html as the entry point.

If Claude loaded a library like React or Tailwind from a {{glossary-cdn|content delivery network}}, those requests fire as normal from the hosted page. The artifact behaves online exactly as it did in the conversation. The same approach that lets you {{host-html|publish any HTML page}} handles multi-file projects.`,
      },
      {
        type: "cta",
        title: "Publish your first artifact",
        text: "Copy the HTML from Claude, paste it in, and get a live link in under 30 seconds.",
        link: "/sign-up",
        label: "Get started free",
        icon: "⚡",
      },
      {
        type: "h2",
        text: "Why NudgeHost over other options",
        id: "alternatives",
      },
      {
        type: "compare",
        headers: ["Feature", "GitHub Gist", "CodePen", "NudgeHost"],
        rows: [
          {
            cells: [
              "{{features-html-rendering|Live HTML rendering}}",
              "✗ (raw code only)",
              "✓",
              "{{features-html-rendering|✓}}",
            ],
            nhCol: 3,
          },
          {
            cells: [
              "{{features-public-links|No account to view}}",
              "✓",
              "✗ (cluttered UI)",
              "{{features-public-links|✓}}",
            ],
            nhCol: 3,
          },
          {
            cells: [
              "{{features-full-screen-viewer|Clean, full-screen view}}",
              "✗",
              "✗ (split panes)",
              "{{features-full-screen-viewer|✓}}",
            ],
            nhCol: 3,
          },
          {
            cells: [
              "{{features-link-updating|Update without new URL}}",
              "✗",
              "✓",
              "{{features-link-updating|✓}}",
            ],
            nhCol: 3,
          },
          {
            cells: [
              "{{features-link-previews|Branded link preview}}",
              "✗",
              "✗",
              "{{features-link-previews|✓}}",
            ],
            nhCol: 3,
          },
        ],
      },
      {
        type: "prose",
        text: "The short version: GitHub Gist shows raw code with no rendering. CodePen renders HTML but wraps it in a cluttered editor UI and requires an account. NudgeHost gives the recipient a clean, full-screen page with no login wall, no branding chrome, and a {{glossary-og-image|branded preview}} when the link is shared in chat.",
      },
      {
        type: "h2",
        text: "Free vs Pro: what you need",
        id: "free-vs-pro",
      },
      {
        type: "prose",
        text: `The free plan handles artifacts easily. The 25MB limit sits far above the size of anything Claude produces, which is almost always under a few hundred kilobytes. You get 10 active links with no expiry and no visitor cap.

The {{pricing|NudgeHost Pro plan}} adds {{features-password-protection|password protection}} and the option to {{features-custom-domains|brand your link with a custom domain}}, both of which matter once the link is going to a client rather than a teammate. If you built a prototype or a pitch tool with Claude, sharing it from yourname.com/pitch lands differently than a generic subdomain.`,
      },
      {
        type: "related",
        items: [
          {
            title: "How to share a Lovable site",
            href: "/blog/how-to-share-a-lovable-site",
            desc: "Export from Lovable, {{host-lovable-export|host on NudgeHost}}, get a public URL.",
            icon: "🔮",
          },
          {
            title: "How to host a v0 export",
            href: "/blog/how-to-host-a-v0-export",
            desc: "Publish {{host-v0-export|v0.dev projects}} as live sites in 30 seconds.",
            icon: "⚙️",
          },
          {
            title: "Send a large PDF without email",
            href: "/blog/how-to-send-a-large-pdf-without-email",
            desc: "Skip the attachment limit. {{host-pdf|Drop a PDF}} and share the link.",
            icon: "📄",
          },
        ],
      },
      {
        type: "faq",
        items: claudeArtifactFaqs,
      },
      {
        type: "bottom-cta",
        title: "Ready to publish your artifact?",
        text: "Copy the HTML from Claude, paste it into NudgeHost, and get a link. Free, no credit card, no account needed to start.",
        link: "/sign-up",
        label: "Get started free",
      },
    ],
    faqs: claudeArtifactFaqs.map((f) => ({ question: f.q, answer: plain(f.a) })),
    relatedToolSlugs: [
      "host-claude-artifact",
      "host-html",
      "host-react-app",
      "host-v0-export",
    ],
    sidebar: {
      toc: [
        { label: "Why artifacts are hard to share", id: "why-hard-to-share" },
        { label: "How to publish (step by step)", id: "step-by-step" },
        { label: "Updating without changing the URL", id: "updating" },
        { label: "When to use a ZIP file", id: "zip-files" },
        { label: "Why NudgeHost vs other options", id: "alternatives" },
        { label: "Free vs Pro", id: "free-vs-pro" },
        { label: "FAQ", id: "faq" },
      ],
      useCases: [
        { label: "Share a resume as a link", href: "/use-cases/share-resume-as-link" },
        {
          label: "Send a portfolio to a recruiter",
          href: "/use-cases/send-portfolio-to-recruiter",
        },
        { label: "Send a presentation to a client", href: "/use-cases/share-deck-with-client" },
        { label: "Host a Claude artifact", href: "/host/claude-artifact" },
      ],
      relatedTools: [
        { label: "Claude artifact hosting", href: "/host/claude-artifact" },
        { label: "HTML hosting", href: "/host/html" },
        { label: "React app hosting", href: "/host/react-app" },
        { label: "What is a static site?", href: "/glossary/static-site" },
        { label: "What is CORS?", href: "/glossary/cors" },
      ],
    },
  },

  "how-to-share-a-lovable-site": {
    slug: "how-to-share-a-lovable-site",
    title: "How to share a Lovable site with a public link",
    metaDescription:
      "Export your Lovable app and host it on NudgeHost for a public link. Covers the ZIP export, how routing works, and putting the app on your own custom domain.",
    h1: "How to share a Lovable site",
    author: "Mark Boreland",
    authorBio:
      "Mark Boreland is the founder of NudgeHost. He writes about publishing what AI tools build and getting files to people without the usual friction.",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "ai-publishing",
    tldr: "Lovable builds a full app from a chat, then offers its own deploy path. If you would rather host it yourself, export the project, drop the build into NudgeHost, and get a public link. A custom domain puts it on your own address. Re-export and the link updates in place.",
    body: [
      {
        type: "prose",
        text: `Lovable.dev is one of the cleanest of the AI app builders. You describe what you want in plain language, it generates a working React app, and you refine it in the chat. Lovable has its own deploy button, which is fine if you want to stay inside Lovable. The moment you want the app on your own domain, or want to hand someone a link without onboarding them onto another tool, hosting the export yourself is the simpler path.`,
      },
      {
        type: "h2",
        text: "Export and upload the build",
        id: "export",
      },
      {
        type: "prose",
        text: `Start by exporting the project from Lovable. The export is a ZIP of the built React app, and Lovable's export panel has an option to include the built output rather than only the source, which saves you a local build step. If you only have the source, run an install and a build locally first, then zip the output folder. Either way you end up with one archive that holds the whole app.

Drop that ZIP into NudgeHost and you {{host-lovable-export}} in one step. NudgeHost unpacks the archive, serves the index as the entry point, and rewrites unknown paths back to it so client-side routing works on a direct visit. This is the same pipeline that runs when you {{host-html}} a multi-file site, so a Lovable export and a hand-built site host the same way. The result is a public link that loads the app exactly as it ran in Lovable.`,
      },
      {
        type: "h2",
        text: "How routing works once it's hosted",
        id: "routing",
      },
      {
        type: "prose",
        text: `A Lovable build is static once it leaves the chat, a folder of HTML, JavaScript, and assets with no server behind it. The one thing to know is routing. An app using React Router handles its own URLs in the browser, so a direct visit to a sub-path would normally fail on a plain host. NudgeHost's fallback sends unmatched paths to the index so the router takes over, which means deep links into the app keep working.`,
      },
      {
        type: "h2",
        text: "Put the app on your own domain",
        id: "custom-domain",
      },
      {
        type: "prose",
        text: `The default link sits on nudgehost.com, which is fine for sharing with a friend. For anything client-facing, putting the app on your own address reads as more established. Our explainer on {{glossary-custom-domain}} covers the setup, which is a single DNS record with the securing certificate issued for you. Custom domains live on {{pricing}}, alongside password protection and the removal of NudgeHost branding.`,
      },
      {
        type: "h2",
        text: "Share the link when job-hunting",
        id: "job-hunting",
      },
      {
        type: "prose",
        text: `Builders who are job-hunting often ship a Lovable app as proof of what they can do, and a working link beats a description every time. You can {{use-case-recruiter}} with the live URL in an application, so a hiring manager clicks once and uses the thing you built. The same link works in a portfolio or a cold email.`,
      },
      {
        type: "h2",
        text: "Update the app in place",
        id: "updating",
      },
      {
        type: "prose",
        text: `Re-export from Lovable whenever you change the app, upload the new ZIP to the same link, and the URL stays put. Anyone who already has it sees the new version. The approach is identical for the other AI builders, so once you have done this you can {{host-v0-export}} or a Bolt project the same way. The mental model is simple. Export the build, drop the archive, share the link.

Hosting a Lovable export is free to start, and most exports compress to a few megabytes, well under the free-plan limit. Upgrade when you want a custom domain or are sharing the link widely. There is no deploy config to learn and no server to keep alive.`,
      },
    ],
    faqs: [
      {
        question: "Do I export source code or the built app?",
        answer:
          "Export the built app where Lovable offers it. If you only have source, run an install and build locally and zip the output folder before uploading.",
      },
      {
        question: "Will client-side routing work after I host it?",
        answer:
          "Yes. NudgeHost rewrites unknown paths to the index so React Router can handle them, which keeps deep links working on a direct visit.",
      },
      {
        question: "Can I use my own domain?",
        answer:
          "Yes, on a paid plan. Add a single DNS record pointing your domain at NudgeHost, and the certificate is issued automatically.",
      },
      {
        question: "Does my Lovable URL stop working if I host elsewhere?",
        answer:
          "No. The NudgeHost link is a separate destination. Both keep working, and you choose which one to share.",
      },
    ],
    relatedToolSlugs: ["host-lovable-export", "host-v0-export", "host-react-app", "host-html"],
  },

  "how-to-send-a-large-pdf-without-email": {
    slug: "how-to-send-a-large-pdf-without-email",
    title: "How to send a large PDF without email size limits",
    metaDescription:
      "Gmail caps attachments at 25MB and Outlook at 20MB. Host the PDF as a link instead and the recipient opens it in the browser at full quality, with nothing to download.",
    h1: "How to send a large PDF without email",
    author: "Mark Boreland",
    authorBio:
      "Mark Boreland is the founder of NudgeHost. He writes about publishing what AI tools build and getting files to people without the usual friction.",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "sharing-files",
    tldr: "Gmail rejects attachments over 25MB and Outlook over 20MB, so a detailed report or a scanned document bounces. The usual workarounds make the recipient sign into Dropbox or Google Drive. Hosting the PDF as a link sidesteps the limit, and the recipient opens it in the browser with nothing to download.",
    body: [
      {
        type: "prose",
        text: `Email was never built to move large files, and the limits make that obvious. Gmail bounces any attachment over 25MB. Outlook caps at 20MB. Many corporate mail servers are stricter still, stripping anything over 10MB before it reaches the inbox. A detailed proposal with embedded images, a scanned contract, or a print-ready PDF blows past these limits without trying. The send fails, or worse, it silently never arrives.`,
      },
      {
        type: "h2",
        text: "Why the usual workarounds add friction",
        id: "workarounds",
      },
      {
        type: "prose",
        text: `The standard escape routes each carry friction. Dropbox and Google Drive work, but they ask the recipient to sign in or fight a permissions dialog before they see the file. WeTransfer avoids the account but expires the link after a few days and wraps the download in ads. Compressing the PDF until it squeezes under the limit usually wrecks the image quality that mattered in the first place. None of these is the clean experience you want when the file is going to a client or a hiring manager.`,
      },
      {
        type: "h2",
        text: "Host the PDF as a link instead",
        id: "host-link",
      },
      {
        type: "prose",
        text: `Hosting the file as a link removes the size limit from the equation. You {{host-pdf}} by dropping it onto NudgeHost, and a clean URL comes back. You send the URL instead of the file, and the recipient clicks and reads the document in their browser at full quality, with nothing to download and no account to create. The email that carries a link is light, so it never bounces, no matter how large the underlying PDF is.`,
      },
      {
        type: "h2",
        text: "How large a file you can host",
        id: "file-size",
      },
      {
        type: "prose",
        text: `The numbers are generous. The free plan handles files up to 25MB, which covers most reports and scanned documents. When you genuinely need more, {{pricing}} raises the ceiling to 250MB on Pro, enough for a high-resolution print file or a long scanned dossier. There are no visitor caps, so a link opened by a whole hiring committee keeps working rather than cutting off.

That no-cap detail matters more than it sounds. Some hosts limit how much {{glossary-bandwidth}} a link can use and stop serving once a file gets popular, which is the opposite of what you want when a document is doing its job. NudgeHost keeps the link live because the file is served through a fast network rather than a single machine.`,
      },
      {
        type: "h2",
        text: "Compress or bundle if you need to",
        id: "compress",
      },
      {
        type: "prose",
        text: `If your PDF is needlessly large, the cause is usually uncompressed images inside it, and a round of {{glossary-file-compression}} before uploading can halve the size with no visible loss. That is optional, though. The point of the link is that you do not have to shrink a file just to send it. When the recipient opens the link, they read it through an in-browser view, the same way they would {{viewer-pdf}} any document, so there is no reader app to install.

Sometimes a large PDF travels with companions, a cover letter, an appendix, a spreadsheet of figures. Rather than sending three links, zip them together and you {{host-zip}} as a single archive the recipient browses from one URL. It keeps a related set of documents under one link instead of scattered across an email thread.`,
      },
      {
        type: "h2",
        text: "Keep control after you send it",
        id: "control",
      },
      {
        type: "prose",
        text: `Hosting also gives you control after sending, which an attachment never does. You can set the link to expire once a deal closes, or add a password for a sensitive document. The full walkthrough for the specific case of a big file lives in the guide to {{use-case-large-pdf}}, including how expiry and password gating work. The short version is that the link is the file's address, not the file itself, so you decide how long that address stays live.

Drop the file, copy the URL, and paste it into your email. The recipient gets the document at full quality in their browser, you get a record of when they opened it, and your message lands in the inbox instead of bouncing off a size limit.`,
      },
    ],
    faqs: [
      {
        question: "What is the actual attachment limit for Gmail and Outlook?",
        answer:
          "Gmail rejects attachments over 25MB and Outlook over 20MB. Many corporate mail servers strip anything over 10MB before delivery.",
      },
      {
        question: "How large a PDF can I host on the free plan?",
        answer:
          "Up to 25MB free, and up to 250MB on Pro. The recipient never downloads it unless they choose to.",
      },
      {
        question: "Does the recipient need an account to open the link?",
        answer:
          "No. The PDF opens in their browser from the link. There is no sign-in and no download step unless they want a copy.",
      },
      {
        question: "Can I stop people opening the file later?",
        answer:
          "Yes. Set an expiry date or delete the link at any time, which revokes access immediately. You can also add a password.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "use-case-large-pdf", "viewer-pdf", "host-zip"],
  },

  "how-to-share-a-resume-as-a-link": {
    slug: "how-to-share-a-resume-as-a-link",
    title: "How to share your resume as a link recruiters will open",
    metaDescription:
      "Share your resume as a link instead of an attachment. It opens in the browser, tracks when a recruiter views it, and always shows the latest version. Here is the flow.",
    h1: "How to share your resume as a link",
    author: "Mark Boreland",
    authorBio:
      "Mark Boreland is the founder of NudgeHost. He writes about publishing what AI tools build and getting files to people without the usual friction.",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "sharing-files",
    tldr: "Recruiters open dozens of CVs a day, and an attachment adds friction with a download, a reader, and a file that may be out of date. A link opens in the browser, tracks when it was viewed, and always shows the latest version. Here is how to turn your resume into a link that does all three.",
    body: [
      {
        type: "prose",
        text: `A recruiter opening a job application is not so much reading your resume as triaging it, one of many that day. Every small friction counts against you. An attachment makes them download a file, trust it, and open it in whatever reader their machine defaults to. A link does none of that. They click, the resume opens in the browser, and they are reading it a second later. The format you control, on any device, with nothing to install.`,
      },
      {
        type: "h2",
        text: "Turn your resume into a link",
        id: "make-link",
      },
      {
        type: "prose",
        text: `Most resumes are PDFs, because PDF holds its layout on every screen, and that is the right choice here. You {{host-pdf}} by dropping the file onto NudgeHost, and a clean link comes back with open-tracking switched on. Put that link in your application email, your LinkedIn, and your email signature. One link, everywhere, instead of attaching the same file over and over.`,
      },
      {
        type: "h2",
        text: "See when a recruiter opens it",
        id: "tracking",
      },
      {
        type: "prose",
        text: `The tracking is the part that changes how you job-hunt. The link reports when it was opened and roughly from where, so you learn whether a recruiter actually looked at your CV before an interview or whether the application is still sitting unread. The recruiter sees an ordinary link with no hint of tracking. The data is yours alone, in your dashboard. If you make a separate link per application, you can tell which company opened it, which tells you where a follow-up is worth sending.`,
      },
      {
        type: "h2",
        text: "Never send a stale version",
        id: "updating",
      },
      {
        type: "prose",
        text: `An attachment freezes the moment you send it. Spot a typo after applying to forty roles and every one of those inboxes holds the wrong version. A hosted resume fixes this. Swap the file in your dashboard and the link stays the same, so the next time anyone opens it they see the corrected version. You update once instead of re-sending forty times.`,
      },
      {
        type: "h2",
        text: "Make the link look professional",
        id: "preview",
      },
      {
        type: "prose",
        text: `There is a small detail that makes a resume link look professional when it travels. When you paste the link into LinkedIn or an email, the preview card that unfurls comes down to {{glossary-og-image}}, the little image and title a platform shows. A link with a clean preview reads as deliberate, where a bare URL reads as careless. NudgeHost generates a sensible preview for the file, so the link looks intentional wherever you share it.`,
      },
      {
        type: "h2",
        text: "Pair it with your portfolio",
        id: "portfolio",
      },
      {
        type: "prose",
        text: `A resume rarely travels alone for design, product, or engineering roles. The stronger move is to send the CV alongside your work, so you can {{host-portfolio}} and share both as trackable links. The dedicated walkthrough for the CV case lives in the guide to {{use-case-resume-link}}, and the companion flow to {{use-case-recruiter}} covers sending a portfolio to a hiring manager. Together they cover most of what a job application needs to carry.

Hosting one resume is free, and a CV sits far under the 25MB limit. {{pricing}} adds a custom domain and removes NudgeHost branding from the link, both worth it once you are applying widely and want the URL to look like your own. For a single application the free plan is all you need.

Drop your resume, copy the link, and put it everywhere you would have attached the file. You will know when it is read, you will never send a stale version, and the recruiter opens your CV in the time it takes an attachment to start downloading.`,
      },
    ],
    faqs: [
      {
        question: "Will the recruiter know I am tracking the link?",
        answer:
          "No. It looks like an ordinary link. The open data is visible only to you, in your dashboard.",
      },
      {
        question: "What format should my resume be?",
        answer:
          "PDF. It holds its layout on every device. Convert a Word file to PDF first if needed.",
      },
      {
        question: "Can I tell which company opened my resume?",
        answer:
          "If you create a separate link per application, yes. Each link reports its own opens.",
      },
      {
        question: "Can I update my resume without changing the link?",
        answer:
          "Yes. Replace the file in your dashboard and the URL stays the same, so everyone who has the link sees the new version.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-portfolio", "use-case-resume-link", "use-case-recruiter"],
  },

  "how-to-host-a-v0-export": {
    slug: "how-to-host-a-v0-export",
    title: "How to host a v0 export as a live site",
    metaDescription:
      "Export from v0, Vercel's AI UI builder, and host it on NudgeHost for a live link. Covers the paste-HTML route for a single component and the ZIP route for a full app.",
    h1: "How to host a v0 export",
    author: "Mark Boreland",
    authorBio:
      "Mark Boreland is the founder of NudgeHost. He writes about publishing what AI tools build and getting files to people without the usual friction.",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "ai-publishing",
    tldr: "v0 is Vercel's AI UI builder. It generates React and Tailwind code you preview in the chat, but sharing it usually means deploying to Vercel. If you would rather host it yourself, export the code or the build, drop it into NudgeHost, and get a live link. A single component or a full app both work.",
    body: [
      {
        type: "prose",
        text: `v0 is Vercel's design-and-code generator. You describe an interface, v0 produces React and Tailwind code, and you refine it in the chat. The default next step is to deploy on Vercel, which makes sense if you already live in Vercel-land. If you just want to show someone what v0 built, or put it on your own domain, hosting the export yourself is lighter than a full deploy.`,
      },
      {
        type: "h2",
        text: "Paste a single component",
        id: "paste",
      },
      {
        type: "prose",
        text: `What you export depends on what you built. For a single self-contained component, copy the HTML that v0 produces and you {{host-html}} by pasting it straight in, which gives you a URL in seconds. This is the same paste flow that works for any AI output, so a v0 component and a Claude artifact host identically. It is the fastest route for a static demo of one piece of UI.`,
      },
      {
        type: "h2",
        text: "Upload a multi-file app",
        id: "zip",
      },
      {
        type: "prose",
        text: `For a multi-file app, export the project and you {{host-v0-export}} by uploading the ZIP. NudgeHost unpacks it and serves the index as the entry point, with unknown paths rewritten back to it so client-side routing works. Under the hood this is the same pipeline you hit when you {{host-react-app}} directly, because a v0 app is a React build once it leaves the chat. If the export is source rather than a build, run an install and a build locally first, then zip the output folder.`,
      },
      {
        type: "h2",
        text: "Why it hosts without a server",
        id: "static",
      },
      {
        type: "prose",
        text: `Whichever path you take, the output is static, a folder of files served as they are with the JavaScript running in the browser. See {{glossary-static-site}} for why that hosts without a server. v0 exports often pull Tailwind from a CDN and inline their shadcn components, and both work from the hosted page exactly as they did in the preview, so the design survives the move intact.`,
      },
      {
        type: "h2",
        text: "Pick paste or ZIP",
        id: "paste-or-zip",
      },
      {
        type: "prose",
        text: `One practical detail trips people up. v0 sometimes splits output across several files, a page file and a folder of components, and pasting only the preview HTML loses the structure. If you want the full app rather than a static snapshot, take the project export and host the ZIP. If a static snapshot of the UI is all you need, the pasted HTML is enough and quicker. Pick based on whether the thing needs to actually run or just be seen.`,
      },
      {
        type: "h2",
        text: "Share and update the link",
        id: "share",
      },
      {
        type: "prose",
        text: `A v0 build is often the centrepiece of a pitch, an internal demo, or a design review. You can {{use-case-deck}} and hand over the live link as the working demo rather than a screenshot in slides. A stakeholder clicking a real interface understands it faster than any description, and the link works on their phone as well as their laptop.

Re-export from v0 whenever the design changes, upload to the same link, and the URL stays the same so nobody needs a new one. Hosting is free to start, and most v0 exports are small enough to sit well under the free-plan limit. {{pricing}} adds custom domains and password protection for when the link goes to a client. The deploy step you were about to set up turns out to be a drag-and-drop.`,
      },
    ],
    faqs: [
      {
        question: "Should I paste the code or upload a ZIP?",
        answer:
          "Paste the HTML for a single-file static demo. Upload a ZIP for a multi-file app where you want the whole thing to run.",
      },
      {
        question: "Will Tailwind and shadcn components work once hosted?",
        answer:
          "Yes. v0 typically loads Tailwind from a CDN and inlines shadcn components, and both work from the hosted page as they did in the preview.",
      },
      {
        question: "Do I need a Vercel account to host a v0 export?",
        answer:
          "No. Hosting on NudgeHost is independent of Vercel. You export from v0 and host the result without deploying anywhere else.",
      },
      {
        question: "Will client-side routes work?",
        answer:
          "Yes. NudgeHost rewrites unknown paths to the index so the router handles them, which keeps direct visits to sub-paths working.",
      },
    ],
    relatedToolSlugs: ["host-v0-export", "host-react-app", "host-html", "host-claude-artifact"],
  },
};
