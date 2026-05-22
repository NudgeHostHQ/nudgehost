import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data NudgeHost collects, how we use it, and your rights under UK GDPR. No selling, no ad tracking, no AI model training.",
  alternates: { canonical: "/privacy" },
};

const h2 =
  "mt-8 font-display text-2xl font-semibold tracking-tight text-charcoal";
const p = "mt-3 text-base leading-relaxed text-charcoal/85";
const ul = "mt-3 list-disc space-y-2 pl-6 text-base text-charcoal/85";

export default function PrivacyPage() {
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
              Privacy Policy
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: 22 May 2026</p>
        </header>

        <article className="rounded-3xl bg-cream p-8 md:p-12">
          <section>
            <h2 className={h2}>1. What we collect</h2>
            <p className={p}>When you use NudgeHost, we collect:</p>
            <ul className={ul}>
              <li>
                <strong>Account data:</strong> email address, optional name,
                hashed password.
              </li>
              <li>
                <strong>Uploaded files:</strong> the content you upload for
                hosting, plus metadata like filename, size, and upload time.
              </li>
              <li>
                <strong>Usage analytics:</strong> aggregated stats on which
                links are opened, when, and from roughly where (country level
                only). We do not record individual visitor IP addresses
                long-term.
              </li>
              <li>
                <strong>Payment data:</strong> handled by Stripe. We never see
                or store your card number; we receive a token and the billing
                email.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>2. How we use your data</h2>
            <p className={p}>We use your data to:</p>
            <ul className={ul}>
              <li>
                run the service (host files, generate links, render your
                dashboard)
              </li>
              <li>
                send essential service emails (billing receipts, security
                alerts, breach notices)
              </li>
              <li>improve the product based on aggregated usage patterns</li>
              <li>comply with legal obligations</li>
            </ul>
            <p className={p}>
              We do not sell your data, share it with advertisers, or use
              uploaded files to train AI models.
            </p>
          </section>

          <section>
            <h2 className={h2}>3. Cookies and analytics</h2>
            <p className={p}>
              We use <strong>Plausible Analytics</strong> for site usage stats.
              Plausible doesn&apos;t use cookies, doesn&apos;t track
              individuals across sites, and doesn&apos;t collect personally
              identifiable information.
            </p>
            <p className={p}>
              We don&apos;t use Google Analytics. We don&apos;t run
              ad-tracking pixels (Meta, TikTok, Twitter, LinkedIn). The only
              cookies set on nudgehost.com are session cookies needed to keep
              you signed in.
            </p>
          </section>

          <section>
            <h2 className={h2}>4. Third-party services</h2>
            <p className={p}>
              NudgeHost runs on a small set of trusted services:
            </p>
            <ul className={ul}>
              <li>
                <strong>Cloudflare:</strong> CDN and DDoS protection.
                Cloudflare sees the IP addresses of visitors to your hosted
                files.
              </li>
              <li>
                <strong>Stripe:</strong> payment processing for paid plans.
                Stripe holds your card data, not us.
              </li>
              <li>
                <strong>Clerk:</strong> authentication and account management.
              </li>
              <li>
                <strong>Plausible:</strong> privacy-respecting site analytics,
                as above.
              </li>
            </ul>
            <p className={p}>
              Each of these has its own privacy practices. We pick partners
              that hold themselves to GDPR standards.
            </p>
          </section>

          <section>
            <h2 className={h2}>5. Data retention</h2>
            <ul className={ul}>
              <li>
                <strong>Active accounts:</strong> we keep your data while your
                account is active.
              </li>
              <li>
                <strong>Closed accounts:</strong> file content is deleted
                permanently 30 days after account closure.
              </li>
              <li>
                <strong>Backups:</strong> we hold encrypted backups for up to
                90 days for disaster recovery.
              </li>
              <li>
                <strong>Billing records:</strong> retained for 6 years as
                required by UK tax law.
              </li>
              <li>
                <strong>Analytics:</strong> aggregated analytics are retained
                indefinitely. Individual link-open events are deleted after 12
                months.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>6. Your rights under UK GDPR</h2>
            <p className={p}>
              If you&apos;re in the UK or EU, you have the right to:
            </p>
            <ul className={ul}>
              <li>
                <strong>Access</strong> the personal data we hold about you
              </li>
              <li>
                <strong>Correct</strong> inaccurate data
              </li>
              <li>
                <strong>Delete</strong> your account and the personal data we
                hold (right to be forgotten)
              </li>
              <li>
                <strong>Export</strong> your data in a portable format
              </li>
              <li>
                <strong>Object</strong> to processing for marketing (we
                don&apos;t do this, but the right exists)
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time where we rely on
                consent
              </li>
            </ul>
            <p className={p}>
              To exercise any of these, email support@nudgehost.com. We&apos;ll
              respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className={h2}>7. Children&apos;s privacy</h2>
            <p className={p}>
              NudgeHost isn&apos;t directed at children under 13. If we find
              we&apos;ve collected data from someone under 13, we&apos;ll
              delete it. If you believe a child under 13 has signed up, please
              email us.
            </p>
          </section>

          <section>
            <h2 className={h2}>8. International transfers</h2>
            <p className={p}>
              NudgeHost is operated from the United Kingdom. Some of our
              service providers (Cloudflare, Stripe) operate globally. Data
              transfers outside the UK are protected by Standard Contractual
              Clauses or equivalent safeguards.
            </p>
          </section>

          <section>
            <h2 className={h2}>9. Security</h2>
            <p className={p}>
              We encrypt data in transit (TLS) and at rest. Passwords are
              hashed with bcrypt. We restrict internal access to user data and
              audit it regularly. No system is perfectly secure; we&apos;ll
              notify affected users within 72 hours of any confirmed breach
              involving personal data.
            </p>
          </section>

          <section>
            <h2 className={h2}>10. Changes to this policy</h2>
            <p className={p}>
              We may update this policy. Material changes are flagged by
              email to active accounts at least 14 days before they take
              effect.
            </p>
          </section>

          <section>
            <h2 className={h2}>11. Contact and supervisory authority</h2>
            <p className={p}>Privacy questions: support@nudgehost.com.</p>
            <p className={p}>
              If you&apos;re in the UK and aren&apos;t satisfied with our
              response, you have the right to lodge a complaint with the
              Information Commissioner&apos;s Office (ICO), the UK&apos;s
              supervisory authority for data protection. Visit{" "}
              <a
                href="https://ico.org.uk"
                className="text-coral hover:underline"
                rel="noopener"
              >
                ico.org.uk
              </a>{" "}
              for details.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
