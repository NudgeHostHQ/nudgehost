import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RelatedTools, TOOL_REGISTRY } from "@/components/related-tools";
import { ContextualProse, renderTokens } from "@/components/contextual-prose";
import { BlogBlocks, BlogFaqList, BottomCta } from "@/components/blog-blocks";
import type {
  BlogPost as BlogPostContent,
  ContentBlock,
  SidebarLink,
  TocEntry,
} from "@/lib/blog-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

const pillarLabel: Record<string, string> = {
  "ai-publishing": "AI Publishing",
  "sharing-files": "Sharing Files",
  "hosting-vs-cloud": "Hosting",
};

// Sidebar use-case links shown when a post defines none of its own.
const DEFAULT_USE_CASES: SidebarLink[] = [
  { label: "Share a resume as a link", href: "/use-cases/share-resume-as-link" },
  {
    label: "Send a portfolio to a recruiter",
    href: "/use-cases/send-portfolio-to-recruiter",
  },
  { label: "Share a deck with a client", href: "/use-cases/share-deck-with-client" },
  {
    label: "Send a large PDF without email",
    href: "/use-cases/send-large-pdf-without-email",
  },
];

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
        author: {
          "@type": "Person",
          name: post.author,
          url: `${siteUrl}/about`,
        },
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

// Collect every prose string in a body so read time can be estimated.
function bodyText(body: string | ContentBlock[]): string {
  if (typeof body === "string") return body;
  const parts: string[] = [];
  for (const b of body) {
    switch (b.type) {
      case "prose":
      case "h2":
      case "h3":
        parts.push(b.text);
        break;
      case "steps":
        b.items.forEach((s) => parts.push(s.title, s.desc));
        break;
      case "compare":
        b.rows.forEach((r) => parts.push(...r.cells));
        break;
      case "testimonial":
        parts.push(b.text, b.attribution ?? "");
        break;
      case "cta":
      case "bottom-cta":
        parts.push(b.title, b.text);
        break;
      case "screenshot":
        parts.push(b.alt, b.caption ?? "");
        break;
      case "related":
        b.items.forEach((it) => parts.push(it.title, it.desc));
        break;
      case "faq":
        b.items.forEach((f) => parts.push(f.q, f.a));
        break;
    }
  }
  return parts.join(" ");
}

function readTimeMinutes(post: BlogPostContent): number {
  const text = `${post.tldr} ${bodyText(post.body)}`.replace(
    /\{\{([a-z0-9-]+)(?:\|([^}]*))?\}\}/g,
    (_, key, anchor) => anchor ?? key
  );
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-GB", opts);
}

