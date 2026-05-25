import Link from "next/link";
import { hostContentMap } from "@/lib/host-content";
import { viewersContentMap } from "@/lib/viewers-content";
import { convertersContentMap } from "@/lib/converters-content";
import { devToolsContentMap } from "@/lib/dev-tools-content";
import { compareContentMap } from "@/lib/compare-content";
import { useCasesContentMap } from "@/lib/use-cases-content";

// The footer link wall is generated from the same content maps that drive the
// pages themselves. This guarantees the footer never links to a page that
// doesn't exist — internal links to 404s waste crawl budget and dilute the
// link graph, so the footer must stay in sync with reality automatically.
//
// Each column shows up to 6 spokes plus an "All <silo> →" link to the hub.

type FooterLink = { label: string; href: string };

function columnFrom(
  contentMap: Record<string, { slug: string; name: string }>,
  basePath: string,
  hubLabel: string,
  labelFor: (name: string) => string,
  max = 6
): FooterLink[] {
  const links: FooterLink[] = Object.values(contentMap)
    .slice(0, max)
    .map((c) => ({ label: labelFor(c.name), href: `${basePath}/${c.slug}` }));
  links.push({ label: `All ${hubLabel} →`, href: basePath });
  return links;
}

const footerSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    // max raised so every host spoke gets a footer link, not just the first six.
    title: "Host files",
    links: columnFrom(hostContentMap, "/host", "file types", (n) => `${n} hosting`, 99),
  },
  {
    title: "Viewers",
    links: columnFrom(viewersContentMap, "/viewers", "viewers", (n) => `${n} viewer`),
  },
  {
    title: "Converters",
    links: columnFrom(convertersContentMap, "/converters", "converters", (n) => n),
  },
  {
    title: "Dev tools",
    links: columnFrom(devToolsContentMap, "/dev-tools", "dev tools", (n) => n),
  },
  {
    title: "Use cases",
    links: columnFrom(useCasesContentMap, "/use-cases", "use cases", (n) => n),
  },
  {
    title: "Compare",
    links: [
      ...Object.values(compareContentMap).map((c) => ({
        label: `NudgeHost vs ${c.competitorName}`,
        href: `/compare/${c.slug}`,
      })),
      { label: "All comparisons →", href: "/compare" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-7">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div>
            <Link href="/" className="font-display text-lg font-semibold text-white">
              nudge<span className="text-coral">host</span>
            </Link>
            <p className="mt-1 text-xs text-white/45">
              © {new Date().getFullYear()} NudgeHost. Made with warmth.
            </p>
          </div>
          <ul className="flex flex-wrap gap-6 text-xs text-white/55">
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/dmca" className="hover:text-white">DMCA</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
