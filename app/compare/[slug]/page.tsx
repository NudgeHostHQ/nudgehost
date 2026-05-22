import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContextualProse } from "@/components/contextual-prose";
import { compareContentMap } from "@/lib/compare-content";

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
    "@graph": [
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

            <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              {content.h1}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              {content.lead}
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <ContextualProse paragraphs={content.intro} salt={slug} />
        </section>

        {/* COMPARISON TABLE */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
            Feature by feature
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-charcoal/10">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Feature comparison of {leftLabel} and {rightLabel}
              </caption>
              <thead>
                <tr className="bg-coral-light text-left">
                  <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                    Feature
                  </th>
                  <th
                    scope="col"
                    className={
                      "px-4 py-3 font-semibold " +
                      (isNeutral ? "text-charcoal" : "text-coral-dark")
                    }
                  >
                    {leftLabel}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-charcoal">
                    {rightLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row, i) => (
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
                    <td
                      className={
                        "px-4 py-3 " +
                        (row.nudgehostWins
                          ? "font-semibold text-coral-dark"
                          : "text-charcoal/80")
                      }
                    >
                      {row.nudgehost}
                    </td>
                    <td className="px-4 py-3 text-charcoal/80">
                      {row.competitor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* VERDICT */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
            {verdictHeading}
          </h2>
          <ContextualProse paragraphs={content.verdict} salt={`${slug}-verdict`} />
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 py-8">
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

        {/* CTA */}
        <section className="bg-coral px-6 py-16 text-center text-white">
          <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
            See for yourself
          </h2>
          <p className="mb-8 text-base opacity-90">
            The free plan is genuinely free. Try it before you decide.
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
