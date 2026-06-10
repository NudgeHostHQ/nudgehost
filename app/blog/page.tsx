import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow } from "@/components/ui/eyebrow";
import { interactiveCardClass } from "@/components/ui/card";
import { bodyLinkClass } from "@/components/ui/prose";
import { getReadTime } from "@/components/blog-post";
import { blogContentMap } from "@/lib/blog-content";
import { pageOpenGraph } from "@/lib/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export const metadata: Metadata = {
  title: "Blog: file-sharing guides and tips",
  description:
    "Practical guides to sharing files better. Hosting Claude artifacts, v0 and Lovable exports, sending large PDFs, and turning a resume into a trackable link.",
  alternates: { canonical: "/blog" },
  openGraph: pageOpenGraph("/blog"),
};

const pillarLabel: Record<string, string> = {
  "ai-publishing": "AI publishing",
  "sharing-files": "Sharing files",
  "hosting-vs-cloud": "Hosting",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
  ],
};

const posts = Object.values(blogContentMap);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BlogHub() {
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
              Blog
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
            File-sharing guides and tips.
          </h1>
          <p className={`text-lg leading-relaxed text-muted ${bodyLinkClass}`}>
            Every post here is a walkthrough you can follow start to finish,
            written from actually doing the thing. The guides lean toward two
            areas, publishing what AI tools like Claude and v0 generate, and
            getting documents to people without the usual friction. If you want
            to skip the reading, you can <Link href="/">drop a file and get a link</Link>{" "}
            now, browse the full set of <Link href="/host">hosting tools</Link>, or
            see what each plan includes on <Link href="/pricing">pricing</Link>.
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`group flex h-full flex-col p-6 ${interactiveCardClass}`}
              >
                <div className="mb-3">
                  <Eyebrow>{pillarLabel[post.pillar] ?? "Guide"}</Eyebrow>
                </div>
                <h2 className="font-display text-lg font-semibold text-charcoal transition-colors group-hover:text-coral-dark">
                  {post.h1}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {post.metaDescription}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-5 text-sm text-muted">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-dark text-[11px] font-bold text-white"
                    aria-hidden="true"
                  >
                    {initialsOf(post.author)}
                  </span>
                  <span className="font-medium text-charcoal">{post.author}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.publishedDate}>
                    {formatDate(post.publishedDate)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{getReadTime(post)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
