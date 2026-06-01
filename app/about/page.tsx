import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OG_IMAGE } from "@/lib/og";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export const metadata: Metadata = {
  title: "About Mark Boreland",
  description:
    "NudgeHost is a file-sharing tool built by Mark Boreland. Drop a file, get a public link, and share it with anyone in seconds.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Mark Boreland and NudgeHost",
    description:
      "NudgeHost is a file-sharing tool built by Mark Boreland. Drop a file, get a public link, and share it with anyone in seconds.",
    url: `${siteUrl}/about`,
    type: "profile",
    images: OG_IMAGE,
  },
};

// AboutPage + Person (E-E-A-T signal for the blog bylines that link here) +
// BreadcrumbList.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      name: "About NudgeHost",
      url: `${siteUrl}/about`,
    },
    {
      "@type": "Person",
      name: "Mark Boreland",
      url: `${siteUrl}/about`,
      jobTitle: "Founder",
      worksFor: { "@type": "Organization", name: "NudgeHost", url: siteUrl },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${siteUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
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
                <li aria-current="page" className="text-charcoal">
                  About
                </li>
              </ol>
            </nav>

            <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              About NudgeHost
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              NudgeHost is a file-sharing tool built by Mark Boreland. Drop a
              file, get a link, and share it with anyone in seconds.
            </p>
          </div>
        </section>

        {/* BODY */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div className="space-y-10">
            <div>
              <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight">
                Who builds this
              </h2>
              <p className="text-base leading-relaxed text-charcoal/80">
                Mark Boreland is the founder of NudgeHost. He writes the code,
                answers the support mail, and decides what ships. NudgeHost grew
                out of an everyday frustration. Sending a PDF, an HTML export, or
                a Claude artifact to someone meant email attachments that
                bounced, cloud drives that asked the recipient to sign in, or
                hosts that deleted the link after 30 days.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight">
                What NudgeHost does
              </h2>
              <p className="text-base leading-relaxed text-charcoal/80">
                You upload a file and get a clean public link in seconds. PDFs,
                HTML pages, ZIP archives, images, and AI-generated outputs all
                work the same way. The person you send it to opens the link in
                any browser with no account and no install. Links stay live for
                as long as you want, and you can swap the file behind a link
                without changing the URL.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight">
                Why it exists
              </h2>
              <p className="text-base leading-relaxed text-charcoal/80">
                Sharing a single file should not need a server, a build step, or
                a sign-up wall for the person on the other end. NudgeHost keeps
                that path short. The free plan covers personal projects with
                25MB uploads and 10 active links. Paid plans add password
                protection, custom domains, and larger files for people who
                share for work.
              </p>
            </div>

            <div>
              <Link
                href="/"
                className="inline-block rounded-full bg-coral px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
              >
                Try NudgeHost
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
