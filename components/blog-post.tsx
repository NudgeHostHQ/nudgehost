import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RelatedTools } from "@/components/related-tools";
import { ContextualProse } from "@/components/contextual-prose";
import type { BlogPost as BlogPostContent } from "@/lib/blog-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

// Article (with author + dates for AI-citation surfaces), FAQPage, and
// BreadcrumbList for a blog post.
export function buildBlogJsonLd(post: BlogPostContent) {
  const pageUrl = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.h1,
        description: post.metaDescription,
        url: pageUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: "NudgeHost", url: siteUrl },
        datePublished: post.publishedDate,
        dateModified: post.modifiedDate,
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
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
            name: "Blog",
            item: `${siteUrl}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function BlogPostPage({ post }: { post: BlogPostContent }) {
  const jsonLd = buildBlogJsonLd(post);
  // Body is one string; split on blank lines into paragraphs for ContextualProse.
  const paragraphs = post.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
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
                  <Link href="/blog" className="hover:text-charcoal">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-charcoal">
                  {post.h1}
                </li>
              </ol>
            </nav>

            <h1 className="mb-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {post.h1}
            </h1>
            <p className="mb-8 text-sm text-muted">
              By <span className="font-medium text-charcoal">{post.author}</span>
              {" · "}
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString("en-GB", {
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
              <p className="text-sm leading-relaxed text-charcoal/85">{post.tldr}</p>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <ContextualProse paragraphs={paragraphs} salt={post.slug} />
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <ul className="space-y-3">
            {post.faqs.map((faq, i) => (
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

        {/* RELATED TOOLS */}
        <RelatedTools tools={post.relatedToolSlugs as never[]} />

        {/* CTA */}
        <section className="bg-coral px-6 py-16 text-center text-white">
          <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
            Try it yourself.
          </h2>
          <p className="mb-8 text-base opacity-90">
            Drop a file and get a shareable link in seconds. Free, no card needed.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
          >
            Share a file now
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
