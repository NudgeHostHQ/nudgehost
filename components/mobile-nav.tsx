"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

// Hamburger menu for the marketing navbar below the lg breakpoint. The bar
// itself keeps the logo, Sign in, and the CTA (rendered by the server-side
// Navbar); this component owns only the toggle button and the slide-down
// panel with the section links. The panel positions against the sticky <nav>
// (the nearest positioned ancestor), closes when any link is tapped, and
// also closes on route change as a backstop so it never lingers over a new
// page.

const SECTION_LINKS = [
  { href: "/host", label: "Host" },
  { href: "/converters", label: "Converters" },
  { href: "/dev-tools", label: "Dev tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

const panelLinkClass =
  "block rounded-xl px-3 py-3 text-base font-medium text-charcoal transition-colors hover:bg-coral-light/50";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-charcoal/5"
      >
        {open ? (
          <X size={22} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Menu size={22} strokeWidth={2} aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full border-b border-line bg-cream shadow-[0_24px_40px_-24px_rgba(44,40,36,0.35)] lg:hidden"
        >
          <ul className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={panelLinkClass}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <Show when="signed-in">
              <li>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={panelLinkClass}
                >
                  Dashboard
                </Link>
              </li>
            </Show>
            <Show when="signed-out">
              <li>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={panelLinkClass}
                >
                  Sign in
                </Link>
              </li>
            </Show>
          </ul>
        </div>
      )}
    </>
  );
}
