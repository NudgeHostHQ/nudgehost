import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BodyProse } from "@/components/ui/prose";
import { FaqAccordions } from "@/components/ui/faq";
import { CtaSection } from "@/components/ui/cta-section";
import { compareContentMap } from "@/lib/compare-content";
import { OG_IMAGE } from "@/lib/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

type Params = { slug: string };

export async function generateStaticParams() {
  return Object.keys(compareContentMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = compareContentMap[slug];
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/compare/${slug}`,
      type: "website",
      images: OG_IMAGE,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const content = compareContentMap[slug];
  if (!content) notFound();

  const leftLabel = content.leftColumnLabel ?? "NudgeHost";
  const rightLabel = content.rightColumnLabel ?? content.competitorName;
  const isNeutral = content.leftColumnLabel != null;
  const fullHeading = `${leftLabel} vs ${rightLabel}`;
  const breadcrumbCurrent = isNeutral ? fullHeading : `vs ${rightLabel}`;
  const verdictHeading = content.verdictHeading ?? "The verdict";

  // JSON-LD: FAQPage + BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    // A SoftwareApplication entry was removed from this graph: Google requires
    // aggregateRating or review for that rich result and NudgeHost has no
    // genuine reviews yet, so it only produced a validation error. Re-add it
    // with a real rating once authentic reviews exist.
    "@graph": [
      {
        "@type": "Article",
        headline: content.h1,
        description: content.description,
        url: `${siteUrl}/compare/${slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteUrl}/compare/${slug}`,
        },
        author: { "@type": "Person", name: "Mark Boreland" },
        publisher: { "@type": "Organization", name: "NudgeHost", url: siteUrl },
        datePublished: "2026-05-25",
        dateModified: "2026-05-25",
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
            name: "Compare",
            item: `${siteUrl}/compare`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: fullHeading,
            item: `${siteUrl}/compare/${slug}`,
          },
        ],
      },
    ],
  };

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
                  <Link href="/compare" className="hover:text-charcoal">
                    Compare
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-charcoal">
                  {breadcrumbCurrent}
                </li>
              </ol>
            </nav>

            <div className="mb-4">
              <Eyebrow>Compare</Eyebrow>
            </div>
            <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
              {content.h1}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              {content.lead}
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <BodyProse paragraphs={content.intro} salt={slug} />
        </section>

        {/* COMPARISON TABLE */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
            Feature by feature
          </h2>
          <div className="overflow-hidden rounded-xl border border-line shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Feature comparison of {leftLabel} and {rightLabel}
                </caption>
                <thead>
                  <tr className="text-left text-white">
                    <th scope="col" className="bg-charcoal px-4 py-3.5 font-semibold">
                      Feature
                    </th>
                    <th
                      scope="col"
                      className={
                        "px-4 py-3.5 font-semibold " +
                        (isNeutral ? "bg-charcoal" : "bg-coral")
                      }
                    >
                      {leftLabel}
                    </th>
                    <th scope="col" className="bg-charcoal px-4 py-3.5 font-semibold">
                      {rightLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.rows.map((row) => (
                    <tr key={row.feature} className="group border-t border-line">
                      <th
                        scope="row"
                        className="bg-white px-4 py-3 text-left font-semibold text-charcoal transition-colors group-hover:bg-cream"
                      >
                        {row.feature}
                      </th>
                      <td
                        className={
                          "px-4 py-3 transition-colors " +
                          (isNeutral
                            ? "bg-white text-charcoal/80 group-hover:bg-cream"
                            : "bg-coral-light font-semibold text-coral-dark group-hover:bg-[#F6DCCF]")
                        }
                      >
                        {row.nudgehost}
                      </td>
                      <td className="bg-white px-4 py-3 text-charcoal/80 transition-colors group-hover:bg-cream">
                        {row.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* VERDICT */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
            {verdictHeading}
          </h2>
          <BodyProse paragraphs={content.verdict} salt={`${slug}-verdict`} />
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <FaqAccordions
            items={content.faqs.map((f) => ({ question: f.q, answer: f.a }))}
          />
        </section>

        {/* CTA */}
        <CtaSection
          heading="See for yourself"
          text="The free plan is genuinely free. Try it before you decide."
          href="/sign-up"
          label="Get started free"
        />
      </main>
      <Footer />
    </>
  );
}
