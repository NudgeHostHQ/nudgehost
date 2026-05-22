import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Pricing: free forever, then Pro at $8",
  description:
    "Three simple plans. Free forever for 10 active links at 25MB each. Pro at $8/month adds unlimited links, custom domains, and password protection.",
  alternates: { canonical: "/pricing" },
};

// JSON-LD: SoftwareApplication with a multi-tier Offer list. Helps Google
// render pricing-aware SERP cards and gives AI Overviews structured price data.
const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NudgeHost",
  applicationCategory: "WebApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "8",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "8",
        priceCurrency: "USD",
        unitText: "month",
      },
    },
    {
      "@type": "Offer",
      name: "Team",
      price: "24",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "24",
        priceCurrency: "USD",
        unitText: "month",
      },
    },
  ],
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    pitch: "For personal projects, side hustles, and trying things out.",
    cta: { label: "Get started free", href: "/sign-up" },
    featured: false,
    features: [
      "10 active links",
      "25MB per file",
      "Basic open analytics",
      "QR code on every link",
      "nudgehost.com subdomain",
      "No visitor caps, ever",
    ],
  },
  {
    name: "Pro",
    price: "$8",
    period: "per month",
    pitch: "For freelancers and small teams who share files every day.",
    cta: { label: "Start free trial", href: "/sign-up?plan=pro" },
    featured: true,
    features: [
      "Unlimited active links",
      "250MB per file",
      "Full analytics with CSV export",
      "Password protection on any link",
      "Custom domain support",
      "No NudgeHost branding on links",
      "Same URL on file updates",
    ],
  },
  {
    name: "Team",
    price: "$24",
    period: "per month",
    pitch: "For agencies and small teams sharing on behalf of clients.",
    cta: { label: "Try Team free", href: "/sign-up?plan=team" },
    featured: false,
    features: [
      "Everything in Pro",
      "1GB per file",
      "5 team seats included",
      "API access for automation",
      "Priority support response",
      "Shared link dashboard",
    ],
  },
];

type ComparisonRow = {
  feature: string;
  free: string;
  pro: string;
  team: string;
};

const comparison: ComparisonRow[] = [
  { feature: "Active links", free: "10", pro: "Unlimited", team: "Unlimited" },
  { feature: "File size limit", free: "25MB", pro: "250MB", team: "1GB" },
  { feature: "Visitor caps", free: "None", pro: "None", team: "None" },
  { feature: "Open analytics", free: "Basic", pro: "Full + exports", team: "Full + exports" },
  { feature: "QR code on every link", free: "Yes", pro: "Yes", team: "Yes" },
  { feature: "Password protection", free: "No", pro: "Yes", team: "Yes" },
  { feature: "Link expiry control", free: "Yes", pro: "Yes", team: "Yes" },
  { feature: "Custom domain", free: "No", pro: "Yes", team: "Yes" },
  { feature: "NudgeHost branding removed", free: "No", pro: "Yes", team: "Yes" },
  { feature: "Same URL on file update", free: "Yes", pro: "Yes", team: "Yes" },
  { feature: "Team seats", free: "1", pro: "1", team: "5" },
  { feature: "API access", free: "No", pro: "No", team: "Yes" },
  { feature: "Priority support", free: "No", pro: "No", team: "Yes" },
];

