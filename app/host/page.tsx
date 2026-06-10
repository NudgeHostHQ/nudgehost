import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { interactiveCardClass } from "@/components/ui/card";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "Host any file as a link: PDFs, HTML, ZIPs, images and more",
  description:
    "Drop any file and get a shareable link. Free hosting for PDFs, HTML files, ZIPs, images, and AI-generated outputs. No setup, no signup required.",
  alternates: { canonical: "/host" },
  openGraph: pageOpenGraph("/host"),
};

const hostCategories = [
  {
    heading: "Documents",
    items: [
      { name: "PDF", href: "/host/pdf", desc: "Share PDFs as a link" },
      { name: "DOCX", href: "/host/docx", desc: "Host Word documents" },
      { name: "PPTX", href: "/host/pptx", desc: "Share PowerPoint decks" },
      { name: "XLSX", href: "/host/xlsx", desc: "Host Excel files" },
      { name: "TXT", href: "/host/txt", desc: "Plain text hosting" },
      { name: "Markdown", href: "/host/md", desc: "Host markdown as a webpage" },
    ],
  },
  {
    heading: "Web & code",
    items: [
      { name: "HTML", href: "/host/html", desc: "Single-page HTML hosting" },
      { name: "ZIP", href: "/host/zip", desc: "Host zipped sites" },
      { name: "React app", href: "/host/react-app", desc: "Deploy React builds" },
      { name: "Vue app", href: "/host/vue-app", desc: "Deploy Vue builds" },
      { name: "JSON", href: "/host/json", desc: "Host JSON endpoints" },
      { name: "SVG", href: "/host/svg", desc: "Host SVG files" },
    ],
  },
  {
    heading: "AI outputs",
    items: [
      { name: "Claude artifact", href: "/host/claude-artifact", desc: "Publish Claude HTML output" },
      { name: "ChatGPT HTML", href: "/host/chatgpt-html", desc: "Host GPT-generated pages" },
      { name: "Lovable export", href: "/host/lovable-export", desc: "Deploy Lovable sites" },
      { name: "v0 export", href: "/host/v0-export", desc: "Host v0 generated UIs" },
      { name: "Bolt export", href: "/host/bolt-export", desc: "Deploy Bolt builds" },
    ],
  },
  {
    heading: "Media",
    items: [
      { name: "Image", href: "/host/image", desc: "Host PNG, JPG, WebP" },
      { name: "GIF", href: "/host/gif", desc: "Share GIFs as a link" },
      { name: "MP4", href: "/host/mp4", desc: "Host video files" },
      { name: "MP3", href: "/host/mp3", desc: "Share audio files" },
    ],
  },
];

export default function HostHub() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex gap-2">
            <li><Link href="/" className="hover:text-charcoal">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">Host</li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
            Host any file as a link.
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Drop a file, get a clean shareable URL. PDFs, HTML pages, ZIPs, images, AI-generated
            outputs: anything you need to share, NudgeHost will host it for free.
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-2">
          {hostCategories.map((cat) => (
            <section key={cat.heading}>
              <h2 className="mb-4 font-display text-xl font-semibold">{cat.heading}</h2>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-baseline justify-between gap-4 px-4 py-3 ${interactiveCardClass}`}
                    >
                      <span className="text-sm font-medium text-charcoal">{item.name}</span>
                      <span className="text-xs text-muted">{item.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
