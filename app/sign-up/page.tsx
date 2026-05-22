import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "We're putting the finishing touches on accounts. Drop your email and we'll let you know when sign-up opens.",
  alternates: { canonical: "/sign-up" },
  // Placeholder page: crawlable so Google sees the inbound CTAs from the
  // homepage, pricing, and navbar, but kept out of the index until the real
  // account flow ships.
  robots: { index: false, follow: true },
};

const planLabels: Record<string, string> = {
  pro: "You picked the Pro plan",
  team: "You picked the Team plan",
};

type SearchParams = Promise<{ plan?: string }>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan } = await searchParams;
  const planLabel = plan ? planLabels[plan] : undefined;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-charcoal">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-charcoal">
              Sign up
            </li>
          </ol>
        </nav>

        <div className="rounded-3xl bg-cream px-6 py-12 text-center md:px-12 md:py-16">
          {/* Coming-soon pill (same pattern as the blog hub) */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-coral-light px-3.5 py-1.5 text-xs font-medium text-coral-dark">
            <span
              className="h-1.5 w-1.5 rounded-full bg-coral"
              aria-hidden="true"
            />
            Coming soon
          </div>

          <h1 className="mb-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Sign up for NudgeHost
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            We&apos;re putting the finishing touches on accounts. Drop your
            email and we&apos;ll let you know when it&apos;s ready.
          </p>

          {planLabel && (
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-warm px-3.5 py-1.5 text-sm font-medium text-charcoal">
              {planLabel}
            </div>
          )}

          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="signup-email" className="sr-only">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-charcoal/10 bg-white px-5 py-3 text-sm text-charcoal placeholder:text-muted focus:border-coral focus:outline-none"
            />
            <button
              type="button"
              className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              Subscribe
            </button>
          </div>

          <p className="mx-auto mt-6 max-w-md text-xs text-muted">
            One email when accounts open, then nothing else. No marketing list,
            no spam.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
