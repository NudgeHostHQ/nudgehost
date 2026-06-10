import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Overline } from "@/components/ui/overline";
import { bodyLinkClass } from "@/components/ui/prose";
import { btnPrimary, btnOutline } from "@/components/ui/button";
import { NotFoundClaim } from "@/components/not-found-claim";

// Keep the 404 out of the index; the global metadata sets robots index:true, so
// this override is needed. not-found.tsx still returns an HTTP 404 status.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto w-full max-w-[680px]">
          <div className="flex justify-center">
            <Overline>404</Overline>
          </div>

          <h1 className="mb-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] md:text-6xl">
            Nothing lives at this link.{" "}
            <em className="font-display italic text-coral">Yet.</em>
          </h1>

          <p className="mx-auto max-w-[460px] text-lg text-muted">
            There&apos;s no file here. But the address works fine, and right now
            it could be yours.
          </p>

          <NotFoundClaim />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className={`${btnPrimary} px-6 py-3 text-sm`}>
              Back to home
            </Link>
            <Link href="/host" className={`${btnOutline} px-6 py-3 text-sm`}>
              Browse hosting tools
            </Link>
          </div>

          <p className={`mx-auto mt-8 max-w-[460px] text-sm text-muted ${bodyLinkClass}`}>
            Looking for something that used to be here? The owner may have{" "}
            <Link href="/glossary/link-expiry">let the link expire</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
