"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, QrCode, Trash2, X } from "lucide-react";

type Props = {
  fileId: string;
  filename: string;
  shareUrl: string;
  qrSvg: string;
};

export function FileActions({ fileId, filename, shareUrl, qrSvg }: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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
      // Re-run the server component so the list and usage stats update.
      router.refresh();
    } catch {
      setError("Delete failed.");
      setDeleting(false);
    }
  };

  const iconButton =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/10 bg-warm text-muted transition-colors hover:border-coral/40 hover:text-charcoal disabled:opacity-50";

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
              // qrSvg is generated server-side by the qrcode library from the
              // share URL, so it's a trusted, self-produced SVG string.
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
    </>
  );
}
