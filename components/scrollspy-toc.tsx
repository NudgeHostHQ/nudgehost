"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/blog-content";

// "On this page" table of contents with scrollspy. An IntersectionObserver
// watches each heading and marks the topmost one in view as active; clicking a
// link smooth-scrolls to its heading (honouring prefers-reduced-motion). The
// heading scroll offset comes from scroll-mt-28 on the headings themselves.
export function ScrollspyToc({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      aria-label="On this page"
      className="rounded-xl border border-[#E7DFD2] bg-white p-5 shadow-sm"
    >
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={
                  isActive
                    ? "block border-l-2 border-coral py-0.5 pl-4 text-sm font-semibold text-coral-dark"
                    : "block border-l-2 border-[#E7DFD2] py-0.5 pl-4 text-sm text-muted transition-colors hover:text-coral-dark"
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
