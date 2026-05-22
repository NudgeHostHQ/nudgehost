import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RelatedTools } from "@/components/related-tools";
import { ContextualProse } from "@/components/contextual-prose";
import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Defaults for Article schema and the visible byline when a spoke page doesn't
// supply its own. Standardizing the author makes spoke pages eligible for the
// author/date treatment AI Overviews show alongside cited sources without
// needing per-page authorship metadata.
const DEFAULT_AUTHOR = "NudgeHost Team";
const DEFAULT_PUBLISHED = "2026-05-22";

// Builds the JSON-LD graph for a spoke page: the silo's primary schema type,
// FAQPage, BreadcrumbList, and Article. Exported so generateMetadata-adjacent
// code or tests can reuse it if needed.
export function buildSpokeJsonLd(content: SpokeContent, silo: SiloConfig) {
  const pageUrl = `${siteUrl}${silo.basePath}/${content.slug}`;
  const author = content.author || DEFAULT_AUTHOR;
  const datePublished = content.datePublished || DEFAULT_PUBLISHED;
  const dateModified = content.dateModified || datePublished;

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": silo.schemaType,
      name: `NudgeHost ${content.name}`,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: silo.hubLabel,
          item: `${siteUrl}${silo.basePath}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: content.name,
          item: pageUrl,
        },
      ],
    },
    {
      "@type": "Article",
      headline: content.h1,
      description: content.description,
      url: pageUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
      author: { "@type": "Person", name: author },
      publisher: {
        "@type": "Organization",
        name: "NudgeHost",
        url: siteUrl,
      },
      datePublished,
      dateModified,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function SpokePage({
  content,
  silo,
}: {
  content: SpokeContent;
  silo: SiloConfig;
}) {
  const jsonLd = buildSpokeJsonLd(content, silo);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                <li>
                  <Link href={silo.basePath} className="hover:text-charcoal">
                    {silo.hubLabel}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-charcoal">
                  {content.name}
                </li>
              </ol>
            </nav>

            <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {content.h1}
            </h1>
            <p className="mb-3 max-w-2xl text-lg leading-relaxed text-muted">
              {content.lead}
            </p>

            {/* Byline — gated by silo so it appears on use-case (and future
                blog) pages, the page types most likely to be cited by AI
                Overviews. E-E-A-T signal per Google's May 2026 AI search
                guide. Author and date fall back to defaults when the entry
                doesn't supply its own. */}
            {silo.showByline ? (
              <p className="mb-8 text-sm text-muted">
                By{" "}
                <span className="font-medium text-charcoal">
                  {content.author || DEFAULT_AUTHOR}
                </span>
                {" · "}
                <time dateTime={content.datePublished || DEFAULT_PUBLISHED}>
                  {new Date(
                    content.datePublished || DEFAULT_PUBLISHED,
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </p>
            ) : (
              <div className="mb-8" />
            )}

            {silo.heroVariant === "upload" ? (
              <div
                className="cursor-pointer rounded-3xl border-[1.5px] border-dashed border-coral/40 bg-warm px-10 py-10 text-center transition-all hover:bg-[#FFFBF7]"
                role="button"
                tabIndex={0}
                aria-label={`Use the ${content.name} tool`}
              >
                <div
                  className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-coral-light text-2xl"
                  style={{ height: "52px", width: "52px" }}
                  aria-hidden="true"
                >
                  📂
                </div>
                <strong className="block text-lg font-medium text-charcoal">
                  Drop your file here
                </strong>
                <p className="mt-1 text-sm text-muted">or click to browse</p>
                {content.filePillExamples && content.filePillExamples.length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {content.filePillExamples.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-charcoal/10 bg-cream px-3 py-1 text-xs font-medium text-muted"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-up"
                className="inline-block rounded-full bg-coral px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
              >
                Get started free
              </Link>
            )}
          </div>
        </section>

        {/* KEY POINTS / TL;DR — short factual summary near the top, optional.
            Used by readers in a hurry and likely to be cited verbatim by AI
            Overviews. Per Google's May 2026 guide, this is a single short
            summary block — NOT a "chunked" page, which Google explicitly
            warns against. Only renders when content.keyPoints is supplied. */}
        {content.keyPoints && content.keyPoints.length > 0 && (
          <section
            className="mx-auto max-w-3xl px-6 pb-4 pt-8"
            aria-label="Key points"
          >
            <div className="rounded-2xl border border-sage/30 bg-sage-light/40 p-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sage-dark">
                Key points
              </h2>
              <ul className="space-y-2">
                {content.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-charcoal/85">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* INLINE CTA — subtle nudge inside the article flow, not an ad block */}
        <section className="mx-auto max-w-3xl px-6 pt-8">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-cream px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-base text-charcoal/85">
              Drop your {content.filetypeShort || content.name} here and get a link in seconds.
            </p>
            <Link
              href="/"
              className="inline-block flex-shrink-0 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              Try it free
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS — opt-in 3-step card row, currently use-cases only.
            Sits between the inline CTA and the body prose so it reinforces
            the "this is how the flow works" promise before the long copy. */}
        {silo.showHowItWorks && (
          <section
            className="mx-auto max-w-5xl px-6 pt-12"
            aria-labelledby="how-it-works-heading"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
              How it works
            </p>
            <h2
              id="how-it-works-heading"
              className="mb-10 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
            >
              Three steps, then you&apos;re done.
            </h2>
            <ol className="grid gap-5 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: "Upload your file",
                  desc: "Drag and drop, or click to browse. Any format, any file up to 25MB on the free plan.",
                },
                {
                  num: "02",
                  title: "Get your link",
                  desc: "A clean nudgehost.com URL appears the moment the upload finishes. Copy it in one click.",
                },
                {
                  num: "03",
                  title: "Share it",
                  desc: "Paste the link in an email, in Slack, anywhere. The recipient clicks and opens your file.",
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
                  <p className="text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* BODY COPY — {{token}} markers become in-prose contextual links */}
        <section className="mx-auto max-w-3xl px-6 py-12">
          <ContextualProse paragraphs={content.body} salt={content.slug} />
        </section>

        {/* FEATURE CARDS — opt-in 3-card benefit grid, currently use-cases
            only. Sits between body prose and FAQs so the visual lift comes
            after the SEO copy has done its work. */}
        {silo.showFeatureCards && (
          <section
            className="mx-auto max-w-5xl px-6 pb-12 pt-4"
            aria-labelledby="feature-cards-heading"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">
              What every link does
            </p>
            <h2
              id="feature-cards-heading"
              className="mb-10 max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
            >
              Designed to be shared.
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: "📊",
                  title: "Open tracking",
                  desc: "Know when someone opens your link, how many times, and roughly from where.",
                },
                {
                  icon: "🌐",
                  title: "No download needed",
                  desc: "Recipients open your file in the browser. No app, no plugin, no Acrobat install.",
                },
                {
                  icon: "🔄",
                  title: "Update anytime",
                  desc: "Replace the file in your dashboard and the URL stays the same. Same link, new content.",
                },
              ].map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-3xl bg-cream p-6 transition-transform hover:-translate-y-0.5"
                >
                  <div className="mb-4 text-2xl" aria-hidden="true">
                    {feature.icon}
                  </div>
                  <h3 className="mb-1.5 font-display text-base font-semibold text-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.desc}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <ul className="space-y-3">
            {content.faqs.map((faq, i) => (
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

        {/* NEWSLETTER — lightweight email capture, UI only (no backend wired) */}
        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-cream px-6 py-10 text-center md:px-10">
            <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">
              Get file-sharing tips that actually help.
            </h2>
            <p className="mb-6 text-sm text-muted">
              One email a month. No spam, no fluff.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-full border border-charcoal/10 bg-white px-5 py-3 text-sm text-charcoal placeholder:text-muted focus:border-coral focus:outline-none"
              />
              <button
                type="button"
                className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* RELATED TOOLS — navigational cross-silo links */}
        <RelatedTools tools={content.relatedToolSlugs as never[]} />

        {/* CTA — switches between standard and prominent variants depending
            on silo.prominentCta. Use-cases silo gets the bigger treatment. */}
        {silo.prominentCta ? (
          <section className="bg-coral px-6 py-20 text-center text-white md:py-24">
            <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Ready to {silo.ctaVerb}?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base opacity-90 md:text-lg">
              Free forever, no credit card. The whole thing takes a few
              seconds, and the link works the moment you have it.
            </p>
            <Link
              href="/sign-up"
              className="inline-block rounded-full bg-white px-8 py-4 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95 md:text-lg"
            >
              Get started free
            </Link>
          </section>
        ) : (
          <section className="bg-coral px-6 py-16 text-center text-white">
            <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
              Ready to {silo.ctaVerb}?
            </h2>
            <p className="mb-8 text-base opacity-90">
              Free forever, no credit card needed. The whole thing takes a few seconds.
            </p>
            <Link
              href="/sign-up"
              className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
            >
              Get started free
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