export function BlogPostPage({ post }: { post: BlogPostContent }) {
  const jsonLd = buildBlogJsonLd(post);
  const isBlocks = Array.isArray(post.body);

  // Legacy string body: split into paragraphs for ContextualProse.
  const legacyParagraphs =
    typeof post.body === "string"
      ? post.body
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

  // Table of contents: explicit per-post labels when given, else auto-generated
  // from the h2 blocks.
  const toc: TocEntry[] =
    post.sidebar?.toc ??
    (isBlocks
      ? (post.body as ContentBlock[]).flatMap((b) =>
          b.type === "h2" ? [{ label: b.text, id: b.id }] : []
        )
      : []);

  // A faq block in the body replaces the standalone fallback FAQ section.
  const hasFaqBlock =
    isBlocks && (post.body as ContentBlock[]).some((b) => b.type === "faq");

  // A bottom-cta block in the body replaces the default coral CTA.
  const bottomCta = isBlocks
    ? (post.body as ContentBlock[]).find((b) => b.type === "bottom-cta")
    : undefined;

  const useCaseLinks = post.sidebar?.useCases ?? DEFAULT_USE_CASES;
  const relatedToolLinks: SidebarLink[] =
    post.sidebar?.relatedTools ??
    post.relatedToolSlugs
      .map((slug) => TOOL_REGISTRY[slug])
      .filter(Boolean)
      .map((t) => ({ label: t.name, href: t.href }));

  const initials = post.author
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showUpdated =
    post.showUpdatedBadge ?? post.modifiedDate !== post.publishedDate;
  const readTime = post.readTime ?? `${readTimeMinutes(post)} min read`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* TWO-COLUMN PAGE: article (left) + sticky sidebar (right). Mirrors the
            v5 mockup .page-wrap grid, with the breadcrumb at the top of the
            article column rather than in a separate hero band. */}
        <section className="mx-auto max-w-[1140px] px-6 pb-20 pt-10">
          <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-[minmax(0,1fr)_300px] min-[900px]:gap-14">
            {/* ARTICLE COLUMN */}
            <article className="min-[900px]:max-w-[720px]">
              <nav aria-label="Breadcrumb" className="mb-5 text-[13px] text-[#8A8A8A]">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-[#5C5C5C]">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[11px] text-[#EDE8E2]">
                    ›
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-[#5C5C5C]">
                      Blog
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[11px] text-[#EDE8E2]">
                    ›
                  </li>
                  <li aria-current="page">{post.shortTitle ?? post.h1}</li>
                </ol>
              </nav>

              <span className="mb-3.5 inline-block rounded-full border border-[#F7E6DD] bg-coral-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-coral">
                {pillarLabel[post.pillar] ?? "Guide"}
              </span>

              <h1 className="mb-4 max-w-[680px] font-display text-[36px] font-semibold leading-[1.15] tracking-[-0.02em] min-[900px]:text-[48px]">
                {post.h1}
              </h1>

              {/* META */}
              <div className="mb-6 flex items-center gap-2.5 border-b border-[#EDE8E2] pb-8">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <div className="flex flex-col gap-px text-sm">
                  <span className="text-[15px] font-bold text-charcoal">
                    {post.author}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                    <time dateTime={post.publishedDate}>
                      {formatDate(post.publishedDate, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{readTime}</span>
                    {showUpdated && (
                      <span
                        title={`Last updated ${formatDate(post.modifiedDate, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`}
                        className="inline-flex items-center gap-1.5 rounded border border-[#EDE8E2] bg-[#FAF6F1] px-2.5 py-1 text-[12px] text-[#5C5C5C]"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
                        />
                        Updated{" "}
                        {formatDate(post.modifiedDate, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* TL;DR */}
              <div className="rounded-xl border border-[#EDE8E2] border-l-[3px] border-l-[#D4653A] bg-white p-7">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                  In short
                </p>
                <p className="text-[15px] leading-relaxed text-muted">
                  {renderTokens(post.tldr, post.slug, "tldr")}
                </p>
              </div>

              {/* BODY */}
              <div className="mt-9">
                {isBlocks ? (
                  <BlogBlocks blocks={post.body as ContentBlock[]} salt={post.slug} />
                ) : (
                  <ContextualProse paragraphs={legacyParagraphs} salt={post.slug} />
                )}

                {!hasFaqBlock && (
                  <div className="mt-10">
                    <BlogFaqList
                      items={post.faqs.map((f) => ({ q: f.question, a: f.answer }))}
                      salt={post.slug}
                    />
                  </div>
                )}
              </div>
            </article>

            {/* SIDEBAR COLUMN */}
            <aside className="min-[900px]:self-start">
              <div className="space-y-5 min-[900px]:sticky min-[900px]:top-20">
                {toc.length > 0 && (
                  <nav
                    aria-label="On this page"
                    className="rounded-2xl border border-charcoal/10 bg-warm p-5"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      On this page
                    </p>
                    <ul className="space-y-2.5">
                      {toc.map((item, i) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={
                              i === 0
                                ? "block border-l-[3px] border-[#D4653A] pl-3 text-sm font-semibold text-[#D4653A]"
                                : "block border-l-[3px] border-transparent pl-3 text-sm text-[#5C5C5C] transition-colors hover:text-[#D4653A]"
                            }
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                <div className="rounded-2xl bg-gradient-to-br from-coral to-coral-dark p-6 text-white">
                  <p className="text-base font-bold">Host any file for free</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">
                    Drop a file, get a link. 25MB, 10 active links, no expiry.
                  </p>
                  <Link
                    href="/sign-up"
                    className="mt-4 block w-full rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
                  >
                    Try NudgeHost free
                  </Link>
                </div>

                {useCaseLinks.length > 0 && (
                  <div className="rounded-2xl border border-charcoal/10 bg-warm p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      Use cases
                    </p>
                    <ul className="space-y-2 text-sm">
                      {useCaseLinks.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="text-muted transition-colors hover:text-coral-dark"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {relatedToolLinks.length > 0 && (
                  <div className="rounded-2xl border border-charcoal/10 bg-warm p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      Related tools
                    </p>
                    <ul className="space-y-2 text-sm">
                      {relatedToolLinks.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="text-muted transition-colors hover:text-coral-dark"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* A bottom-cta block renders inline in the article column (v5 posts).
            Posts without one get the templated RelatedTools grid plus a
            full-width closing CTA. */}
        {!bottomCta && (
          <>
            <RelatedTools tools={post.relatedToolSlugs as never[]} />
            <BottomCta
              title="Try it yourself."
              text="Drop a file and get a shareable link in seconds. Free, no card needed."
              link="/"
              label="Share a file now"
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
