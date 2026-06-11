import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { UploadWidget } from "@/components/upload-widget";
import { AdoptAnonymousFiles } from "@/components/adopt-anonymous-files";
import { ANON_COOKIE_NAME } from "@/lib/anon-upload";
import { CtaSection } from "@/components/ui/cta-section";
import { PlanCard } from "@/components/ui/plan-card";
import { Overline } from "@/components/ui/overline";
import { btnPrimary, btnOutline } from "@/components/ui/button";
import { pageOpenGraph } from "@/lib/og";

// Dashed coral connector arrow drawn between the "how it works" steps on wide
// screens. Hidden below 980px, where the steps stack vertically.
function StepArrow() {
  return (
    <div className="hidden self-start pt-2 min-[980px]:flex" aria-hidden="true">
      <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
        <line
          x1="1"
          y1="8"
          x2="39"
          y2="8"
          stroke="#E8704A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 6"
        />
        <path
          d="M39 3l7 5-7 5"
          stroke="#E8704A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export const metadata: Metadata = {
  title: { absolute: "Share any file as a link in seconds | NudgeHost" },
  description:
    "Drop a file, get a shareable link. The friendliest way to host PDFs, HTML, ZIPs, images, AI-generated outputs. Free forever, 25MB, no card.",
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/"),
};

// JSON-LD for the homepage: FAQPage only. A SoftwareApplication block used to
// lead this graph, but it carried an aggregateRating we cannot substantiate
// with real reviews. Fabricated ratings violate Google's structured-data
// policy, and a SoftwareApplication without a rating fails Software App
// rich-result validation, so it is removed until genuine reviews exist. It can
// be re-added with a real aggregateRating then.
const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is NudgeHost free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The free plan gives you 10 active links and 25MB per file, no card required, no expiry on your links.",
          },
        },
        {
          "@type": "Question",
          name: "What file types can I share?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Any file. PDFs, HTML, ZIPs, images, videos, documents. Drop it in and you get a link back.",
          },
        },
        {
          "@type": "Question",
          name: "Do my links expire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. On the free plan your links stay live as long as you want. Optional expiry is available if you want links to self-destruct.",
          },
        },
      ],
    },
  ],
};

