import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-charcoal/10 bg-warm/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          nudge<span className="text-coral">host</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link
              href="/host"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Host
            </Link>
          </li>
          <li>
            <Link
              href="/converters"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Converters
            </Link>
          </li>
          <li>
            <Link
              href="/dev-tools"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Dev tools
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted transition-colors hover:text-charcoal"
            >
              Sign in
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up"
              className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
            >
              Get started free
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
