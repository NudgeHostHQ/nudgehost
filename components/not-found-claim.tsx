"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2 } from "lucide-react";
import { btnPrimary } from "@/components/ui/button";

// First path segments that already map to a real route or system prefix. This
// mirrors the top-level entries in the app/ directory; when a new route folder
// is added there, add it here so a real (but mistyped) URL is never offered as
// a claimable link.
const RESERVED = new Set([
  "about",
  "api",
  "blog",
  "compare",
  "converters",
  "dashboard",
  "dev-tools",
  "dmca",
  "f",
  "features",
  "glossary",
  "host",
  "pricing",
  "privacy",
  "sign-in",
  "sign-up",
  "sites",
  "terms",
  "use-cases",
  "viewers",
  "admin",
  "www",
  "app",
  "mail",
  "docs",
  "status",
  "cdn",
  "assets",
  "static",
]);

const MAX_LEN = 40;

// The "unclaimed link" card on the 404 page. It reads the visited path and, when
// that path isn't a reserved route, presents it as a link the visitor could
// claim by dropping a file. Rendered only after mount so the path-derived markup
// never mismatches the server-rendered shell. Returns null (plain 404 layout)
// for reserved or empty paths.
export function NotFoundClaim() {
  const pathname = usePathname() || "/";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Strip leading/trailing slashes, take the first segment for the reserved
  // check, and decode the whole thing for display (it is user-controlled, so it
  // is only ever rendered as escaped text, never as HTML).
  const raw = pathname.replace(/^\/+|\/+$/g, "");
  const firstSegment = raw.split("/")[0].toLowerCase();

  let slug = raw;
  try {
    slug = decodeURIComponent(raw);
  } catch {
    // Malformed percent-encoding: fall back to the raw path.
  }

  if (!mounted || raw === "" || RESERVED.has(firstSegment)) return null;

  const display = slug.length > MAX_LEN ? `${slug.slice(0, MAX_LEN)}…` : slug;
  const claimHref = `/?claim=${encodeURIComponent(slug)}`;

  return (
    <div className="mx-auto mt-10 w-full max-w-[680px] overflow-hidden rounded-[20px] border border-line bg-white text-left shadow-sm">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 text-sm">
          <Link2 size={14} className="shrink-0 text-muted" aria-hidden="true" />
          <span className="min-w-0 truncate">
            <span className="text-charcoal">nudgehost.com/</span>
            <span className="font-bold text-coral-dark">{display}</span>
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-coral-light px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-widest text-coral-dark">
          Unclaimed
        </span>
      </div>

      {/* Dashed dropzone body */}
      <div className="p-5">
        <div className="rounded-xl border-2 border-dashed border-coral bg-cream p-8 text-center transition-colors hover:bg-coral-light">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-coral-light text-2xl"
            aria-hidden="true"
          >
            📂
          </div>
          <p className="text-base font-semibold text-charcoal">
            Drop a file here and this exact link goes live
          </p>
          <p className="mt-1.5 text-sm text-muted">
            Free, no account needed to start. Ready in seconds.
          </p>
          <Link href={claimHref} className={`mt-5 ${btnPrimary} px-7 py-3 text-sm`}>
            Claim this link
          </Link>
        </div>
      </div>
    </div>
  );
}
