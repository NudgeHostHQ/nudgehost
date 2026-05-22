import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: { absolute: "Share any file as a link in seconds | NudgeHost" },
  description:
    "Drop a file, get a shareable link. The friendliest way to host PDFs, HTML, ZIPs, images, AI-generated outputs. Free forever, 25MB, no card.",
  alternates: { canonical: "/" },
};

// JSON-LD for the homepage — SoftwareApplication + FAQPage
const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "NudgeHost",
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "127",
      },
    },
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <Navbar />

      <main>
        {/* HERO */}
        <section
          className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
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

          {/* Badge */}
          <div className="relative z-10 mb-7 inline-flex animate-fade-up items-center gap-2 rounded-full bg-coral-light px-3.5 py-1.5 text-xs font-medium text-coral-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" aria-hidden="true" />
            Drop a file and share it. That simple.
          </div>

          {/* H1 */}
          <h1
            id="hero-heading"
            className="relative z-10 mb-5 max-w-3xl animate-fade-up font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
            style={{ animationDelay: "0.05s" }}
          >
            Give your files <br className="hidden md:inline" />
            a gentle <em className="font-display italic text-coral">nudge.</em>
          </h1>

          <p
            className="relative z-10 mb-9 max-w-lg animate-fade-up text-lg leading-relaxed text-muted"
            style={{ animationDelay: "0.1s" }}
          >
            Drop a file, get a link, share it instantly. The simplest way to host
            and share anything online.
          </p>

          {/* CTAs */}
          <div
            className="relative z-10 flex animate-fade-up flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "0.15s" }}
          >
            <Link
              href="/sign-up"
              className="rounded-full bg-coral px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              Start nudging. It&apos;s free.
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border-[1.5px] border-charcoal/15 bg-transparent px-7 py-3 text-base font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:border-coral"
            >
              See how it works →
            </Link>
          </div>

          {/* Upload demo */}
          <div
            className="relative z-10 mt-14 w-full max-w-xl animate-fade-up cursor-pointer rounded-3xl border-[1.5px] border-dashed border-coral/40 bg-warm px-10 py-10 transition-all hover:bg-[#FFFBF7]"
            style={{ animationDelay: "0.2s" }}
            role="button"
            tabIndex={0}
            aria-label="Upload your file"
          >
            <div
              className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-coral-light text-2xl"
              style={{ height: "52px", width: "52px" }}
              aria-hidden="true"
            >
              📂
            </div>
            <strong className="block text-lg font-medium text-charcoal">
              Drop your file here
            </strong>
            <p className="mt-1 text-sm text-muted">or click to browse</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["PDF", "HTML", "ZIP", "Image", "Any file"].map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-charcoal/10 bg-cream px-3 py-1 text-xs font-medium text-muted"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Live link preview */}
          <div
            className="relative z-10 mt-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-sage/30 bg-sage-light px-4 py-1.5 text-sm font-medium"
            style={{ animationDelay: "0.35s", color: "#3A6E3E" }}
          >
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
            nudgehost.com/your-file ready in seconds
          </div>
        </section>

        {/* SOCIAL PROOF STRIP — trust signal competitors lack */}
        <section className="border-y border-charcoal/5 bg-warm/50 py-10">
          <div className="mx-auto max-w-5xl px-6">
            <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted">
              Trusted by people sharing files for
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-muted">
              <li>Job applications</li>
              <li>Client deliverables</li>
              <li>AI-generated outputs</li>
              <li>Internal team docs</li>
              <li>Design portfolios</li>
              <li>Research papers</li>
            </ul>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mx-auto max-w-5xl px-6 py-20"
          aria-labelledby="how-heading"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mb-12 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Three steps, then you&apos;re done.
          </h2>

          <ol className="grid gap-5 md:grid-cols-3">
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
            ].map((step) => (
              <li
                key={step.num}
                className="rounded-3xl border border-charcoal/10 bg-warm p-7 transition-transform hover:-translate-y-1"
              >
                <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-xl bg-coral-light text-sm font-semibold text-coral-dark">
                  {step.num}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FEATURES */}
        <section
          className="bg-charcoal px-6 py-20 text-white"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
              Features
            </p>
            <h2
              id="features-heading"
              className="mb-12 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl"
            >
              Everything you need,
              <br />
              nothing you don&apos;t.
            </h2>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Instant publishing",
                  desc: "Files go live the moment you drop them. No waiting, no processing queues.",
                },
                {
                  icon: "🔒",
                  title: "Password protection",
                  desc: "Keep sensitive files private with optional password locks on any link.",
                },
                {
                  icon: "📊",
                  title: "Link analytics",
                  desc: "See who's clicking your links and when. Know your nudge landed.",
                },
                {
                  icon: "🌐",
                  title: "Custom domains",
                  desc: "Use your own domain for a professional touch on every link you share.",
                },
                {
                  icon: "🔗",
                  title: "Branded links that look like yours",
                  desc: "Pick a slug that makes sense, not a random string. nudgehost.com/your-portfolio reads better than a hash.",
                },
                {
                  icon: "♾️",
                  title: "Links that don't expire. Ever.",
                  desc: "Tiiny.host kills your free links after 30 days of inactivity. Ours stay live for as long as you need them.",
                },
              ].map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-coral/40"
                >
                  <div className="mb-4 text-2xl" aria-hidden="true">
                    {feature.icon}
                  </div>
                  <h3 className="mb-1.5 font-display text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">
                    {feature.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* USE CASE LINKS — internal linking to JTBD pages */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
            Use cases
          </p>
          <h2 className="mb-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            For every kind of share.
          </h2>
          <p className="mb-10 max-w-xl text-base text-muted">
            Whatever you&apos;re sending, we&apos;ve probably got a page for that.
          </p>
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
                  className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-warm px-5 py-4 text-sm font-medium text-charcoal transition-all hover:-translate-y-0.5 hover:border-coral/40"
                >
                  {uc.title}
                  <span className="text-coral" aria-hidden="true">→</span>
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
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
            Pricing
          </p>
          <h2
            id="pricing-heading"
            className="mb-3 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Honest pricing,
            <br />
            no traps.
          </h2>
          <p className="mb-10 max-w-xl text-base text-muted">
            A free plan that&apos;s actually free. Upgrade when you outgrow it.
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border-[1.5px] border-charcoal/10 bg-warm p-7 transition-transform hover:-translate-y-1">
              <h3 className="mb-1 font-display text-lg font-semibold">Free</h3>
              <p className="mb-1 font-display text-4xl font-semibold tracking-tight">
                $0 <span className="text-base font-normal text-muted">/ forever</span>
              </p>
              <p className="mb-5 text-sm text-muted">
                Perfect for personal projects and trying things out.
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> 10 active links
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> 25MB per file
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Basic analytics
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> QR code on every link
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> nudgehost.com subdomain
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full rounded-full border-[1.5px] border-charcoal/15 px-5 py-2.5 text-center text-sm font-medium text-charcoal transition-colors hover:border-coral"
              >
                Get started free
              </Link>
            </article>

            <article className="relative rounded-3xl border-[1.5px] border-coral bg-warm p-7 transition-transform hover:-translate-y-1">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-3 py-1 text-xs font-medium text-white">
                Most popular
              </div>
              <h3 className="mb-1 font-display text-lg font-semibold">Pro</h3>
              <p className="mb-1 font-display text-4xl font-semibold tracking-tight">
                $8 <span className="text-base font-normal text-muted">/ month</span>
              </p>
              <p className="mb-5 text-sm text-muted">
                For freelancers and teams who share files every day.
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Unlimited links
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> 250MB per file
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Full analytics + exports
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Password protection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Custom domain support
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> No NudgeHost branding
                </li>
              </ul>
              <Link
                href="/sign-up?plan=pro"
                className="block w-full rounded-full bg-coral px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-coral-dark"
              >
                Start free trial
              </Link>
            </article>

            <article className="rounded-3xl border-[1.5px] border-charcoal/10 bg-warm p-7 transition-transform hover:-translate-y-1">
              <h3 className="mb-1 font-display text-lg font-semibold">Team</h3>
              <p className="mb-1 font-display text-4xl font-semibold tracking-tight">
                $24 <span className="text-base font-normal text-muted">/ month</span>
              </p>
              <p className="mb-5 text-sm text-muted">
                For agencies and small teams sharing on behalf of clients.
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Everything in Pro
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> 1GB per file
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> 5 team seats
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> API access
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage" aria-hidden="true">✓</span> Priority support
                </li>
              </ul>
              <Link
                href="/sign-up?plan=team"
                className="block w-full rounded-full border-[1.5px] border-charcoal/15 px-5 py-2.5 text-center text-sm font-medium text-charcoal transition-colors hover:border-coral"
              >
                Try Team free
              </Link>
            </article>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="bg-coral px-6 py-20 text-center text-white">
          <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Ready to give your files a nudge?
          </h2>
          <p className="mb-8 text-base opacity-90">
            Join thousands of creators, freelancers, and teams sharing smarter.
          </p>
          <Link
            href="/sign-up"
            className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            Start for free. No card needed.
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
