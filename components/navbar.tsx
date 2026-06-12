import Link from "next/link";
// Clerk v7 replaces the old <SignedIn>/<SignedOut> control components with a
// single <Show when="signed-in" | "signed-out"> component. Same behavior.
import { Show, UserButton } from "@clerk/nextjs";
import { btnPrimary } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

// Nav link with an animated coral underline that wipes in from the left on
// hover (a scaled ::after bar).
const navLinkClass =
  "relative text-base font-medium text-muted transition-colors hover:text-charcoal after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-coral after:transition-transform after:duration-200 hover:after:scale-x-100";

// One navbar for the marketing pages and the dashboard. Below lg the section
// links collapse behind the MobileNav hamburger; the logo, Sign in, and the
// CTA stay in the bar at every width (iPad portrait was the worst offender:
// at md the full link row collided with the logo and wrapped). lg keeps the
// full row with a tighter gap so iPad landscape still fits on one line.
export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream/[0.86] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-10">
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl"
        >
          nudge<span className="text-coral">host</span>
        </Link>

        {/* Full link row, lg and up */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          <li>
            <Link href="/host" className={navLinkClass}>
              Host
            </Link>
          </li>
          <li>
            <Link href="/converters" className={navLinkClass}>
              Converters
            </Link>
          </li>
          <li>
            <Link href="/dev-tools" className={navLinkClass}>
              Dev tools
            </Link>
          </li>
          <li>
            <Link href="/pricing" className={navLinkClass}>
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/blog" className={navLinkClass}>
              Blog
            </Link>
          </li>
          <Show when="signed-out">
            <li>
              <Link href="/sign-in" className={navLinkClass}>
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/sign-up"
                className={`${btnPrimary} whitespace-nowrap px-5 py-2 text-base`}
              >
                Get started free
              </Link>
            </li>
          </Show>
          <Show when="signed-in">
            <li>
              <Link href="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
            </li>
            <li className="flex items-center">
              <UserButton />
            </li>
          </Show>
        </ul>

        {/* Compact cluster below lg: Sign in + CTA (or the account button)
            stay visible, sections live in the hamburger panel. */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <Show when="signed-out">
            {/* Visible from 380px up (390px phones included); on narrower
                screens it stays reachable inside the hamburger panel. */}
            <Link
              href="/sign-in"
              className="hidden whitespace-nowrap text-sm font-medium text-muted transition-colors hover:text-charcoal min-[380px]:block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={`${btnPrimary} whitespace-nowrap px-4 py-2 text-sm`}
            >
              Get started free
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
