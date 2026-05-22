import Link from "next/link";

type Tool = {
  slug: string;
  name: string;
  description: string;
  href: string;
};

// Canonical map of all tools — keep this in sync as you add pages.
// When adding a new spoke page, add it here and reference it from
// adjacent pages via the `tools` prop on <RelatedTools />.
const TOOL_REGISTRY: Record<string, Tool> = {
  "host-pdf": {
    slug: "host-pdf",
    name: "Host a PDF",
    description: "Share a PDF as a clean, shareable link.",
    href: "/host/pdf",
  },
  "host-html": {
    slug: "host-html",
    name: "Host an HTML file",
    description: "Publish a single-page site or HTML export in seconds.",
    href: "/host/html",
  },
  "host-zip": {
    slug: "host-zip",
    name: "Host a ZIP",
    description: "Upload a ZIP and share it without it expiring.",
    href: "/host/zip",
  },
  "host-claude-artifact": {
    slug: "host-claude-artifact",
    name: "Host a Claude artifact",
    description: "Publish a Claude HTML output to a live URL.",
    href: "/host/claude-artifact",
  },
  "host-resume": {
    slug: "host-resume",
    name: "Host a resume",
    description: "Send your CV as a link, not an attachment.",
    href: "/host/resume",
  },
  "host-portfolio": {
    slug: "host-portfolio",
    name: "Host a portfolio",
    description: "Share your design portfolio with one link.",
    href: "/host/portfolio",
  },
  "viewer-pdf": {
    slug: "viewer-pdf",
    name: "PDF viewer",
    description: "View any PDF in-browser without downloading.",
    href: "/viewers/pdf",
  },
  "viewer-docx": {
    slug: "viewer-docx",
    name: "DOCX viewer",
    description: "Open Word documents online.",
    href: "/viewers/docx",
  },
  "viewer-csv": {
    slug: "viewer-csv",
    name: "CSV viewer",
    description: "Open spreadsheets in your browser, no Excel needed.",
    href: "/viewers/csv",
  },
  "viewer-json": {
    slug: "viewer-json",
    name: "JSON viewer",
    description: "Inspect and explore JSON files online.",
    href: "/viewers/json",
  },
  "converter-pdf-to-jpg": {
    slug: "converter-pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert PDFs to images, free, no signup.",
    href: "/converters/pdf-to-jpg",
  },
  "converter-docx-to-pdf": {
    slug: "converter-docx-to-pdf",
    name: "DOCX to PDF",
    description: "Convert Word documents to PDF.",
    href: "/converters/docx-to-pdf",
  },
  "converter-png-to-webp": {
    slug: "converter-png-to-webp",
    name: "PNG to WebP",
    description: "Shrink images by converting PNG to WebP.",
    href: "/converters/png-to-webp",
  },
  "converter-heic-to-jpg": {
    slug: "converter-heic-to-jpg",
    name: "HEIC to JPG",
    description: "Turn iPhone photos into universal JPGs.",
    href: "/converters/heic-to-jpg",
  },
  "dev-json-formatter": {
    slug: "dev-json-formatter",
    name: "JSON formatter",
    description: "Format and validate JSON in your browser.",
    href: "/dev-tools/json-formatter",
  },
  "dev-base64": {
    slug: "dev-base64",
    name: "Base64 encoder",
    description: "Encode and decode Base64 instantly.",
    href: "/dev-tools/base64",
  },
  "dev-url-encoder": {
    slug: "dev-url-encoder",
    name: "URL encoder",
    description: "Encode and decode URL components.",
    href: "/dev-tools/url-encoder",
  },
  "dev-jwt-decoder": {
    slug: "dev-jwt-decoder",
    name: "JWT decoder",
    description: "Decode and inspect JSON web tokens.",
    href: "/dev-tools/jwt-decoder",
  },
  "use-case-recruiter": {
    slug: "use-case-recruiter",
    name: "Send a portfolio to a recruiter",
    description: "Share your work as one trackable link.",
    href: "/use-cases/send-portfolio-to-recruiter",
  },
  "use-case-large-pdf": {
    slug: "use-case-large-pdf",
    name: "Send a large PDF",
    description: "Skip the email size limit entirely.",
    href: "/use-cases/send-large-pdf-without-email",
  },
  "use-case-resume-link": {
    slug: "use-case-resume-link",
    name: "Share a resume as a link",
    description: "Send your CV without an attachment.",
    href: "/use-cases/share-resume-as-link",
  },
  "use-case-deck": {
    slug: "use-case-deck",
    name: "Share a deck with a client",
    description: "Send a presentation as a clean link.",
    href: "/use-cases/share-deck-with-client",
  },
  "compare-tiiny": {
    slug: "compare-tiiny",
    name: "NudgeHost vs Tiiny.host",
    description: "An honest side-by-side comparison.",
    href: "/compare/nudgehost-vs-tiiny-host",
  },
  "compare-linkyhost": {
    slug: "compare-linkyhost",
    name: "NudgeHost vs Linkyhost",
    description: "An honest side-by-side comparison.",
    href: "/compare/nudgehost-vs-linkyhost",
  },
};

export const APPROVED_TOOL_SLUGS = Object.keys(TOOL_REGISTRY) as Array<
  keyof typeof TOOL_REGISTRY
>;

export function RelatedTools({
  tools,
  heading = "Related tools",
}: {
  tools: Array<keyof typeof TOOL_REGISTRY>;
  heading?: string;
}) {
  const resolved = tools.map((slug) => TOOL_REGISTRY[slug]).filter(Boolean);
  if (resolved.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-2 font-display text-2xl font-semibold tracking-tight text-charcoal">
        {heading}
      </h2>
      <p className="mb-8 text-sm text-muted">
        Other things you can do on NudgeHost.
      </p>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resolved.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={tool.href}
              className="block h-full rounded-2xl border border-charcoal/10 bg-warm p-5 transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-sm"
            >
              <h3 className="font-display text-base font-semibold text-charcoal">
                {tool.name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
