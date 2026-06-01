import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create your free NudgeHost account. 10 active links, 25MB per file, no credit card required.",
  alternates: { canonical: "/sign-up" },
  openGraph: pageOpenGraph("/sign-up"),
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
              Sign up
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Sign up for NudgeHost
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Free forever for 10 active links and 25MB per file. No credit card,
            no expiry, no surprises.
          </p>
        </header>

        {planLabel && (
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-warm px-3.5 py-1.5 text-sm font-medium text-charcoal">
            {planLabel}
          </div>
        )}

        <div className="flex justify-center">
          <SignUp />
        </div>
      </main>
      <Footer />
    </>
  );
}
