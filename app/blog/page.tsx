import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Blog: file-sharing guides and tips",
  description:
    "Practical guides to sharing files better: PDF link tricks, hosting AI outputs, skipping email size limits, and more.",
  alternates: { canonical: "/blog" },
};

type PlaceholderPost = {
  slug: string;
  title: string;
  excerpt: string;
};

const upcomingPosts: PlaceholderPost[] = [
  {
    slug: "share-pdf-as-link",
    title: "How to share a PDF as a link",
    excerpt:
      "The full walkthrough of replacing an email attachment with a URL, including the open-tracking that tells you when the recipient actually reads it.",
  },
  {
    slug: "host-claude-artifact",
    title: "How to host a Claude artifact",
    excerpt:
      "Copy the HTML out of a Claude conversation, paste it into NudgeHost, and get a public URL anyone can open without an Anthropic account.",
  },
  {
    slug: "send-large-file-without-email",
    title: "How to send a large file without email",
    excerpt:
      "Email caps attachments at around 25MB. Hosting the file and sharing a link sidesteps that limit entirely, with optional expiry and password gating.",
  },
];

export default function BlogHub() {
  return (
    <>
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
            Short, practical posts about getting files from your machine to
            someone else&apos;s without friction. Tracking what was read, hosting
            AI-generated outputs, working around email size limits. The first
            posts land soon.
          </p>
        </header>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingPosts.map((post) => (
            <li key={post.slug}>
              <article
                aria-disabled="true"
                className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 opacity-75"
              >
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-coral-light px-2.5 py-1 text-xs font-medium text-coral-dark">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-coral"
                    aria-hidden="true"
                  />
                  Coming soon
                </div>
                <h2 className="font-display text-base font-semibold text-charcoal">
                  {post.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
