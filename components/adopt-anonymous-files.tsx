"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

// Fires the anonymous-file adoption once per mount when a signed-in session
// is present. Pages render this only when the nh_anon cookie exists (the
// cookie is httpOnly, so the server component does that check), which keeps
// the request off every ordinary signed-in page view. Renders nothing.
export function AdoptAnonymousFiles() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || firedRef.current) return;
    firedRef.current = true;
    fetch("/api/account/adopt-anonymous", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { adopted?: number } | null) => {
        // Re-render server components so freshly adopted files show up in
        // the dashboard list without a manual reload.
        if (data && typeof data.adopted === "number" && data.adopted > 0) {
          router.refresh();
        }
      })
      .catch(() => {
        // Best-effort; the next signed-in visit retries while the cookie lives.
      });
  }, [isLoaded, isSignedIn, router]);

  return null;
}
