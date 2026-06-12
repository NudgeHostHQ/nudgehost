import type { Faq } from "@/lib/spoke-types";

// Comparison pages have a richer shape than generic spokes: they carry a
// feature-comparison table. They get their own template (app/compare/[slug]).

export type CompareRow = {
  feature: string;
  nudgehost: string;
  competitor: string;
  // true when NudgeHost has the clear advantage on this row (used for emphasis)
  nudgehostWins?: boolean;
};

export type CompareContent = {
  slug: string;
  competitorName: string; // e.g. "Tiiny.host"
  title: string;
  description: string;
  h1: string;
  lead: string;
  // Intro prose. May contain {{key}} contextual-link tokens.
  intro: string[];
  rows: CompareRow[];
  // Closing prose. May contain {{key}} tokens.
  verdict: string[];
  faqs: Faq[];
  // Optional overrides for neutral comparisons where neither column is NudgeHost.
  // When unset, defaults assume the layout is "NudgeHost vs competitorName".
  leftColumnLabel?: string; // default "NudgeHost"
  rightColumnLabel?: string; // default competitorName
  verdictHeading?: string; // default "The verdict"
};

export const compareContentMap: Record<string, CompareContent> = {
  "nudgehost-vs-tiiny-host": {
    slug: "nudgehost-vs-tiiny-host",
    competitorName: "Tiiny.host",
    title: "NudgeHost vs Tiiny.host: an honest comparison",
    description:
      "A fair, detailed comparison of NudgeHost and Tiiny.host: free plans, pricing, file size limits, and who each tool suits best.",
    h1: "NudgeHost vs Tiiny.host",
    lead: "Both turn files into shareable links. They differ most in how generous the free plan is and how simple the pricing stays.",
    intro: [
      "Tiiny.host is a well-established tool with a genuine strength. It has been around for years, it is reliable, and its developer-facing hosting is solid. If you want to publish a static site or a framework build, it does that job well. This comparison is not an attempt to pretend otherwise.",
      "Where the two tools diverge is the shape of the offer. Tiiny.host has a 3MB free upload limit and five paid tiers; NudgeHost has a 25MB free limit and three. The rest of this page lays out the differences feature by feature, and the verdict is honest about who should pick which.",
      "If you just want to get started, you can {{home}}, or read on for the detail.",
    ],
    rows: [
      { feature: "Free plan file size", nudgehost: "25MB", competitor: "3MB", nudgehostWins: true },
      { feature: "Free active links/projects", nudgehost: "10 links", competitor: "1 project", nudgehostWins: true },
      { feature: "Upload without an account", nudgehost: "Yes, 25MB", competitor: "Yes, 3MB", nudgehostWins: true },
      { feature: "Banner on registered free plan", nudgehost: "No banner", competitor: "Banner", nudgehostWins: true },
      { feature: "Number of paid tiers", nudgehost: "3 (simple)", competitor: "5 (fragmented)", nudgehostWins: true },
      { feature: "Entry paid price", nudgehost: "$8/mo", competitor: "$5/mo annual" },
      { feature: "Visitor caps on plans", nudgehost: "None", competitor: "10k–100k caps", nudgehostWins: true },
      { feature: "QR code on free plan", nudgehost: "Yes", competitor: "Paid only", nudgehostWins: true },
      { feature: "AI-output hosting pages", nudgehost: "Dedicated", competitor: "Not specifically", nudgehostWins: true },
      { feature: "ZIP upload serves as a live site", nudgehost: "Yes, own subdomain", competitor: "Yes" },
      { feature: "Static site / framework hosting", nudgehost: "Yes", competitor: "Yes, mature" },
      { feature: "Custom domains", nudgehost: "Paid", competitor: "Paid" },
      { feature: "Years in market", nudgehost: "New", competitor: "Established", nudgehostWins: false },
    ],
    verdict: [
      "Pick Tiiny.host if longevity is your priority and you want a tool with a long track record, particularly for developer-oriented static hosting. That maturity is real and worth something.",
      "Pick NudgeHost if the free plan matters to you, if five pricing tiers feel like more decision than you want to make, or if you are sharing AI-generated outputs and want pages built for that. The 25MB free limit alone is the difference between a plan you can actually use and a plan that is really a demo. Both tools take uploads without an account, at 25MB on NudgeHost against 3MB on Tiiny.host.",
      "Tiiny.host is the safe established choice, and NudgeHost is the more generous and simpler one. If you want to test that claim, {{host-pdf}} or {{host-html}} on the free plan and see how far it gets you. You can also compare {{compare-linkyhost}} for the third option, or read {{compare-tiiny-vs-linkyhost}} for a neutral take that does not feature NudgeHost in either column.",
    ],
    faqs: [
      {
        q: "Is NudgeHost cheaper than Tiiny.host?",
        a: "The entry paid prices are close. The bigger difference is the free plan. NudgeHost's is far more usable, and NudgeHost has three tiers rather than five.",
      },
      {
        q: "Can NudgeHost host static sites like Tiiny.host?",
        a: "Yes. Zip your site or SPA build and it serves at its own subdomain with client-side routing working, or upload a single HTML file. Tiiny.host's developer hosting is more mature, but NudgeHost covers the common cases.",
      },
      {
        q: "Which is better for sharing a Claude or AI-generated output?",
        a: "NudgeHost has dedicated pages and a paste-HTML flow for AI outputs. Tiiny.host can host the same files but isn't built around that use case.",
      },
    ],
  },

  "nudgehost-vs-linkyhost": {
    slug: "nudgehost-vs-linkyhost",
    competitorName: "Linkyhost",
    title: "NudgeHost vs Linkyhost: an honest comparison",
    description:
      "A fair, detailed comparison of NudgeHost and Linkyhost: free plans, pricing, features, and which file-sharing tool suits you.",
    h1: "NudgeHost vs Linkyhost",
    lead: "Two newer tools in the same space. The clearest gap is the free plan. Linkyhost allows a single upload, NudgeHost allows ten.",
    intro: [
      "Linkyhost is a capable file-to-link tool with a clean interface and a sensible $5 entry price. It leans hard into PDF and document sharing, and for a single user with a single file to send, it does the job.",
      "The two tools are closest in spirit of any in this category. Both are newer, both turn files into links, and both build programmatic SEO pages. The differences are in the free plan, the breadth of the product, and the positioning. This page goes through them fairly.",
      "If you'd rather skip ahead, you can {{home}} instead.",
    ],
    rows: [
      { feature: "Free plan uploads", nudgehost: "10 active links", competitor: "1 upload total", nudgehostWins: true },
      { feature: "Free plan file size", nudgehost: "25MB", competitor: "10MB", nudgehostWins: true },
      { feature: "Entry paid price", nudgehost: "$8/mo", competitor: "$5/mo" },
      { feature: "Top paid tier price", nudgehost: "$24/mo", competitor: "$16.58/mo" },
      { feature: "QR code on free plan", nudgehost: "Yes", competitor: "No", nudgehostWins: true },
      { feature: "AI-output hosting pages", nudgehost: "Dedicated", competitor: "One use-case page", nudgehostWins: true },
      { feature: "ZIP upload serves as a live site", nudgehost: "Yes, own subdomain", competitor: "No", nudgehostWins: true },
      { feature: "Upload without an account", nudgehost: "Yes, 25MB", competitor: "No", nudgehostWins: true },
      { feature: "Banner on registered free plan", nudgehost: "No banner", competitor: "Banner", nudgehostWins: true },
      { feature: "Product breadth", nudgehost: "Host, view, convert, dev tools", competitor: "Similar" },
      { feature: "Brand personality", nudgehost: "Warm, distinct", competitor: "Utility-style", nudgehostWins: true },
    ],
    verdict: [
      "Pick Linkyhost if the lowest entry price is the deciding factor ($5 beats $8), and you are happy to upgrade immediately, since the one-upload free plan is not something you can run on.",
      "Pick NudgeHost if you want a free plan you can genuinely use, QR codes without paying, dedicated support for AI-generated outputs, and a product that does not feel like a faceless utility. NudgeHost also takes uploads without an account, up to three 25MB files, where Linkyhost requires one before your first upload.",
      "Honestly, these two are close, and Linkyhost's lower price is a real point in its favour. NudgeHost's case is the much more usable free tier and the broader toolset. If you want to test that, {{host-pdf}} on the free plan, or see how NudgeHost stacks up against {{compare-tiiny}}.",
    ],
    faqs: [
      {
        q: "Is Linkyhost cheaper than NudgeHost?",
        a: "Linkyhost's entry plan is $5 versus NudgeHost's $8. NudgeHost's free plan, however, is far more usable. Ten links and 25MB against a single 10MB upload.",
      },
      {
        q: "Do both tools handle PDFs well?",
        a: "Yes. Both are strong at PDF sharing. NudgeHost also has dedicated viewers, converters, and dev tools around the core hosting.",
      },
      {
        q: "Which has the better free plan?",
        a: "NudgeHost, clearly. Ten active links and 25MB per file, versus Linkyhost's single upload capped at 10MB.",
      },
    ],
  },

  "tiiny-host-vs-linkyhost": {
    slug: "tiiny-host-vs-linkyhost",
    competitorName: "Linkyhost",
    leftColumnLabel: "Tiiny.host",
    rightColumnLabel: "Linkyhost",
    verdictHeading: "So which one?",
    title: "Tiiny.host vs Linkyhost: Which File Hosting Tool Is Better? | NudgeHost",
    description:
      "An honest comparison of Tiiny.host and Linkyhost for file hosting and link sharing. Pricing, free tiers, features, and where each one falls short.",
    h1: "Tiiny.host vs Linkyhost.",
    lead: "Both tools turn files into shareable links, but they take different approaches. Tiiny.host leans toward static site hosting with developer-friendly features. Linkyhost focuses on PDF and document sharing. Here is how they compare on the things that actually matter.",
    intro: [
      "Tiiny.host is the older of the two products and built its reputation around static site hosting. It can deploy React builds, Gatsby exports, and PHP projects, so if you need to {{host-html}} for a real web project it has the most depth here. Linkyhost is newer and aimed at people who want to turn a PDF into a shareable URL without thinking about configuration.",
      "Both products overlap in the basics. Each offers a PDF link generator, each offers custom domains on paid plans, and each builds programmatic SEO content around what it hosts. Where they diverge is the free tier and the shape of the pricing ladder above it. Tiiny.host has five paid plans and applies visitor caps below the top tier. Linkyhost has three paid plans without visitor caps but a tighter file size ceiling.",
      "The table below covers the side-by-side detail. The free tier row is where to look first if cost is the deciding factor; {{pricing|the free plan}} for NudgeHost sits in the same comparison set and gives a more usable starting plan than either of these.",
    ],
    rows: [
      { feature: "Free tier", nudgehost: "1 project, 3MB, 100 visitors/mo", competitor: "1 upload, 10MB" },
      { feature: "Paid starting price", nudgehost: "$5/mo (1 project, 25MB)", competitor: "$5/mo (unlimited uploads, 100MB)" },
      { feature: "Number of paid tiers", nudgehost: "5", competitor: "3" },
      { feature: "File size limit (top tier)", nudgehost: "2TB", competitor: "500MB" },
      { feature: "Visitor caps", nudgehost: "Yes (10k on $5 plan)", competitor: "No" },
      { feature: "Custom domain", nudgehost: "$13/mo+ plan", competitor: "$5/mo plan" },
      { feature: "Password protection", nudgehost: "$13/mo+ plan", competitor: "$5/mo plan" },
      { feature: "HTML/static site hosting", nudgehost: "Yes, core feature", competitor: "Yes, but secondary" },
      { feature: "PDF focus", nudgehost: "Secondary", competitor: "Primary" },
      { feature: "QR codes", nudgehost: "Paid only", competitor: "Not available" },
      { feature: "API access", nudgehost: "$13/mo+ plan", competitor: "$16.58/mo plan" },
      { feature: "Anonymous upload (no account)", nudgehost: "Yes (free tier)", competitor: "No (account required)" },
      { feature: "Link expiry on free tier", nudgehost: "Links die if you don't log in monthly", competitor: "No expiry mentioned" },
    ],
    verdict: [
      "Tiiny.host is the stronger pick if you are hosting static sites or React builds and you are comfortable with a developer-oriented tool. It has been around longer and the static hosting is more mature. Linkyhost is simpler if you just need to {{host-pdf}} without thinking about configuration.",
      "Both free tiers are punishing in different ways. Tiiny caps you at 3MB per file with a 100 monthly visitor limit, and Linkyhost limits you to a single upload before you need to pay. If cost matters, neither plan is going to keep you for long.",
      "By contrast, the free plan on NudgeHost gives you 10 active links at 25MB each with no visitor caps and no monthly login requirement, which is worth a look before committing to either of these. For the direct head-to-heads, see {{compare-tiiny}} or {{compare-linkyhost}}.",
    ],
    faqs: [
      {
        q: "Is Tiiny.host or Linkyhost better for sharing PDFs?",
        a: "Linkyhost is more PDF-focused. Its viewer is purpose-built for documents and the free tier is shaped around single-PDF sharing. Tiiny.host can also host PDFs but treats them as one of many file types.",
      },
      {
        q: "Which one has a better free plan?",
        a: "Neither is generous. Tiiny limits you to 3MB per file with 100 monthly visitors, and Linkyhost limits you to a single upload total. For a usable free tier, NudgeHost offers 10 links at 25MB each.",
      },
      {
        q: "Can I host an HTML website on Linkyhost?",
        a: "Yes, but it is not Linkyhost's primary use case. Tiiny.host is built around static site hosting and supports React, Gatsby, and PHP projects out of the box.",
      },
      {
        q: "Do either of them have visitor limits?",
        a: "Tiiny.host caps visitors on every plan below Pro Max. Linkyhost does not cap visitors on any plan.",
      },
    ],
  },
};
