import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RelatedTools } from "@/components/related-tools";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BodyProse } from "@/components/ui/prose";
import { FaqAccordions } from "@/components/ui/faq";
import { CtaSection } from "@/components/ui/cta-section";
import { interactiveCardClass } from "@/components/ui/card";
import { glossaryContentMap, type GlossaryContent } from "@/lib/glossary-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

const GLOSSARY_AUTHOR = "Mark Boreland";
const GLOSSARY_DATE = "2026-05-25";

// JSON-LD for a glossary term: Article (with author + dates for AI-citation
// surfaces), FAQPage, and BreadcrumbList.
export function buildGlossaryJsonLd(content: GlossaryContent) {
  const pageUrl = `${siteUrl}/glossary/${content.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: content.h1,
        description: content.metaDescription,
        url: pageUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        author: { "@type": "Person", name: GLOSSARY_AUTHOR },
        publisher: { "@type": "Organization", name: "NudgeHost", url: siteUrl },
        datePublished: GLOSSARY_DATE,
        dateModified: GLOSSARY_DATE,
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
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
            name: "Glossary",
            item: `${siteUrl}/glossary`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: content.term,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function GlossaryPage({ content }: { content: GlossaryContent }) {
  const jsonLd = buildGlossaryJsonLd(content);

  // Resolve related glossary terms to their display names, skipping any that
  // are not in the map so a stray slug can never render a broken link.
  const related = content.relatedTerms
    .map((slug) => glossaryContentMap[slug])
    .filter(Boolean);

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
                  <Link href="/glossary" className="hover:text-charcoal">
                    Glossary
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-charcoal">
                  {content.term}
                </li>
              </ol>
            </nav>

            <div className="mb-4">
              <Eyebrow>Glossary</Eyebrow>
            </div>
            <h1 className="mb-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-5xl">
              {content.h1}
            </h1>
            <p className="mb-8 text-sm text-muted">
              By <span className="font-medium text-charcoal">{GLOSSARY_AUTHOR}</span>
              {" · "}
              <time dateTime={GLOSSARY_DATE}>
                {new Date(GLOSSARY_DATE).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>

            {/* TL;DR */}
            <div className="rounded-2xl border border-sage/30 bg-sage-light/40 p-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sage-dark">
                In short
              </h2>
              <ul className="space-y-2">
                {content.tldr.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm leading-relaxed text-charcoal/85"
                  >
                    <span
                      className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <BodyProse paragraphs={content.body} salt={content.slug} />
        </section>

        {/* RELATED TERMS */}
        {related.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 py-8">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
              Related terms
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/glossary/${t.slug}`}
                    className={`flex h-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-charcoal ${interactiveCardClass}`}
                  >
                    {t.term}
                    <span className="text-coral" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <FaqAccordions
            items={content.faqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            }))}
          />
        </section>

        {/* RELATED TOOLS */}
        <RelatedTools tools={content.relatedToolSlugs as never[]} />

        {/* CTA */}
        <CtaSection
          heading="Put it into practice."
          text="Drop a file and get a shareable link in seconds. Free, no card needed."
          href="/"
          label="Share a file now"
        />
      </main>
      <Footer />
    </>
  );
}
