"use client";

import { useEffect, useState } from "react";

// Fixed 3px bar pinned to the very top of the viewport whose width tracks how
// far the reader has scrolled through the article. Mounted only on blog post
// pages. Reduced-motion users still get the live width, just without the
// width-tween (motion-reduce:transition-none).
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-coral to-coral-dark transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
