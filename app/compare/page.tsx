import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContextualProse } from "@/components/contextual-prose";
import { compareContentMap } from "@/lib/compare-content";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "Compare NudgeHost: honest side-by-side comparisons",
  description:
    "See how NudgeHost compares to Tiiny.host, Linkyhost and other file-sharing tools. Fair, detailed comparisons of plans, pricing and features.",
  alternates: { canonical: "/compare" },
  openGraph: pageOpenGraph("/compare"),
};

const intro = [
  "Choosing a file-sharing tool is easier with the tradeoffs laid out plainly. These comparisons are written to be fair; each one credits what the competitor does well before explaining where NudgeHost differs.",
  "The two most useful starting points are {{compare-tiiny}} and {{compare-linkyhost}}. If you would rather skip the reading, you can {{home}} and judge for yourself.",
];

export default function CompareHub() {
  const comparisons = Object.values(compareContentMap);

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
              Compare
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Compare NudgeHost
          </h1>
          <ContextualProse paragraphs={intro} salt="compare-hub" />
        </header>

        <ul className="grid gap-4 md:grid-cols-2">
          {comparisons.map((c) => {
            const leftLabel = c.leftColumnLabel ?? "NudgeHost";
            const rightLabel = c.rightColumnLabel ?? c.competitorName;
            return (
              <li key={c.slug}>
                <Link
                  href={`/compare/${c.slug}`}
                  className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-sm"
                >
                  <h2 className="font-display text-base font-semibold text-charcoal">
                    {leftLabel} vs {rightLabel}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {c.lead}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </>
  );
}
