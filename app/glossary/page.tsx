import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { bodyLinkClass } from "@/components/ui/prose";
import { interactiveCardClass } from "@/components/ui/card";
import { FaqAccordions } from "@/components/ui/faq";
import { glossaryContentMap } from "@/lib/glossary-content";
import { pageOpenGraph } from "@/lib/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export const metadata: Metadata = {
  title: "File Sharing Glossary: plain-English definitions",
  description:
    "Plain definitions of the terms behind file sharing and hosting: static sites, CDNs, MIME types, presigned URLs, link expiry, and more. Each one tied to practice.",
  alternates: { canonical: "/glossary" },
  openGraph: pageOpenGraph("/glossary"),
};

const hubFaqs = [
  {
    question: "What is this glossary for?",
    answer:
      "It explains the technical terms behind file sharing and hosting in plain language, and ties each one to how NudgeHost handles it in practice.",
  },
  {
    question: "Do I need to understand any of this to share a file?",
    answer:
      "No. You can drop a file and get a link without reading a word here. The glossary is for when you want to know what is happening underneath.",
  },
  {
    question: "How are the terms connected?",
    answer:
      "Every entry links to a few related terms and to the tools they relate to, so you can follow a thread from a definition straight to something you can use.",
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
          name: "Glossary",
          item: `${siteUrl}/glossary`,
        },
      ],
    },
  ],
};

const terms = Object.values(glossaryContentMap);

export default function GlossaryHub() {
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
              Glossary
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
            File Sharing Glossary
          </h1>
          <p className={`text-lg leading-relaxed text-muted ${bodyLinkClass}`}>
            Plain definitions of the words that come up when you share files
            online, covering the formats, the security, and the plumbing that
            makes a link work. Each entry stays short and ties back to something
            practical, like why a page you{" "}
            <Link href="/host/html">host as an HTML file</Link> loads fast, or
            why every link is secure by default. If you would rather just get
            going, you can <Link href="/">drop a file and get a link</Link>, and
            the <Link href="/pricing">paid plans</Link> add custom domains and
            larger files when you need them.
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {terms.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/glossary/${t.slug}`}
                className={`group block h-full p-6 ${interactiveCardClass}`}
              >
                <h2 className="font-display text-base font-semibold text-charcoal transition-colors group-hover:text-coral-dark">
                  {t.term}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {t.tldr[0]}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-16" aria-labelledby="glossary-faq">
          <h2
            id="glossary-faq"
            className="mb-8 font-display text-2xl font-semibold tracking-tight"
          >
            About this glossary
          </h2>
          <FaqAccordions items={hubFaqs} />
        </section>
      </main>
      <Footer />
    </>
  );
}
