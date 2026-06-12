"use client";

import { useRef } from "react";
import type { TocEntry } from "@/lib/blog-content";

// Compact "On this page" accordion shown above the article body on narrow
// screens, where the full sidebar (with the scrollspy TOC) sits below the
// article. Built on a native <details> element, closed by default, so
// expanding works with no script at all; the one scripted nicety is closing
// the panel when a link is tapped so the jump target is visible immediately.
// Links are plain same-page anchors and the headings carry scroll-mt offsets,
// so navigation works like any in-page link on iOS Safari.
export function MobileToc({ items }: { items: TocEntry[] }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      className="group rounded-xl border border-[#E7DFD2] bg-white shadow-sm transition-colors open:border-[#F6DCCF]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-muted [&::-webkit-details-marker]:hidden">
        On this page
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-light text-coral-dark transition-transform duration-200 group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <ul className="space-y-1 px-5 pb-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => {
                if (detailsRef.current) detailsRef.current.open = false;
              }}
              className="block border-l-2 border-[#E7DFD2] py-0.5 pl-4 text-sm text-muted transition-colors hover:text-coral-dark"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
