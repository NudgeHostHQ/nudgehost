import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const useCasesSilo: SiloConfig = {
  key: "use-cases",
  basePath: "/use-cases",
  hubLabel: "Use cases",
  schemaType: "WebApplication",
  heroVariant: "cta",
  ctaVerb: "share your first file",
  showByline: true,
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
      "Here's how it works. You {{host-resume}}, and we hand back a clean URL. Open-tracking is on by default. Put the link in your application email, your LinkedIn, your email signature. When a recruiter opens it, you see it. Most resumes are PDFs; if yours is a Word file, {{converter-docx-to-pdf}} first so the formatting holds on every device.",
      "If you're applying for design, product, or front-end roles, a resume alone undersells you. The stronger move is to {{use-case-recruiter}} as one combined link. When you update the CV, the link stays the same. Swap the file and everyone who already has the link sees the new version.",
      "All of this works on {{pricing}}. Once you start applying widely, you can {{features-custom-domains}} and remove NudgeHost branding from the link, both worth it at that scale. For the full walkthrough, read {{blog-how-to-share-a-resume-as-a-link}}.",
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
      "Recruiters look at a lot of portfolios, and every point of friction costs you. A Dropbox link makes them sign in. A giant attachment clogs their inbox or gets stripped. A personal site is great but takes time to build. A NudgeHost link is the fast path. Your work, one URL, opening instantly.",
      "If your portfolio is a PDF, you can {{host-pdf}} and you're done. If it's a built site or an interactive piece, you can {{host-html}} the same way, and a multi-file project zips up so you can {{host-zip}} as one link. Whatever the format, the recruiter clicks once and sees your work. No account, no download.",
      "A portfolio usually travels with a CV, so pair this with the flow to {{use-case-resume-link}} and send both as trackable links. The tracking matters here. You'll see whether the recruiter actually opened your work before a call, which is genuinely useful intelligence.",
      "All free to start. {{pricing}} covers the basics, and on the Pro tier you can {{features-custom-domains}}, a nice touch when recruiters see the URL.",
    ],
    faqs: [
      {
        q: "What if my portfolio is several files?",
        a: "Zip them together and host the ZIP; the bundle shares as one link the recruiter downloads. If the archive is a built site with an index.html, it serves as a browsable site instead, navigation intact.",
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
      "The fix is to {{host-pdf}} and send the URL instead of the file. The recipient clicks and reads the document in their browser, at full quality, with nothing to download. If you genuinely need a smaller file as well, you can {{converter-pdf-to-jpg}}, but for most cases the link is all you need.",
      "This works for any large file, not just PDFs. The same dashboard lets you {{host-hub}}, and a collection of files zips up so you can {{host-zip}} as one link. If the document is sensitive, link expiry and password protection turn the share into something you control after sending, and the file is served through {{glossary-presigned-url|signed file URLs}} so the storage behind it stays private.",
      "The free plan handles files up to 25MB. For larger files, {{pricing}} sets the Pro ceilings.",
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
      "Presentation files are heavy, and emailing one to a client is clumsy. It strains their inbox, it may not open cleanly on their device, and you never learn whether they looked at it before the call. A link solves all of that and looks more professional besides.",
      "Export the deck to PDF so it looks identical everywhere; a slide deck rendered on the wrong software is a bad first impression. Run it through the {{host-pdf|PDF link generator}} and send the link. If your deck is an interactive or web-based presentation, you can {{host-html}} the same way. And if the client wants to lift slides into their own deck rather than just viewing yours, you can {{host-pptx}} so the file stays editable on their end. Either way the client clicks once and it opens. Pasted into an email or Slack, the client sees {{features-link-previews}} with the deck's first slide rather than a bare URL.",
      "The open-tracking is quietly valuable in client work. You'll know whether the deck was reviewed before a meeting, which shapes how you run the call. For sensitive commercial decks, you can {{features-password-protection}} or set an expiry. If you're sending supporting documents alongside the deck, the same uploader lets you {{host-hub}} one at a time, or you can {{host-zip}} and send the bundle as a single link.",
      "Free to start. For custom domains and branding removal, {{pricing}}; both are worth it for client-facing links.",
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

  "share-wedding-website": {
    slug: "share-wedding-website",
    name: "Host a wedding website",
    title: "How to host a wedding website for free",
    description:
      "Drop a wedding HTML page or PDF into NudgeHost and get a clean link to share with guests. No app, no account, no $30/year site builder.",
    h1: "Host a wedding website for free.",
    lead: "Skip the $30/year wedding site builders. Drop a single HTML page or PDF here and get a clean URL with all the details, the RSVP link, and directions.",
    keyPoints: [
      "Upload a wedding HTML page or PDF and get a clean shareable link in seconds, no signup.",
      "Guests open the page in their browser. No app to install, no Knot or Zola account to sign up for.",
      "Update the file anytime and the URL stays the same. Add a venue change, refresh the schedule, swap the photo.",
      "Free on the free plan, with no banner ads or upsells on the link your guests see.",
    ],
    author: "NudgeHost Team",
    datePublished: "2026-05-22",
    dateModified: "2026-05-22",
    body: [
      "Most weddings now have a website, and most of those websites only need to do four things: tell guests the date and venue, accept RSVPs, give directions, and mention the dress code. Maybe a photo at the top. That's a one-page HTML or a one-page PDF, not a CMS with a thousand themes. Everything beyond those essentials is decoration that adds work for you and confusion for the guests trying to find the actual address. A guest looking up the start time on the morning of the wedding doesn't need parallax scrolling or a registry carousel; they need the time, in big enough type to read on the phone screen they're holding.",
      "The big wedding website builders (Zola, The Knot, Joy, Minted) bundle templates, registry tools, and email collection into platforms that cost $20-50 per year and stick ads or upsells on the free tier. Couples shopping for a wedding website rarely need any of that. They have a venue confirmed and a schedule already typed out in Google Docs. They need a URL they can text to their guests, not a marketing funnel asking everyone who opens it to start their own wedding registry.",
      "NudgeHost is the much smaller, much cheaper middle ground. Build your wedding page however you want (a single HTML file you wrote, an AI-generated layout, a PDF designed in Canva, a Notion export printed to PDF) and you can {{host-html}}; if you went the PDF route, the {{host-pdf|PDF link generator}} handles that the same way. The result is a clean nudgehost.com link with no banner ads, no upsells, and no $30 annual renewal. If you'd rather share a designed image of the invitation, you can {{host-image}} the same way. For multiple files (a venue map, an RSVP form, a photo), compress them into an archive and {{host-zip}}; the whole bundle lives at one URL. When the venue confirms a final start time or you spot a typo, swap the source file in your dashboard and the URL stays the same, so the version every guest sees updates instantly. Print the same link as a {{glossary-qr-code|QR code}} on the invitation and older relatives can open it with a phone camera instead of typing a URL.",
      "Guests click the link and read the page. No download, no account, no app from the App Store, no 'sign in with Google to RSVP.' Older relatives who refuse to install another app can still see your wedding details on their phone, on their tablet, or on the desktop computer they use once a month. The link works on every device because it's just a web page. The whole thing costs nothing as long as your file is under 25MB, which it almost certainly is for a single wedding page; {{pricing}} only matters if you want to add a custom domain on top.",
    ],
    faqs: [
      {
        q: "Can I update the wedding details after sharing the link?",
        a: "Yes. Replace the file in your dashboard and the URL doesn't change. Anyone who already has the link sees the new version on their next refresh. Useful when the venue confirms a final start time or the dress code shifts.",
      },
      {
        q: "Can I password-protect my wedding page?",
        a: "Yes, on the Pro plan. Set a password on the link and guests have to enter it before they see the page. Worth it if you'd rather the URL didn't end up indexed in search.",
      },
      {
        q: "How long does the wedding link stay live?",
        a: "Forever on the free plan, with no expiry unless you set one yourself. After the wedding you can keep the page up as a memento, set it to expire on a date, or just delete the link from your dashboard.",
      },
      {
        q: "Can guests view the page on their phone?",
        a: "Yes. The link works in any browser on any modern device: iPhones, Androids, iPads, laptops, even the screen on a Smart TV. If your wedding page is responsive, it adapts automatically.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-pdf", "host-image", "host-zip"],
  },
};
