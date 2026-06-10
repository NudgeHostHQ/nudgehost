import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Overline } from "@/components/ui/overline";
import { btnPrimary, btnOutline } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <Overline>404</Overline>
        <h1 className="mb-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
          That page wandered off.
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted">
          The link you followed doesn&apos;t exist, or maybe it never did. Try one of these instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={`${btnPrimary} px-6 py-3 text-sm`}>
            Back to home
          </Link>
          <Link href="/host" className={`${btnOutline} px-6 py-3 text-sm`}>
            Browse hosting tools
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
