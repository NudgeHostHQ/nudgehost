"use client";

import { useState } from "react";

// Opens the Stripe billing portal. Used on the dashboard for paid users.
export function ManageBillingButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "We could not open billing. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("We could not open billing. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "rounded-full border-[1.5px] border-charcoal/15 px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:border-coral disabled:opacity-60"
        }
      >
        {loading ? "One moment…" : "Manage billing"}
      </button>
      {error && <p className="mt-1 text-xs text-coral-dark">{error}</p>}
    </div>
  );
}
