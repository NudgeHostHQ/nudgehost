import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContextualProse } from "@/components/contextual-prose";
import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

// Renders a silo hub page (e.g. /viewers): an intro with contextual links,
// then a grid linking to every spoke in the silo.
export function SiloHub({
  silo,
  contentMap,
  introParagraphs,
  cardCaption,
}: {
  silo: SiloConfig;
  contentMap: Record<string, SpokeContent>;
  // Intro prose — should contain {{key}} contextual links to top spokes.
  introParagraphs: string[];
  // One-line caption shown under each card (function of the spoke).
  cardCaption: (c: SpokeContent) => string;
}) {
  const spokes = Object.values(contentMap);

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
              {silo.hubLabel}
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {silo.hubLabel}
          </h1>
          {/* Intro prose carries contextual links into the top spokes */}
          <ContextualProse paragraphs={introParagraphs} salt={`${silo.key}-hub`} />
        </header>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spokes.map((spoke) => (
            <li key={spoke.slug}>
              <Link
                href={`${silo.basePath}/${spoke.slug}`}
                className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-sm"
              >
                <h2 className="font-display text-base font-semibold text-charcoal">
                  {spoke.name}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {cardCaption(spoke)}
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
