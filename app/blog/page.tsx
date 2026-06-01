import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            File-sharing guides and tips.
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Every post here is a walkthrough you can follow start to finish,
            written from actually doing the thing. The guides lean toward two
            areas, publishing what AI tools like Claude and v0 generate, and
            getting documents to people without the usual friction. If you want
            to skip the reading, you can{" "}
            <Link
              href="/"
              className="font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
            >
              drop a file and get a link
            </Link>{" "}
            now, browse the full set of{" "}
            <Link
              href="/host"
              className="font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
            >
              hosting tools
            </Link>
            , or see what each plan includes on{" "}
            <Link
              href="/pricing"
              className="font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 hover:decoration-coral"
            >
              pricing
            </Link>
            .
          </p>
        </header>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-sm"
              >
                <span className="mb-3 inline-block rounded-full bg-coral-light px-2.5 py-1 text-xs font-medium text-coral-dark">
                  {pillarLabel[post.pillar] ?? "Guide"}
                </span>
                <h2 className="font-display text-base font-semibold text-charcoal">
                  {post.h1}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {post.metaDescription}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
