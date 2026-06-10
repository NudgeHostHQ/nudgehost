import Link from "next/link";
// Clerk v7 replaces the old <SignedIn>/<SignedOut> control components with a
// single <Show when="signed-in" | "signed-out"> component. Same behavior.
import { Show, UserButton } from "@clerk/nextjs";
import { btnPrimary } from "@/components/ui/button";

// Nav link with an animated coral underline that wipes in from the left on
// hover (a scaled ::after bar).
const navLinkClass =
  "relative text-base font-medium text-muted transition-colors hover:text-charcoal after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-coral after:transition-transform after:duration-200 hover:after:scale-x-100";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-cream/[0.86] backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          nudge<span className="text-coral">host</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
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
              <Link href="/sign-up" className={`${btnPrimary} px-5 py-2 text-base`}>
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
      </div>
    </nav>
  );
}
