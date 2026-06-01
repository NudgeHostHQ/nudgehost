import Link from "next/link";

// The footer link wall is a curated set of the highest-intent pages per silo,
// each column capped at 7 links and ending in an "All <silo> →" link to the
// hub. Curating by hand (rather than listing every spoke from the content maps)
// keeps the wall tight and scannable. Every href below points at a real page;
// when a hub or spoke slug changes, update the matching entry here.

type FooterLink = { label: string; href: string };

const footerSections: { title: string; links: FooterLink[] }[] = [
  // --- Row 1 ---
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Update a link in place", href: "/features/link-updating" },
      { label: "Paste HTML", href: "/features/paste-html" },
      { label: "Password protection", href: "/features/password-protection" },
      { label: "Custom domains", href: "/features/custom-domains" },
      { label: "Link previews", href: "/features/link-previews" },
      { label: "Public links", href: "/features/public-links" },
      { label: "All features →", href: "/features" },
    ],
  },
  {
    title: "Host files",
    links: [
      { label: "PDF hosting", href: "/host/pdf" },
      { label: "HTML hosting", href: "/host/html" },
      { label: "ZIP hosting", href: "/host/zip" },
      { label: "DOCX hosting", href: "/host/docx" },
      { label: "Claude artifact hosting", href: "/host/claude-artifact" },
      { label: "ChatGPT HTML hosting", href: "/host/chatgpt-html" },
      { label: "All file types →", href: "/host" },
    ],
  },
  {
    title: "Viewers",
    links: [
      { label: "PDF viewer", href: "/viewers/pdf" },
      { label: "DOCX viewer", href: "/viewers/docx" },
      { label: "CSV viewer", href: "/viewers/csv" },
      { label: "JSON viewer", href: "/viewers/json" },
      { label: "All viewers →", href: "/viewers" },
    ],
  },
  {
    title: "Converters",
    links: [
      { label: "PDF to JPG", href: "/converters/pdf-to-jpg" },
      { label: "DOCX to PDF", href: "/converters/docx-to-pdf" },
      { label: "PNG to WebP", href: "/converters/png-to-webp" },
      { label: "HEIC to JPG", href: "/converters/heic-to-jpg" },
      { label: "All converters →", href: "/converters" },
    ],
  },
  // --- Row 2 ---
  {
    title: "Dev tools",
    links: [
      { label: "JSON formatter", href: "/dev-tools/json-formatter" },
      { label: "Base64 encoder", href: "/dev-tools/base64" },
      { label: "URL encoder", href: "/dev-tools/url-encoder" },
      { label: "JWT decoder", href: "/dev-tools/jwt-decoder" },
      { label: "All dev tools →", href: "/dev-tools" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { label: "Share a resume as a link", href: "/use-cases/share-resume-as-link" },
      { label: "Send a portfolio to a recruiter", href: "/use-cases/send-portfolio-to-recruiter" },
      { label: "Send a large PDF without email", href: "/use-cases/send-large-pdf-without-email" },
      { label: "Host a wedding website", href: "/use-cases/share-wedding-website" },
      { label: "All use cases →", href: "/use-cases" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "NudgeHost vs Tiiny.host", href: "/compare/nudgehost-vs-tiiny-host" },
      { label: "NudgeHost vs Linkyhost", href: "/compare/nudgehost-vs-linkyhost" },
      { label: "All comparisons →", href: "/compare" },
    ],
  },
  {
    title: "Glossary",
    links: [
      { label: "Static site", href: "/glossary/static-site" },
      { label: "CORS", href: "/glossary/cors" },
      { label: "Link expiry", href: "/glossary/link-expiry" },
      { label: "Password protection", href: "/glossary/password-protection" },
      { label: "Custom domain", href: "/glossary/custom-domain" },
      { label: "All terms →", href: "/glossary" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-4">
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
