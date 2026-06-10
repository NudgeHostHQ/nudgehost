"use client";

import { useState } from "react";
import Link from "next/link";
import { btnPrimary, btnOutline } from "@/components/ui/button";

type Props = {
  plan: "free" | "pro" | "team";
  label: string;
  featured: boolean;
  priceId?: string;
  signedIn: boolean;
  currentPlan: string;
};

function buttonClass(featured: boolean): string {
  return (
    (featured ? btnPrimary : btnOutline) +
    " w-full px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
  );
}

// Calls a Stripe endpoint that returns { url } and sends the browser there.
async function redirectVia(endpoint: string, body?: unknown): Promise<string | null> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    return data.error || "Something went wrong. Please try again.";
  }
  window.location.href = data.url;
  return null;
}

export function PlanButton({ plan, label, featured, priceId, signedIn, currentPlan }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Free tier always points at sign-up.
  if (plan === "free") {
    return (
      <Link href="/sign-up" className={buttonClass(featured)}>
        {label}
      </Link>
    );
  }

  // Paid tiers, but the visitor isn't signed in yet.
  if (!signedIn) {
    return (
      <Link href={`/sign-up?plan=${plan}`} className={buttonClass(featured)}>
        {label}
      </Link>
    );
  }

  const isPaidUser = currentPlan === "pro" || currentPlan === "team";

  const handleClick = async () => {
    setLoading(true);
    setError("");
    const message = isPaidUser
      ? await redirectVia("/api/stripe/portal")
      : await redirectVia("/api/stripe/checkout", { priceId });
    // We only get here on failure; success navigates away.
    if (message) {
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={buttonClass(featured)}
      >
        {loading ? "One moment…" : isPaidUser ? "Manage billing" : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-coral-dark">{error}</p>}
    </div>
  );
}
