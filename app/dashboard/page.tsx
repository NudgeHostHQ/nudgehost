import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your NudgeHost dashboard.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await currentUser();
  const greetingName =
    user?.firstName || user?.username || user?.emailAddresses[0]?.emailAddress || "there";

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
              Dashboard
            </li>
          </ol>
        </nav>

        <header className="mb-10 max-w-2xl">
          <h1 className="mb-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Hi {greetingName}.
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Dashboard coming soon. Your links, analytics, and account settings
            will live here.
          </p>
        </header>
      </main>
      <Footer />
    </>
  );
}