export default async function HomePage() {
  // A leftover anonymous-upload cookie means this visitor may have files to
  // move into their account; the client effect runs only when signed in.
  const hasAnonCookie = (await cookies()).has(ANON_COOKIE_NAME);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      {hasAnonCookie && <AdoptAnonymousFiles />}
      <Navbar />

      <main>
        {/* HERO */}
        <section
          className="relative flex flex-col items-center overflow-hidden px-6 pb-16 pt-20 text-center"
          aria-labelledby="hero-heading"
        >
          {/* Decorative background blobs */}
          <div
            className="absolute -right-32 -top-20 -z-0 h-[520px] w-[520px] rounded-full bg-peach opacity-45"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-24 -z-0 h-[380px] w-[380px] rounded-full bg-sage-light opacity-60"
            aria-hidden="true"
          />

          {/* H1 */}
          <h1
            id="hero-heading"
            className="relative z-10 mb-6 max-w-4xl animate-fade-up text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl"
            style={{ animationDelay: "0.05s" }}
          >
            Give your files a gentle <em className="font-display italic text-coral">nudge.</em>
          </h1>

          <p
            className="relative z-10 mb-8 max-w-lg animate-fade-up text-lg font-semibold leading-relaxed text-muted"
            style={{ animationDelay: "0.1s" }}
          >
            Drop a file, get a link. Share anything in seconds.
          </p>

          {/* Upload widget — the visual hero */}
          <UploadWidget className="relative z-10 animate-fade-up" />

          {/* Live link preview */}
          <div
            className="relative z-10 mt-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-sage/30 bg-sage-light px-4 py-1.5 text-sm font-medium"
            style={{ animationDelay: "0.35s", color: "#3A6E3E" }}
          >
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
            nudgehost.com/your-file ready in seconds
          </div>

          <p
            className="relative z-10 mt-3 animate-fade-up text-sm text-muted"
            style={{ animationDelay: "0.38s" }}
          >
            No account needed. Your first links are free in seconds.
          </p>

          {/* Quiet secondary link — does not compete with the uploader */}
          <Link
            href="#how-it-works"
            className="relative z-10 mt-6 animate-fade-up text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-charcoal hover:underline"
            style={{ animationDelay: "0.4s" }}
          >
            See how it works
          </Link>
        </section>

        {/* SOCIAL PROOF STRIP — trust signal competitors lack */}
        <section className="border-y border-line bg-warm/50 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted">
              Trusted by people sharing files for
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                "Job applications",
                "Client deliverables",
                "AI-generated outputs",
                "Internal team docs",
                "Design portfolios",
                "Research papers",
              ].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center font-display text-[17.5px] italic text-charcoal [&:not(:first-child)]:before:mr-5 [&:not(:first-child)]:before:h-[5px] [&:not(:first-child)]:before:w-[5px] [&:not(:first-child)]:before:rounded-full [&:not(:first-child)]:before:bg-coral [&:not(:first-child)]:before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mx-auto max-w-5xl px-6 py-20"
          aria-labelledby="how-heading"
        >
          <Overline>How it works</Overline>
          <h2
            id="how-heading"
            className="mb-12 max-w-lg font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] md:text-5xl"
          >
            Three steps, then you&apos;re done.
          </h2>

          <div className="grid gap-x-4 gap-y-12 min-[980px]:grid-cols-[1fr_auto_1fr_auto_1fr] min-[980px]:items-start">
            {[
              {
                num: "01",
                title: "Drop your file",
                desc: "Drag and drop whatever you've got. PDFs, websites, images, and ZIPs all work the same way. No configuration needed.",
              },
              {
                num: "02",
                title: "Get your link",
                desc: "Instantly receive a clean, shareable URL. Copy it to your clipboard in one click.",
              },
              {
                num: "03",
                title: "Give the nudge",
                desc: "Send the link to whoever needs it. They click and see your file straight away. Done.",
              },
            ].map((step, i) => (
              <Fragment key={step.num}>
                {i > 0 && <StepArrow />}
                <div>
                  <div className="font-display text-[34px] font-semibold italic leading-none text-coral">
                    {step.num}
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="bg-charcoal px-6 py-20 text-white"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto grid max-w-5xl gap-x-12 gap-y-10 min-[980px]:grid-cols-[380px_1fr]">
            <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
              <Overline onDark>Features</Overline>
              <h2
                id="features-heading"
                className="font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] text-white md:text-5xl"
              >
                Everything you need,
                <br />
                nothing you don&apos;t.
              </h2>
            </div>
            <div>
              {[
                {
                  title: "Instant publishing",
                  desc: "Files go live the moment you drop them. No waiting, no processing queues.",
                },
                {
                  title: "Password protection",
                  desc: "Keep sensitive files private with optional password locks on any link.",
                },
                {
                  title: "Link analytics",
                  desc: "See who's clicking your links and when. Know your nudge landed.",
                },
                {
                  title: "Custom domains",
                  desc: "Use your own domain for a professional touch on every link you share.",
                },
                {
                  title: "Branded links that look like yours",
                  desc: "Pick a slug that makes sense, not a random string. nudgehost.com/your-portfolio reads better than a hash.",
                },
                {
                  title: "Links that don't expire. Ever.",
                  desc: "Tiiny.host kills your free links after 30 days of inactivity. Ours stay live for as long as you need them.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  className="grid grid-cols-1 gap-1 border-t border-cream/[0.12] py-6 min-[640px]:grid-cols-[280px_1fr] min-[640px]:gap-6"
                >
                  <h3 className="font-display text-[20px] font-semibold text-cream">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/60">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASE LINKS — internal linking to JTBD pages */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <Overline>Use cases</Overline>
          <h2 className="mb-3 max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] md:text-4xl">
            For every kind of share.
          </h2>
          <p className="mb-10 max-w-xl text-base text-muted">
            Whatever you&apos;re sending, we&apos;ve probably got a page for that.
          </p>
          <ul className="mx-auto flex max-w-[880px] flex-wrap justify-center gap-3.5">
            {[
              { title: "Share a resume as a link", href: "/use-cases/share-resume-as-link" },
              { title: "Send a portfolio to a recruiter", href: "/use-cases/send-portfolio-to-recruiter" },
              { title: "Host a Claude artifact", href: "/host/claude-artifact" },
              { title: "Share a deck with a client", href: "/use-cases/share-deck-with-client" },
              { title: "Host an HTML file", href: "/host/html" },
              { title: "Send a large PDF without email", href: "/use-cases/send-large-pdf-without-email" },
              { title: "Host a Lovable export", href: "/host/lovable-export" },
              { title: "Share a wedding website", href: "/use-cases/share-wedding-website" },
              { title: "Host a v0 export", href: "/host/v0-export" },
            ].map((uc) => (
              <li key={uc.href}>
                <Link
                  href={uc.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-medium text-charcoal shadow-sm transition-all hover:-translate-y-0.5 hover:border-coral hover:shadow-md"
                >
                  {uc.title}
                  <span
                    className="text-coral transition-transform group-hover:translate-x-[3px]"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="mx-auto max-w-5xl px-6 py-20"
          aria-labelledby="pricing-heading"
        >
          <Overline>Pricing</Overline>
          <h2
            id="pricing-heading"
            className="mb-3 max-w-lg font-display text-3xl font-semibold leading-[1.1] tracking-[-0.01em] md:text-5xl"
          >
            Honest pricing,
            <br />
            no traps.
          </h2>
          <p className="mb-3 max-w-xl text-base text-muted">
            A free plan that&apos;s actually free. Upgrade when you outgrow it.
          </p>
          <p className="mb-10 max-w-xl text-sm text-muted">
            No account needed to try it. Anonymous links stay live for 7 days,
            free accounts keep links live forever.
          </p>

          <div className="grid items-stretch gap-5 md:grid-cols-3">
            <PlanCard
              name="Free"
              price="$0"
              period="forever"
              description="Perfect for personal projects and trying things out."
              featured={false}
              features={[
                "10 active links",
                "25MB per file",
                "Basic analytics",
                "QR code on every link",
                "nudgehost.com subdomain",
              ]}
            >
              <Link href="/sign-up" className={`w-full ${btnOutline} px-5 py-2.5 text-sm`}>
                Get started free
              </Link>
            </PlanCard>

            <PlanCard
              name="Pro"
              price="$8"
              period="month"
              description="For freelancers and teams who share files every day."
              featured
              features={[
                "Unlimited links",
                "250MB per file",
                "Full analytics + exports",
                "Password protection",
                "Custom domain support",
                "No NudgeHost branding",
              ]}
            >
              <Link
                href="/sign-up?plan=pro"
                className={`w-full ${btnPrimary} px-5 py-2.5 text-sm`}
              >
                Upgrade to Pro
              </Link>
            </PlanCard>

            <PlanCard
              name="Team"
              price="$24"
              period="month"
              description="For agencies and small teams sharing on behalf of clients."
              featured={false}
              features={[
                "Everything in Pro",
                "1GB per file",
                "5 team seats",
                "API access",
                "Priority support",
              ]}
            >
              <Link
                href="/sign-up?plan=team"
                className={`w-full ${btnOutline} px-5 py-2.5 text-sm`}
              >
                Upgrade to Team
              </Link>
            </PlanCard>
          </div>
        </section>

        {/* CTA STRIP */}
        <CtaSection
          heading="Ready to give your files a nudge?"
          text="Join thousands of creators, freelancers, and teams sharing smarter."
          href="/sign-up"
          label="Start for free. No card needed."
        />
      </main>

      <Footer />
    </>
  );
}
