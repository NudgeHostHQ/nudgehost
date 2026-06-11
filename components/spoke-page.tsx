import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RelatedTools } from "@/components/related-tools";
import { UploadWidget } from "@/components/upload-widget";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BodyProse } from "@/components/ui/prose";
import { FaqAccordions } from "@/components/ui/faq";
import { CtaSection } from "@/components/ui/cta-section";
import { btnPrimary, btnOnGradient } from "@/components/ui/button";
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

  // A SoftwareApplication entry used to lead this graph (per silo.schemaType),
  // but Google requires aggregateRating or review for the Software App rich
  // result and NudgeHost has no genuine reviews yet. Emitting it without a
  // rating only produced a validation error and no rich result, so it is
  // removed. Re-add a SoftwareApplication block with a real aggregateRating
  // once authentic reviews exist. Article, FAQPage, and BreadcrumbList below
  // already validate on their own.
  const graph: Array<Record<string, unknown>> = [
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
  // Per-page override wins over the silo default. Lets a single page in a
  // silo opt into (or out of) the upload widget without changing the silo.
  const heroVariant = content.heroVariant ?? silo.heroVariant;

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

            <div className="mb-4">
              <Eyebrow>{silo.hubLabel}</Eyebrow>
            </div>
            <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
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

            {heroVariant === "upload" ? (
              <UploadWidget pills={content.filePillExamples} />
            ) : (
              <Link href="/sign-up" className={`${btnPrimary} px-7 py-3.5 text-base`}>
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
            <div className="relative overflow-hidden rounded-xl border border-line bg-white p-7 shadow-sm">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-coral"
              />
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-coral-dark">
                Key points
              </h2>
              <ul className="space-y-2">
                {content.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* BODY COPY — {{token}} markers become in-prose contextual links */}
        <section className="mx-auto max-w-3xl px-6 pt-12">
          <BodyProse paragraphs={content.body} salt={content.slug} />
        </section>

        {/* INLINE CTA — a deliberate break in the reading flow, sitting between
            the body copy and the FAQs. my-16 gives it room top and bottom. */}
        <section className="mx-auto max-w-3xl px-6 my-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl bg-[linear-gradient(120deg,#E8704A,#C4522E)] px-8 py-7 text-white shadow-[0_14px_36px_rgba(196,82,46,0.25)]">
            <p className="text-base text-white">
              Drop a file here and get a shareable link in seconds.
            </p>
            <Link href="/" className={`ml-auto shrink-0 ${btnOnGradient} px-5 py-2.5 text-sm`}>
              Try it free
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <FaqAccordions
            items={content.faqs.map((f) => ({ question: f.q, answer: f.a }))}
          />
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
                className="flex-1 rounded-full border border-line bg-white px-5 py-3 text-sm text-charcoal placeholder:text-muted focus:border-coral focus:outline-none"
              />
              <button type="button" className={`${btnPrimary} px-6 py-3 text-sm`}>
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* RELATED TOOLS — navigational cross-silo links */}
        <RelatedTools tools={content.relatedToolSlugs as never[]} />

        {/* CTA */}
        <CtaSection
          heading={`Ready to ${silo.ctaVerb}?`}
          text="Free forever, no credit card needed. The whole thing takes a few seconds."
          href="/sign-up"
          label="Get started free"
        />
      </main>
      <Footer />
    </>
  );
}
