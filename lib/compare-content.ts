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
  // Intro prose — may contain {{key}} contextual-link tokens.
  intro: string[];
  rows: CompareRow[];
  // Closing prose — may contain {{key}} tokens.
  verdict: string[];
  faqs: Faq[];
};

export const compareContentMap: Record<string, CompareContent> = {
  "nudgehost-vs-tiiny-host": {
    slug: "nudgehost-vs-tiiny-host",
    competitorName: "Tiiny.host",
    title: "NudgeHost vs Tiiny.host — an honest comparison",
    description:
      "A fair, detailed comparison of NudgeHost and Tiiny.host: free plans, pricing, file size limits, and who each tool suits best.",
    h1: "NudgeHost vs Tiiny.host",
    lead: "Both turn files into shareable links. They differ most in how generous the free plan is and how simple the pricing stays.",
    intro: [
      "Tiiny.host is a well-established tool with a genuine strength: it has been around for years, it is reliable, and its developer-facing hosting is solid. If you want to publish a static site or a framework build, it does that job well. This comparison is not an attempt to pretend otherwise.",
      "Where the two tools diverge is the shape of the offer. Tiiny.host has a 3MB free upload limit and five paid tiers; NudgeHost has a 25MB free limit and three. The rest of this page lays out the differences feature by feature, and the verdict is honest about who should pick which.",
      "If you just want to get started, you can {{home}} right now — or read on for the detail.",
    ],
    rows: [
      { feature: "Free plan file size", nudgehost: "25MB", competitor: "3MB", nudgehostWins: true },
      { feature: "Free active links/projects", nudgehost: "10 links", competitor: "1 project", nudgehostWins: true },
      { feature: "Number of paid tiers", nudgehost: "3 (simple)", competitor: "5 (fragmented)", nudgehostWins: true },
      { feature: "Entry paid price", nudgehost: "$8/mo", competitor: "$5/mo annual" },
      { feature: "Visitor caps on plans", nudgehost: "None", competitor: "10k–100k caps", nudgehostWins: true },
      { feature: "QR code on free plan", nudgehost: "Yes", competitor: "Paid only", nudgehostWins: true },
      { feature: "AI-output hosting pages", nudgehost: "Dedicated", competitor: "Not specifically", nudgehostWins: true },
      { feature: "Static site / framework hosting", nudgehost: "Yes", competitor: "Yes, mature" },
      { feature: "Custom domains", nudgehost: "Paid", competitor: "Paid" },
      { feature: "Years in market", nudgehost: "New", competitor: "Established", nudgehostWins: false },
    ],
    verdict: [
      "Pick Tiiny.host if longevity is your priority and you want a tool with a long track record, particularly for developer-oriented static hosting. That maturity is real and worth something.",
      "Pick NudgeHost if the free plan matters to you, if five pricing tiers feel like more decision than you want to make, or if you are sharing AI-generated outputs and want pages built for that. The 25MB free limit alone is the difference between a plan you can actually use and a plan that is really a demo.",
      "A fair summary: Tiiny.host is the safe established choice; NudgeHost is the more generous and simpler one. If you want to test that claim, {{host-pdf}} or {{host-html}} on the free plan and see how far it gets you. You can also compare {{compare-linkyhost}} for the third option in this category.",
    ],
    faqs: [
      {
        q: "Is NudgeHost cheaper than Tiiny.host?",
        a: "The entry paid prices are close. The bigger difference is the free plan — NudgeHost's is far more usable — and that NudgeHost has three tiers rather than five.",
      },
      {
        q: "Can NudgeHost host static sites like Tiiny.host?",
        a: "Yes. Zip your site and host it, or upload a single HTML file. Tiiny.host's developer hosting is more mature, but NudgeHost covers the common cases.",
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
    title: "NudgeHost vs Linkyhost — an honest comparison",
    description:
      "A fair, detailed comparison of NudgeHost and Linkyhost: free plans, pricing, features, and which file-sharing tool suits you.",
    h1: "NudgeHost vs Linkyhost",
    lead: "Two newer tools in the same space. The clearest gap is the free plan: Linkyhost allows a single upload, NudgeHost allows ten.",
    intro: [
      "Linkyhost is a capable file-to-link tool with a clean interface and a sensible $5 entry price. It leans hard into PDF and document sharing, and for a single user with a single file to send, it does the job.",
      "The two tools are closest in spirit of any in this category. Both are newer, both turn files into links, and both build programmatic SEO pages. The differences are in the free plan, the breadth of the product, and the positioning. This page goes through them fairly.",
      "If you would rather just try it, you can {{home}} now.",
    ],
    rows: [
      { feature: "Free plan uploads", nudgehost: "10 active links", competitor: "1 upload total", nudgehostWins: true },
      { feature: "Free plan file size", nudgehost: "25MB", competitor: "10MB", nudgehostWins: true },
      { feature: "Entry paid price", nudgehost: "$8/mo", competitor: "$5/mo" },
      { feature: "Top paid tier price", nudgehost: "$24/mo", competitor: "$16.58/mo" },
      { feature: "QR code on free plan", nudgehost: "Yes", competitor: "No", nudgehostWins: true },
      { feature: "AI-output hosting pages", nudgehost: "Dedicated", competitor: "One use-case page", nudgehostWins: true },
      { feature: "Anonymous publishing", nudgehost: "Planned", competitor: "Account required" },
      { feature: "Product breadth", nudgehost: "Host, view, convert, dev tools", competitor: "Similar" },
      { feature: "Brand personality", nudgehost: "Warm, distinct", competitor: "Utility-style", nudgehostWins: true },
    ],
    verdict: [
      "Pick Linkyhost if the lowest entry price is the deciding factor — $5 beats $8 — and you are happy to upgrade immediately, since the one-upload free plan is not something you can run on.",
      "Pick NudgeHost if you want a free plan you can genuinely use, QR codes without paying, dedicated support for AI-generated outputs, and a product that does not feel like a faceless utility.",
      "Honestly, these two are close, and Linkyhost's lower price is a real point in its favour. NudgeHost's case is the much more usable free tier and the broader toolset. Try it: {{host-pdf}} on the free plan, or see how NudgeHost stacks up against {{compare-tiiny}} as well.",
    ],
    faqs: [
      {
        q: "Is Linkyhost cheaper than NudgeHost?",
        a: "Linkyhost's entry plan is $5 versus NudgeHost's $8. NudgeHost's free plan, however, is far more usable — 10 links and 25MB against a single 10MB upload.",
      },
      {
        q: "Do both tools handle PDFs well?",
        a: "Yes. Both are strong at PDF sharing. NudgeHost also has dedicated viewers, converters, and dev tools around the core hosting.",
      },
      {
        q: "Which has the better free plan?",
        a: "NudgeHost, clearly — ten active links and 25MB per file, versus Linkyhost's single upload capped at 10MB.",
      },
    ],
  },
};
