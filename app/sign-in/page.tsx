import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to NudgeHost to manage your links, see open analytics, and update files.",
  alternates: { canonical: "/sign-in" },
};

export default function SignInPage() {
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
              Sign in
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Sign in to NudgeHost
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Welcome back. Sign in to manage your links, check analytics, and
            update hosted files.
          </p>
        </header>

        <SignIn />
      </main>
      <Footer />
    </>
  );
}
