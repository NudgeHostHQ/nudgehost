import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const useCasesSilo: SiloConfig = {
  key: "use-cases",
  basePath: "/use-cases",
  hubLabel: "Use cases",
  schemaType: "WebApplication",
  heroVariant: "cta",
  ctaVerb: "share your first file",
  showByline: true,
  showHowItWorks: true,
  showFeatureCards: true,
  prominentCta: true,
};

export const useCasesContentMap: Record<string, SpokeContent> = {
  "share-resume-as-link": {
    slug: "share-resume-as-link",
    name: "Share a resume as a link",
    title: "How to share your resume as a link, free, with tracking",
    description:
      "Stop sending your CV as an email attachment. Share it as a clean link with open-tracking so you know when a recruiter reads it.",
    h1: "Share your resume as a link.",
    lead: "An attachment tells you nothing. A link tells you when a recruiter opened your CV, how often, and from where.",
    keyPoints: [
      "Upload your CV (PDF preferred), get a clean shareable link with open-tracking built in.",
      "Recipients see your CV in the browser. No download, no Dropbox sign-in, no spam filter strikes.",
      "Updating the CV later keeps the same URL, so every employer who already has the link sees the latest version.",
      "Open tracking is private to you. The recruiter sees a normal link, and you see when they viewed it.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-21",
    dateModified: "2026-05-22",
    body: [
      "The email attachment is the default way to send a resume, and it's quietly the worst. It can trip spam filters, it shows the recruiter a download prompt instead of your CV, and it tells you nothing about whether anyone actually opened it. A link fixes all three problems at once.",
      "The mechanics are simple: you {{host-resume}} and get back a clean URL with open-tracking switched on. Put that link in your application email, your LinkedIn, your email signature. When a recruiter opens it, you see it. Most resumes are PDFs, and if yours is a Word file, {{converter-docx-to-pdf}} first so the formatting holds on every device.",
      "If you're applying for design, product, or front-end roles, a resume alone undersells you. The stronger move is to {{use-case-recruiter}} as a single link that includes your work. And when you update the CV, the link stays the same: swap the file and everyone who already has the link sees the new version.",
      "The free plan covers all of this. A custom domain and the removal of NudgeHost branding are on {{pricing}}. Both are worth it once you're applying widely.",
    ],
    faqs: [
      {
        q: "Will the recruiter know I'm tracking the link?",
        a: "No. It looks like an ordinary link. The open data is visible only to you, in your dashboard.",
      },
      {
        q: "What format should my resume be?",
        a: "PDF. It preserves your layout on every device. Convert a Word file to PDF first if needed.",
      },
      {
        q: "Can I tell which company opened my resume?",
        a: "If you create a separate link per application, yes. Each link tracks its own opens.",
      },
    ],
    relatedToolSlugs: ["host-resume", "converter-docx-to-pdf", "use-case-recruiter", "host-portfolio"],
  },

  "send-portfolio-to-recruiter": {
    slug: "send-portfolio-to-recruiter",
    name: "Send a portfolio to a recruiter",
    title: "How to send your portfolio to a recruiter as one clean link",
    description:
      "Share your design or development portfolio with a recruiter as a single link. No Dropbox login, no huge attachment, no friction.",
    h1: "Send your portfolio to a recruiter.",
    lead: "One link, no login wall, no 40MB attachment. Just your work, opening instantly in their browser.",
    keyPoints: [
      "Share a portfolio as a single nudgehost.com link instead of a Dropbox login wall or a heavy email attachment.",
      "Works for PDF portfolios, built HTML sites, or multi-file projects bundled as a ZIP.",
      "Recruiters open your work in their browser. No account, no download.",
      "Open-tracking lets you see whether the portfolio was reviewed before an interview.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Recruiters look at a lot of portfolios, and every point of friction costs you. A Dropbox link makes them sign in. A giant attachment clogs their inbox or gets stripped. A personal site is great but takes time to build. A NudgeHost link is the fast path: your work, one URL, opening instantly.",
      "If your portfolio is a PDF, {{host-pdf}} and you're done. If it's a built site or an interactive piece, {{host-html}} works the same way, and a multi-file project can be zipped so you {{host-zip}} it as one link. Whatever the format, the recruiter clicks once and sees your work. No account, no download.",
      "A portfolio usually travels with a CV, so pair this with the flow to {{use-case-resume-link}} and send both as trackable links. The tracking matters here: you'll see whether the recruiter actually opened your work before a call, which is genuinely useful intelligence.",
      "All free to start. Custom domains are on {{pricing}}, which is a nice touch when recruiters see the URL.",
    ],
    faqs: [
      {
        q: "What if my portfolio is several files?",
        a: "Zip them together and host the ZIP. NudgeHost serves it as one link, and you can include a PDF, images, and a built site in the same archive.",
      },
      {
        q: "Will the recruiter need an account?",
        a: "No. Anyone with the link opens your portfolio directly in their browser.",
      },
      {
        q: "Can I see if they looked at it?",
        a: "Yes. The link reports opens, so you know whether your work was viewed before an interview.",
      },
    ],
    relatedToolSlugs: ["host-portfolio", "host-pdf", "host-html", "use-case-resume-link"],
  },

  "send-large-pdf-without-email": {
    slug: "send-large-pdf-without-email",
    name: "Send a large PDF without email",
    title: "How to send a large PDF without email size limits",
    description:
      "Email bounces big PDFs. Share a large PDF as a link instead. No size limit, no compression, no attachment.",
    h1: "Send a large PDF without email.",
    lead: "Email caps attachments at around 25MB. A link has no such limit, and it's tidier anyway.",
    keyPoints: [
      "Email rejects PDFs over roughly 25MB; hosting the file and sharing a link sidesteps the limit entirely.",
      "Recipients open the PDF at full quality in their browser, with nothing to download.",
      "Optional link expiry and password protection give you control after sending.",
      "Free plan handles files up to 25MB per upload; larger files are on a paid plan.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Every email provider rejects attachments past roughly 25MB, and a detailed report, a scanned document, or a print-ready file blows past that easily. The usual workarounds, like compressing until the file looks bad or splitting it into parts, are worse than the problem. Sharing a link sidesteps the size limit entirely.",
      "The fix is to {{host-pdf}} and send the URL instead of the file. The recipient clicks and reads the document in their browser, at full quality, with nothing to download. If you genuinely need a smaller file as well, {{converter-pdf-to-jpg}} can turn heavy pages into images, but for most cases the link is all you need.",
      "This works for any large file, not just PDFs. You can {{host-hub}} of any kind, and a collection of files can be zipped so you {{host-zip}} them as one link. If the document is sensitive, link expiry and password protection turn the share into something you control after sending.",
      "The free plan handles files up to 25MB; larger files are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "How large a PDF can I share?",
        a: "Up to 25MB on the free plan, and considerably larger on paid plans. The recipient never downloads it unless they choose to.",
      },
      {
        q: "Does the recipient need to download the file?",
        a: "No. The PDF opens in their browser. Downloading is optional.",
      },
      {
        q: "Can I stop people accessing the file later?",
        a: "Yes. You can set an expiry date or delete the link at any time, which immediately revokes access.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "converter-pdf-to-jpg", "host-zip", "viewer-pdf"],
  },

  "share-deck-with-client": {
    slug: "share-deck-with-client",
    name: "Share a deck with a client",
    title: "How to share a presentation deck with a client",
    description:
      "Send a client your presentation as a clean link instead of a heavy attachment. No download, opens in the browser, fully trackable.",
    h1: "Share a deck with a client.",
    lead: "Send a link, not a 30MB attachment. The client opens your deck in their browser and you see when they did.",
    keyPoints: [
      "Export the deck to PDF, host it, and send a clean link instead of a 30MB attachment.",
      "Open-tracking shows whether the client reviewed the deck before your meeting.",
      "Password protection and link expiry are available for sensitive commercial decks.",
      "Works the same way for interactive HTML presentations as for PDF exports.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Presentation files are heavy, and emailing one to a client is clumsy: it strains their inbox, it may not open cleanly on their device, and you never learn whether they looked at it before the call. A link solves all of that and looks more professional besides.",
      "Export the deck to PDF so it looks identical everywhere; a slide deck rendered on the wrong software is a bad first impression. Then {{host-pdf}} and send the link. If your deck is an interactive or web-based presentation, {{host-html}} handles that just as well. And if the client wants to lift slides into their own deck rather than just viewing yours, {{host-pptx}} keeps the file editable on their end. Either way the client clicks once and it opens.",
      "The open-tracking is quietly valuable in client work: you'll know whether the deck was reviewed before a meeting, which shapes how you run the call. For sensitive commercial decks, set a password or an expiry. And if you're sending supporting documents alongside the deck, {{host-hub}} each of them or bundle everything into one {{host-zip}}.",
      "Free to start. Custom domains and branding removal are on {{pricing}}, worth it for client-facing links.",
    ],
    faqs: [
      {
        q: "What format should I send the deck in?",
        a: "Export to PDF for a deck that looks identical on every device. Host the PDF and share the link.",
      },
      {
        q: "Can I tell if the client opened it?",
        a: "Yes. The link reports opens, so you know whether the deck was reviewed before your meeting.",
      },
      {
        q: "Can I keep the deck private?",
        a: "Yes. Password-protect the link, or set it to expire after the project ends.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-html", "host-zip", "use-case-recruiter"],
  },
};
