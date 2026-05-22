import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-coral">404</p>
        <h1 className="mb-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
          That page wandered off.
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted">
          The link you followed doesn&apos;t exist — or it never did. Try one of these instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
          >
            Back to home
          </Link>
          <Link
            href="/host"
            className="rounded-full border-[1.5px] border-charcoal/15 px-6 py-3 text-sm font-medium text-charcoal transition-colors hover:border-coral"
          >
            Browse hosting tools
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
