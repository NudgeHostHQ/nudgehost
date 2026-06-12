import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PlanButton } from "@/components/plan-button";
import { PlanCard } from "@/components/ui/plan-card";
import { FaqAccordions } from "@/components/ui/faq";
import { CtaSection } from "@/components/ui/cta-section";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "Pricing: free forever, then Pro at $8",
  description:
    "Three simple plans. Free forever for 10 active links at 25MB each. Pro at $8/month adds unlimited links, custom domains, and password protection.",
  alternates: { canonical: "/pricing" },
  openGraph: pageOpenGraph("/pricing"),
};

// SoftwareApplication JSON-LD was removed from this page. Google requires
// aggregateRating or review for the Software App rich result, and NudgeHost has
// no genuine reviews yet, so the markup only produced a validation error rather
// than a pricing-aware SERP card. Re-add a SoftwareApplication (with the Offer
// list and a real aggregateRating) once authentic reviews exist.

type Tier = {
  name: string;
  plan: "free" | "pro" | "team";
  price: string;
  period: string;
  pitch: string;
  ctaLabel: string;
  featured: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    plan: "free",
    price: "$0",
    period: "forever",
    pitch: "For personal projects, side hustles, and trying things out.",
    ctaLabel: "Get started free",
    featured: false,
    features: [
      "10 active links",
      "25MB per file",
      "Basic open analytics",
      "QR code on every link",
      "Default nudgehost.com and nudgehost.site links",
      "No visitor caps, ever",
    ],
  },
  {
    name: "Pro",
    plan: "pro",
    price: "$8",
    period: "per month",
    pitch: "For freelancers and small teams who share files every day.",
    ctaLabel: "Upgrade to Pro",
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
    plan: "team",
    price: "$24",
    period: "per month",
    pitch: "For agencies and small teams sharing on behalf of clients.",
    ctaLabel: "Upgrade to Team",
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
    q: "Do I need an account to use NudgeHost?",
    a: "No. You can upload up to 3 files of 25MB each without an account, and those links stay live for 7 days. Create a free account to keep links live forever and get 10 slots.",
  },
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

export default async function PricingPage() {
  // Auth + current plan drive the CTAs: paid users see "Manage billing",
  // signed-in free users go to checkout, guests go to sign-up.
  const { userId } = await auth();
  const signedIn = Boolean(userId);
  let currentPlan = "free";
  if (userId) {
    const [u] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (u) currentPlan = u.plan;
  }

  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const teamPriceId = process.env.STRIPE_TEAM_PRICE_ID;

  return (
    <>
      <Navbar />
      <main>
        <div className="mx-auto max-w-5xl px-6 pt-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex gap-2">
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

          <header className="mb-10 max-w-2xl">
            <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
              Three plans, no traps.
            </h1>
            <p className="text-lg leading-relaxed text-muted">
              The free plan is genuinely usable on its own. Pro adds custom
              domains, password protection, and bigger file limits when sharing
              becomes daily work. Team layers on shared seats, API access, and
              priority support for the small group of people doing this together.
            </p>
          </header>
        </div>

        {/* PRICING CARDS */}
        <section
          className="mx-auto max-w-5xl px-6 py-8"
          aria-labelledby="tiers-heading"
        >
          <h2 id="tiers-heading" className="sr-only">
            Pricing tiers
          </h2>
          <p className="mb-6 text-sm text-muted">
            No account needed to try it. Anonymous links stay live for 7 days,
            free accounts keep links live forever.
          </p>
          <div className="grid items-stretch gap-5 md:grid-cols-3">
            {tiers.map((tier) => (
              <PlanCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                description={tier.pitch}
                features={tier.features}
                featured={tier.featured}
              >
                <PlanButton
                  plan={tier.plan}
                  label={tier.ctaLabel}
                  featured={tier.featured}
                  priceId={
                    tier.plan === "pro"
                      ? proPriceId
                      : tier.plan === "team"
                        ? teamPriceId
                        : undefined
                  }
                  signedIn={signedIn}
                  currentPlan={currentPlan}
                />
              </PlanCard>
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
          <div className="overflow-hidden rounded-xl border border-line shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  NudgeHost plan feature comparison
                </caption>
                <thead>
                  <tr className="text-left text-white">
                    <th scope="col" className="bg-charcoal px-4 py-3.5 font-semibold">
                      Feature
                    </th>
                    <th scope="col" className="bg-charcoal px-4 py-3.5 font-semibold">
                      Free
                    </th>
                    <th scope="col" className="bg-coral px-4 py-3.5 font-semibold">
                      Pro
                    </th>
                    <th scope="col" className="bg-charcoal px-4 py-3.5 font-semibold">
                      Team
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="group border-t border-line">
                      <th
                        scope="row"
                        className="bg-white px-4 py-3 text-left font-semibold text-charcoal transition-colors group-hover:bg-cream"
                      >
                        {row.feature}
                      </th>
                      <td className="bg-white px-4 py-3 text-charcoal/80 transition-colors group-hover:bg-cream">
                        {row.free}
                      </td>
                      <td className="bg-coral-light px-4 py-3 font-semibold text-coral-dark transition-colors group-hover:bg-[#F6DCCF]">
                        {row.pro}
                      </td>
                      <td className="bg-white px-4 py-3 text-charcoal/80 transition-colors group-hover:bg-cream">
                        {row.team}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          <FaqAccordions
            items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
          />
        </section>

        {/* CTA */}
        <CtaSection
          heading="Start on the free plan."
          text="No card, no expiry, no surprises. Upgrade when (and if) you outgrow it."
          href="/sign-up"
          label="Get started free"
        />
      </main>
      <Footer />
    </>
  );
}