const faqs = [
  {
    q: "Is the free plan really free, with no time limit?",
    a: "Yes. The free plan stays free for as long as you want. 10 active links, 25MB per file, no expiry on your links unless you set one. No credit card required at signup.",
  },
  {
    q: "Can I cancel a paid plan anytime?",
    a: "Yes. Cancel from your dashboard at any point. Your account drops back to the free tier at the end of the billing cycle, and your existing links keep working as long as you stay within the free plan limits.",
  },
  {
    q: "What happens to my links if I downgrade?",
    a: "Your links keep working. If you go over the free plan's 10-link or 25MB limit, the oldest links move to a read-only state until you delete some or upgrade back. Nothing gets deleted automatically.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes. Annual plans save you two months. Pro is $80/year (versus $96 paid monthly), Team is $240/year (versus $288). Switch between monthly and annual from your dashboard at any renewal point.",
  },
  {
    q: "Are there discounts for students or nonprofits?",
    a: "Yes. Students with a .edu address and registered nonprofits get 50 percent off Pro. Email hello@nudgehost.com with your verification.",
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-6 py-16">
          <div
            className="absolute -right-32 -top-20 -z-0 h-[400px] w-[400px] rounded-full bg-peach opacity-40"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/" className="hover:text-charcoal">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-charcoal">
                  Pricing
                </li>
              </ol>
            </nav>
            <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Three plans, no traps.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              The free plan is genuinely usable on its own. Pro adds custom
              domains, password protection, and bigger file limits when sharing
              becomes daily work. Team layers on shared seats, API access, and
              priority support for the small group of people doing this together.
            </p>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section
          className="mx-auto max-w-5xl px-6 py-8"
          aria-labelledby="tiers-heading"
        >
          <h2 id="tiers-heading" className="sr-only">
            Pricing tiers
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={
                  "relative rounded-3xl border-[1.5px] bg-warm p-7 transition-transform hover:-translate-y-1 " +
                  (tier.featured ? "border-coral" : "border-charcoal/10")
                }
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </div>
                )}
                <h3 className="mb-1 font-display text-lg font-semibold">
                  {tier.name}
                </h3>
                <p className="mb-1 font-display text-4xl font-semibold tracking-tight">
                  {tier.price}
                  <span className="text-base font-normal text-muted">
                    {" "}/ {tier.period}
                  </span>
                </p>
                <p className="mb-5 text-sm text-muted">{tier.pitch}</p>
                <ul className="mb-6 space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-sage" aria-hidden="true">
                        ✓
                      </span>{" "}
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta.href}
                  className={
                    "block w-full rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors " +
                    (tier.featured
                      ? "bg-coral text-white hover:bg-coral-dark"
                      : "border-[1.5px] border-charcoal/15 text-charcoal hover:border-coral")
                  }
                >
                  {tier.cta.label}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section
          className="mx-auto max-w-5xl px-6 py-12"
          aria-labelledby="compare-heading"
        >
          <h2
            id="compare-heading"
            className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl"
          >
            What&apos;s in each plan
          </h2>
          <p className="mb-8 max-w-2xl text-base text-muted">
            The differences laid out side by side. No asterisks, no hidden
            visitor caps, no plans that change shape next year.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-charcoal/10">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                NudgeHost plan feature comparison
              </caption>
              <thead>
                <tr className="bg-coral-light text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                    Feature
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                    Free
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-coral-dark">
                    Pro
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-warm" : "bg-cream"}
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-medium text-charcoal"
                    >
                      {row.feature}
                    </th>
                    <td className="px-4 py-3 text-charcoal/80">{row.free}</td>
                    <td className="px-4 py-3 font-semibold text-coral-dark">
                      {row.pro}
                    </td>
                    <td className="px-4 py-3 text-charcoal/80">{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ANNUAL */}
        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="rounded-2xl bg-cream px-6 py-8 md:px-10">
            <h2 className="mb-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
              Annual billing saves two months
            </h2>
            <p className="text-base text-muted">
              Pro is $80 per year versus $96 if you pay monthly. Team is $240
              per year versus $288. Switch between monthly and annual from your
              dashboard at any renewal point.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section
          className="mx-auto max-w-3xl px-6 py-12"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="mb-8 font-display text-3xl font-semibold tracking-tight"
          >
            Pricing questions
          </h2>
          <ul className="space-y-3">
            {faqs.map((faq, i) => (
              <li key={i}>
                <details className="group rounded-2xl border border-charcoal/10 bg-warm p-5 transition-colors hover:border-coral/30">
                  <summary className="cursor-pointer list-none font-display text-base font-semibold text-charcoal">
                    <span className="flex items-center justify-between">
                      {faq.q}
                      <span
                        className="ml-3 text-coral transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-coral px-6 py-16 text-center text-white">
          <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
            Start on the free plan.
          </h2>
          <p className="mb-8 text-base opacity-90">
            No card, no expiry, no surprises. Upgrade when (and if) you outgrow
            it.
          </p>
          <Link
            href="/sign-up"
            className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            Get started free
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
