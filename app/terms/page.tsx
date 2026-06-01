import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using NudgeHost. Acceptable use, account responsibilities, billing, and termination, in plain English.",
  alternates: { canonical: "/terms" },
  openGraph: pageOpenGraph("/terms"),
};

// Shared Tailwind classes for the legal pages. Kept inline rather than
// hoisted to a util so each page stays self-contained and easy to edit.
const h2 =
  "mt-8 font-display text-2xl font-semibold tracking-tight text-charcoal";
const p = "mt-3 text-base leading-relaxed text-charcoal/85";
const ul = "mt-3 list-disc space-y-2 pl-6 text-base text-charcoal/85";

export default function TermsPage() {
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
              Terms of Service
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: 22 May 2026</p>
        </header>

        <article className="rounded-3xl bg-cream p-8 md:p-12">
          <section>
            <h2 className={h2}>1. Acceptance of terms</h2>
            <p className={p}>
              By signing up for NudgeHost or using nudgehost.com, you agree to
              these terms. If you don&apos;t agree, please don&apos;t use the
              service. We may update these terms occasionally; we&apos;ll post
              the new version here with a fresh &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className={h2}>2. Your account</h2>
            <p className={p}>
              You&apos;re responsible for keeping your account credentials safe
              and for everything that happens under your account. If you
              suspect unauthorised access, email support@nudgehost.com straight
              away.
            </p>
            <p className={p}>
              You need to be at least 13 to create an account. If you&apos;re
              between 13 and 18, you should have parental permission.
            </p>
          </section>

          <section>
            <h2 className={h2}>3. Acceptable use</h2>
            <p className={p}>You agree not to use NudgeHost to:</p>
            <ul className={ul}>
              <li>
                distribute malware, viruses, ransomware, or other harmful code
              </li>
              <li>
                host illegal content, including material that infringes
                copyright, contains child sexual abuse material, incites
                violence, or breaches UK law
              </li>
              <li>impersonate other people or organisations</li>
              <li>
                send unsolicited bulk email (spam) linking to NudgeHost-hosted
                files
              </li>
              <li>
                attempt to disrupt the service, including denial-of-service
                attacks or trying to access other users&apos; accounts
              </li>
              <li>
                resell or sublicense the service without our written agreement
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>4. Content and file hosting</h2>
            <p className={p}>
              You keep ownership of the files you upload. By uploading a file,
              you grant NudgeHost a non-exclusive licence to store, transmit,
              and display that file for the purpose of running the service.
            </p>
            <p className={p}>
              We can remove content that violates these terms. We can also
              suspend or terminate accounts that repeatedly host violating
              content. Where reasonable, we&apos;ll notify you before doing so,
              but we may act without notice if the content is unlawful or
              causing harm.
            </p>
            <p className={p}>
              If you believe someone has uploaded your copyrighted work without
              permission, see our{" "}
              <Link href="/dmca" className="text-coral hover:underline">
                DMCA Takedown Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className={h2}>5. Free plan</h2>
            <p className={p}>
              The free plan is genuinely free and has no expiry. The limits
              (10 active links, 25MB per file) apply per account. We may
              adjust these limits with reasonable notice. The free plan is
              offered as-is with no service-level guarantees.
            </p>
          </section>

          <section>
            <h2 className={h2}>6. Paid plans, billing, and cancellation</h2>
            <p className={p}>
              Pro and Team plans bill monthly or annually in advance. You can
              cancel from your dashboard at any time. Cancellations take
              effect at the end of the current billing cycle; we don&apos;t
              refund partial periods.
            </p>
            <p className={p}>
              If a payment fails, we&apos;ll retry and notify you by email.
              After repeated failure, your account drops back to the free
              tier, and any content over the free-plan limits goes read-only
              until you delete some or restore the paid plan.
            </p>
            <p className={p}>
              Prices listed on{" "}
              <Link href="/pricing" className="text-coral hover:underline">
                /pricing
              </Link>{" "}
              are exclusive of any applicable VAT or sales tax, which
              we&apos;ll add at checkout where required.
            </p>
          </section>

          <section>
            <h2 className={h2}>7. Limitation of liability</h2>
            <p className={p}>
              NudgeHost is provided as-is. To the maximum extent permitted by
              law, we aren&apos;t liable for:
            </p>
            <ul className={ul}>
              <li>loss of data, profits, or business</li>
              <li>indirect, incidental, or consequential damages</li>
              <li>service interruptions or downtime</li>
            </ul>
            <p className={p}>
              Our total liability for any claim arising from these terms or
              your use of the service is capped at the amount you paid us in
              the twelve months before the claim arose.
            </p>
            <p className={p}>
              Nothing in these terms limits liability that cannot be excluded
              under UK law, such as for death or personal injury caused by
              negligence, or for fraud.
            </p>
          </section>

          <section>
            <h2 className={h2}>8. Termination</h2>
            <p className={p}>
              You can close your account at any time from your dashboard. We
              can terminate or suspend your account if you breach these
              terms, if your account stays inactive for more than 24 months,
              or if we discontinue the service.
            </p>
            <p className={p}>
              On termination, your content stays available for a 30-day grace
              period in case you change your mind, after which it&apos;s
              permanently deleted.
            </p>
          </section>

          <section>
            <h2 className={h2}>9. Changes to these terms</h2>
            <p className={p}>
              We may update these terms. Material changes will be flagged by
              email to active accounts at least 14 days before they take
              effect. Continued use of the service after that period counts as
              acceptance.
            </p>
          </section>

          <section>
            <h2 className={h2}>10. Governing law</h2>
            <p className={p}>
              These terms are governed by the laws of England and Wales. Any
              dispute will be subject to the exclusive jurisdiction of the
              courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className={h2}>Contact</h2>
            <p className={p}>
              Questions about these terms? Email support@nudgehost.com.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
