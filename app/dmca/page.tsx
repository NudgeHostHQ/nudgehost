import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "DMCA Takedown Policy",
  description:
    "How to submit a copyright takedown notice for content hosted on NudgeHost, plus counter-notification process and repeat infringer policy.",
  alternates: { canonical: "/dmca" },
};

const h2 =
  "mt-8 font-display text-2xl font-semibold tracking-tight text-charcoal";
const p = "mt-3 text-base leading-relaxed text-charcoal/85";
const ol = "mt-3 list-decimal space-y-3 pl-6 text-base text-charcoal/85";

export default function DmcaPage() {
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
              DMCA
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            DMCA Takedown Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: 22 May 2026</p>
        </header>

        <article className="rounded-3xl bg-cream p-8 md:p-12">
          <p className={p}>
            NudgeHost respects the intellectual property rights of others. If
            you believe content hosted on NudgeHost infringes your copyright,
            you can submit a takedown notice and we&apos;ll investigate.
          </p>

          <section>
            <h2 className={h2}>1. Submitting a takedown notice</h2>
            <p className={p}>
              Send a written notice to{" "}
              <strong>support@nudgehost.com</strong> with &quot;DMCA
              Takedown&quot; in the subject line. We process notices on
              business days and aim to remove infringing material within 48
              hours of a valid notice.
            </p>
          </section>

          <section>
            <h2 className={h2}>2. What a valid notice must include</h2>
            <p className={p}>A valid notice must contain all of the following:</p>
            <ol className={ol}>
              <li>
                <strong>Identification of the copyrighted work</strong> you
                believe has been infringed. If multiple works on a single site
                are involved, a representative list is sufficient.
              </li>
              <li>
                <strong>Identification of the infringing material</strong>,
                including the exact URL on nudgehost.com (for example,
                nudgehost.com/abc123) so we can locate the file.
              </li>
              <li>
                <strong>Your contact information:</strong> full name, postal
                address, phone number, and email address.
              </li>
              <li>
                <strong>A good-faith statement</strong> that you believe the
                use of the copyrighted material is not authorised by the
                copyright owner, its agent, or the law.
              </li>
              <li>
                <strong>An accuracy statement</strong> that the information in
                the notice is accurate and that, under penalty of perjury, you
                are the copyright owner or are authorised to act on their
                behalf.
              </li>
              <li>
                <strong>A signature</strong> (electronic signature is
                acceptable) of the copyright owner or their authorised agent.
              </li>
            </ol>
            <p className={p}>
              Incomplete notices may delay processing. False or bad-faith
              claims may make you liable for damages, including legal costs.
            </p>
          </section>

          <section>
            <h2 className={h2}>3. Counter-notification</h2>
            <p className={p}>
              If you believe content of yours was removed in error, you can
              submit a counter-notification to{" "}
              <strong>support@nudgehost.com</strong>. A valid counter-notice
              must include:
            </p>
            <ol className={ol}>
              <li>
                <strong>Identification of the removed content</strong> and the
                URL where it appeared before removal.
              </li>
              <li>
                <strong>Your contact information:</strong> full name, postal
                address, phone number, and email address.
              </li>
              <li>
                <strong>A statement under penalty of perjury</strong> that you
                have a good-faith belief the content was removed by mistake or
                misidentification.
              </li>
              <li>
                <strong>A consent-to-jurisdiction statement:</strong> you
                agree to the jurisdiction of the courts of England and Wales
                (or, if you are outside the UK, the equivalent court where
                NudgeHost may bring legal action) and that you will accept
                service of process from the person who submitted the original
                takedown notice.
              </li>
              <li>
                <strong>Your signature</strong> (electronic signature is
                acceptable).
              </li>
            </ol>
            <p className={p}>
              On receipt of a valid counter-notification, we&apos;ll forward
              it to the original complainant. If they don&apos;t file a court
              action within 10 to 14 business days, we&apos;ll restore the
              content.
            </p>
          </section>

          <section>
            <h2 className={h2}>4. Repeat infringer policy</h2>
            <p className={p}>
              We terminate the accounts of users who are subject to repeated
              takedown notices. &quot;Repeated&quot; means three or more
              confirmed infringement claims within a 12-month period.
              Termination removes the user&apos;s content and prevents the
              same user from creating a new account.
            </p>
          </section>

          <section>
            <h2 className={h2}>Contact</h2>
            <p className={p}>
              Email support@nudgehost.com with &quot;DMCA&quot; in the subject
              line for all takedown and counter-notification correspondence.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
