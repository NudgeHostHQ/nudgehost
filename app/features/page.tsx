import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { featuresContentMap } from "@/lib/features-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export const metadata: Metadata = {
  title: "NudgeHost Features | Everything your shared links can do",
  description:
    "The full NudgeHost feature set: update a file without changing the URL, paste HTML to publish, password-protect links, use a custom domain, get rich previews, and more.",
  alternates: { canonical: "/features" },
};

const hubFaqs = [
  {
    question: "What can a NudgeHost link actually do?",
    answer:
      "A link can be updated in place, password-protected, given an expiry, served from your own domain, and unfurled with a rich preview. The file behind it renders full-screen with no account needed to view it.",
  },
  {
    question: "Do I need a paid plan to use these features?",
    answer:
      "Most are free, including public links, the full-screen viewer, live HTML rendering, ZIP-to-site hosting, paste mode, link previews, and the built-in QR code. Password protection and custom domains are on the Pro plan.",
  },
  {
    question: "Where do I turn a feature on?",
    answer:
      "Each link has a settings panel in your dashboard. Password, expiry, custom slug, and file replacement all live there. Public viewing, rendering, and previews are on by default.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: hubFaqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Features",
          item: `${siteUrl}/features`,
        },
      ],
    },
  ],
};

const features = Object.values(featuresContentMap);

const linkClass =
  "font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 hover:decoration-coral";

export default function FeaturesHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-charcoal">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">
              Features
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            NudgeHost Features
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            A NudgeHost link is more than a place a file sits. You can{" "}
            <Link href="/features/link-updating" className={linkClass}>
              swap the file without changing the URL
            </Link>
            , skip the file dialog entirely and{" "}
            <Link href="/features/paste-html" className={linkClass}>
              paste HTML directly
            </Link>{" "}
            to publish, and{" "}
            <Link href="/features/password-protection" className={linkClass}>
              lock a link with a password
            </Link>{" "}
            when it is not for everyone. Each feature below has its own page with
            the detail on how it works and when to reach for it.
          </p>
        </header>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.slug}>
              <Link
                href={`/features/${f.slug}`}
                className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-sm"
              >
                <h2 className="font-display text-base font-semibold text-charcoal">
                  {f.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {f.keyPoints?.[0] ?? f.lead}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16" aria-labelledby="features-faq">
          <h2
            id="features-faq"
            className="mb-8 font-display text-2xl font-semibold tracking-tight"
          >
            About these features
          </h2>
          <ul className="space-y-3">
            {hubFaqs.map((faq, i) => (
              <li key={i}>
                <details className="group rounded-2xl border border-charcoal/10 bg-warm p-5 transition-colors hover:border-coral/30">
                  <summary className="cursor-pointer list-none font-display text-base font-semibold text-charcoal">
                    <span className="flex items-center justify-between">
                      {faq.question}
                      <span
                        className="ml-3 text-coral transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
