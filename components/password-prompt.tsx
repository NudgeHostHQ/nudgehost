"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

// Shown on the public viewer when a file is password protected. A correct
// submission sets the unlock cookie, then we refresh so the server renders
// the file. For ZIP sites the endpoint instead returns a redirect to the
// site's subdomain, carrying a short-lived handoff token that becomes the
// per-site unlock cookie over there.
export function PasswordPrompt({
  fileId,
  filename,
}: {
  fileId: string;
  filename: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/files/${fileId}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "That password is not right. Please try again.");
        setLoading(false);
        return;
      }
      if (typeof data.redirect === "string") {
        // ZIP site: continue on its subdomain, where the handoff token in
        // this URL becomes the per-site unlock cookie.
        window.location.assign(data.redirect);
        return;
      }
      // Cookie is set; re-render the server component to reveal the file.
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-3xl border border-charcoal/10 bg-warm p-8 text-center">
      <div
        className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-coral-light text-coral-dark"
        style={{ height: "52px", width: "52px" }}
        aria-hidden="true"
      >
        <Lock size={24} strokeWidth={2} />
      </div>
      <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight">
        This file is protected
      </h1>
      <p className="mb-6 truncate text-sm text-muted" title={filename}>
        Enter the password to view {filename}.
      </p>
      <form onSubmit={submit} className="space-y-3 text-left">
        <label htmlFor="file-password" className="sr-only">
          Password
        </label>
        <input
          id="file-password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full rounded-full border border-charcoal/15 bg-white px-5 py-3 text-sm text-charcoal placeholder:text-muted focus:border-coral focus:outline-none"
        />
        {error && <p className="px-1 text-sm text-coral-dark">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-full bg-coral px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking…" : "Open file"}
        </button>
      </form>
    </div>
  );
}
