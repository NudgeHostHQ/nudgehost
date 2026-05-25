"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, QrCode, Settings, Trash2, X } from "lucide-react";

type Props = {
  fileId: string;
  filename: string;
  shareUrl: string;
  qrSvg: string;
  hasPassword: boolean;
  // Expiry as a yyyy-mm-dd string for the date input, or null when unset.
  expiresAt: string | null;
};

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/10 bg-warm text-muted transition-colors hover:border-coral/40 hover:text-charcoal disabled:opacity-50";

export function FileActions({
  fileId,
  filename,
  shareUrl,
  qrSvg,
  hasPassword,
  expiresAt,
}: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Settings modal state.
  const [showSettings, setShowSettings] = useState(false);
  const [pwEnabled, setPwEnabled] = useState(hasPassword);
  const [pwValue, setPwValue] = useState("");
  const [expiryValue, setExpiryValue] = useState(expiresAt ?? "");
  const [saving, setSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy failed.");
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${filename}"? The link will stop working.`)) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/files/${fileId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        setDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Delete failed.");
      setDeleting(false);
    }
  };

  // Reset the form to the current saved state each time the modal opens, so it
  // reflects values from the last server render.
  const openSettings = () => {
    setPwEnabled(hasPassword);
    setPwValue("");
    setExpiryValue(expiresAt ?? "");
    setSettingsError("");
    setShowSettings(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    setSettingsError("");

    const payload: { password?: string | null; expiresAt: string | null } = {
      expiresAt: expiryValue ? expiryValue : null,
    };

    if (pwEnabled) {
      if (pwValue.trim()) {
        payload.password = pwValue;
      } else if (!hasPassword) {
        setSettingsError("Please enter a password to turn protection on.");
        setSaving(false);
        return;
      }
      // Enabled with an existing password and no new value: leave it unchanged.
    } else if (hasPassword) {
      payload.password = null;
    }

    try {
      const res = await fetch(`/api/files/${fileId}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSettingsError(data.error || "Could not save. Please try again.");
        setSaving(false);
        return;
      }
      setShowSettings(false);
      setSaving(false);
      router.refresh();
    } catch {
      setSettingsError("Could not save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={copyLink}
          className={iconButton}
          aria-label={`Copy link to ${filename}`}
          title="Copy link"
        >
          {copied ? (
            <Check size={15} className="text-sage" strokeWidth={2.5} />
          ) : (
            <Copy size={15} strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          onClick={() => setShowQr(true)}
          className={iconButton}
          aria-label={`Show QR code for ${filename}`}
          title="QR code"
        >
          <QrCode size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={openSettings}
          className={iconButton}
          aria-label={`Settings for ${filename}`}
          title="Settings"
        >
          <Settings size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className={`${iconButton} hover:border-coral hover:text-coral-dark`}
          aria-label={`Delete ${filename}`}
          title="Delete"
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>
      {error && <p className="mt-1 text-right text-xs text-coral-dark">{error}</p>}

      {showQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`QR code for ${filename}`}
          onClick={() => setShowQr(false)}
        >
          <div
            className="relative w-full max-w-xs rounded-3xl border border-charcoal/10 bg-warm p-6 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQr(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cream hover:text-charcoal"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <p className="mb-4 truncate font-display text-base font-semibold text-charcoal">
              {filename}
            </p>
            <div
              className="mx-auto mb-4 w-fit rounded-2xl border border-charcoal/10 bg-white p-3 [&_svg]:h-44 [&_svg]:w-44"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="break-all text-xs text-muted">{shareUrl}</p>
            <button
              type="button"
              onClick={copyLink}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
            >
              {copied ? (
                <>
                  <Check size={15} strokeWidth={2.5} /> Copied
                </>
              ) : (
                <>
                  <Copy size={15} strokeWidth={2} /> Copy link
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Settings for ${filename}`}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-charcoal/10 bg-warm p-6 text-left shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-cream hover:text-charcoal"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <h2 className="mb-1 truncate font-display text-lg font-semibold text-charcoal" title={filename}>
              File settings
            </h2>
            <p className="mb-5 truncate text-sm text-muted" title={filename}>
              {filename}
            </p>

            {/* Password protection */}
            <div className="mb-5 rounded-2xl border border-charcoal/10 bg-cream/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Password protection
                  </p>
                  <p className="text-xs text-muted">
                    Visitors enter a password before they can view the file.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pwEnabled}
                  onClick={() => setPwEnabled((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    pwEnabled ? "bg-coral" : "bg-charcoal/20"
                  }`}
                  aria-label="Toggle password protection"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      pwEnabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {pwEnabled && (
                <input
                  type="password"
                  autoComplete="new-password"
                  value={pwValue}
                  onChange={(e) => setPwValue(e.target.value)}
                  placeholder={
                    hasPassword ? "Leave blank to keep current password" : "Set a password"
                  }
                  className="mt-3 w-full rounded-full border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-muted focus:border-coral focus:outline-none"
                />
              )}
            </div>

            {/* Expiry */}
            <div className="mb-5 rounded-2xl border border-charcoal/10 bg-cream/60 p-4">
              <label
                htmlFor={`expiry-${fileId}`}
                className="block text-sm font-medium text-charcoal"
              >
                Expiry date
              </label>
              <p className="mb-3 text-xs text-muted">
                The link stops working after this date. Leave blank for no expiry.
              </p>
              <input
                id={`expiry-${fileId}`}
                type="date"
                value={expiryValue}
                onChange={(e) => setExpiryValue(e.target.value)}
                className="w-full rounded-full border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal focus:border-coral focus:outline-none"
              />
            </div>

            {settingsError && (
              <p className="mb-3 text-sm text-coral-dark">{settingsError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-full border-[1.5px] border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-coral"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
