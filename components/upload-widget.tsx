"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Check, Copy, FileUp, Link2, RotateCcw, X } from "lucide-react";
import { sanitizeDesiredSlug, isClaimableSlug } from "@/lib/slug";
import { TurnstileWidget } from "@/components/turnstile-widget";

type Status = "idle" | "uploading" | "success" | "error";

// Inlined at build time. When the key is absent, anonymous uploads are off and
// signed-out visitors get the pre-Turnstile behavior (redirect to sign-up).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

// Reads the ?claim= param from the 404 "claim this link" flow and reports the
// sanitized, claimable slug (or "") up to the widget. Isolated in its own
// component so the useSearchParams Suspense boundary wraps only this leaf: the
// widget itself stays statically rendered, and the boundary's null fallback
// keeps it out of the prerendered HTML.
function ClaimParamReader({ onClaim }: { onClaim: (slug: string) => void }) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("claim") ?? "";
  const slug = sanitizeDesiredSlug(raw);
  const claimable = isClaimableSlug(slug) ? slug : "";
  useEffect(() => {
    onClaim(claimable);
  }, [claimable, onClaim]);
  return null;
}

const FILE_TYPES = ["PDF", "HTML", "ZIP", "Image", "Any file"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// PUT the raw file straight to R2 with XHR so we get real upload progress.
function putToR2(
  url: string,
  file: File,
  contentType: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error("upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("network error"));
    xhr.send(file);
  });
}

export function UploadWidget({
  pills,
  className = "",
  tabs = "both",
  defaultTab = "file",
}: {
  // Optional file-type hint pills (e.g. ["PDF"] on /host/pdf). The uploader
  // still accepts any file; these are purely visual cues.
  pills?: string[];
  // Positioning/animation extras from the embedding page (z-index, fade-up,
  // margins). Width is owned by the widget itself (w-full max-w-xl mx-auto,
  // the homepage hero dimensions) so every embed renders at the same size;
  // don't pass width classes here.
  className?: string;
  // Which publish modes the embedding page offers. "file" hides the tab bar
  // and the Paste HTML panel for pages where pasting markup makes no sense
  // (e.g. converter and viewer spokes). Default keeps both, the original
  // behavior.
  tabs?: "both" | "file";
  // Which tab is selected on load. Paste-first pages (e.g. /features/paste-html
  // or the Claude artifact spoke) open on the paste panel; both tabs stay
  // visible. Ignored when tabs is "file".
  defaultTab?: "file" | "paste";
} = {}) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const displayPills = pills && pills.length > 0 ? pills : FILE_TYPES;
  const inputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  // Paste-only is not a supported combination; a file-only widget always
  // opens (and stays) on the file panel regardless of defaultTab.
  const [mode, setMode] = useState<"file" | "paste">(
    tabs === "file" ? "file" : defaultTab,
  );
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeName, setActiveName] = useState("");
  const [activeSize, setActiveSize] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [showHtmlWarning, setShowHtmlWarning] = useState(false);

  // The slug the visitor arrived to claim (sanitized + reserved-checked by
  // ClaimParamReader), and whether they dismissed the pill. Dismissing reverts
  // to a normal upload. The effective value is mirrored into a ref so upload()
  // can read it without being recreated on every claim change.
  const [claimSlug, setClaimSlug] = useState("");
  const [claimDismissed, setClaimDismissed] = useState(false);
  const effectiveClaim = claimSlug && !claimDismissed ? claimSlug : "";
  const claimRef = useRef("");
  useEffect(() => {
    claimRef.current = effectiveClaim;
  }, [effectiveClaim]);

  // Anonymous-upload support. anonEnabled means the Turnstile site key was
  // present at build time; without it, signed-out visitors keep the original
  // redirect-to-sign-up behavior. The latest Turnstile token sits in a ref
  // (tokens arrive via callback, not on demand); uploads that start before the
  // first token arrives wait on it via tokenWaitersRef. anonLimit marks a
  // server rejection that signing up would lift, so the error card can offer
  // that path.
  const anonEnabled = TURNSTILE_SITE_KEY.length > 0;
  const turnstileTokenRef = useRef<string | null>(null);
  const tokenWaitersRef = useRef<((token: string | null) => void)[]>([]);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [anonLimit, setAnonLimit] = useState(false);

  const handleTurnstileToken = useCallback((token: string | null) => {
    turnstileTokenRef.current = token;
    if (token) {
      const waiters = tokenWaitersRef.current;
      tokenWaitersRef.current = [];
      waiters.forEach((resolve) => resolve(token));
    }
  }, []);

  // Resolves with the current token, or the next one to arrive, or null after
  // 20s so a stuck challenge fails with a message instead of hanging.
  const waitForTurnstileToken = useCallback((): Promise<string | null> => {
    if (turnstileTokenRef.current) {
      return Promise.resolve(turnstileTokenRef.current);
    }
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), 20000);
      tokenWaitersRef.current.push((token) => {
        clearTimeout(timer);
        resolve(token);
      });
    });
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setActiveName("");
    setActiveSize(0);
    setShareUrl("");
    setErrorMessage("");
    setAnonLimit(false);
    setCopied(false);
    setPasteValue("");
    setShowHtmlWarning(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const upload = useCallback(
    async (file: File) => {
      const contentType = file.type || "application/octet-stream";
      setStatus("uploading");
      setProgress(0);
      setActiveName(file.name);
      setActiveSize(file.size);
      setErrorMessage("");
      setAnonLimit(false);

      try {
        // Signed-out uploads carry a Turnstile token; the server rejects
        // without one. Tokens are single-use, so it is cleared (and the widget
        // reset) right after the presign call, whatever the outcome.
        let turnstileToken: string | undefined;
        if (!isSignedIn) {
          const token = await waitForTurnstileToken();
          if (!token) {
            setErrorMessage(
              "The security check did not finish. Please try again.",
            );
            setStatus("error");
            return;
          }
          turnstileToken = token;
        }

        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType,
            fileSize: file.size,
            // Read from a ref so a changing claim never re-creates upload(). When
            // the server can't honor it, it falls back to a random slug and the
            // confirm step returns whatever slug the file actually landed on.
            desiredSlug: claimRef.current || undefined,
            turnstileToken,
          }),
        });

        if (!isSignedIn) {
          turnstileTokenRef.current = null;
          setTurnstileResetKey((key) => key + 1);
        }

        const presignData = await presignRes.json().catch(() => ({}));
        if (!presignRes.ok) {
          setErrorMessage(
            presignData.error ||
              "We could not start that upload. Please try again.",
          );
          setAnonLimit(Boolean(presignData.anonLimit));
          setStatus("error");
          return;
        }

        await putToR2(
          presignData.presignedUrl,
          file,
          contentType,
          setProgress,
        );

        const confirmRes = await fetch("/api/upload/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: presignData.fileId }),
        });

        const confirmData = await confirmRes.json().catch(() => ({}));
        if (!confirmRes.ok || !confirmData.success) {
          setErrorMessage(
            confirmData.error || "That upload did not finish. Please try again.",
          );
          setStatus("error");
          return;
        }

        setShareUrl(confirmData.url);
        // The claim, if any, is now spent. Drop the pill so "Upload another file"
        // is a clean random-slug upload instead of re-attempting the taken slug.
        setClaimDismissed(true);
        setStatus("success");
      } catch {
        setErrorMessage("Something interrupted the upload. Please try again.");
        setStatus("error");
      }
    },
    [isSignedIn, waitForTurnstileToken],
  );

  // Paste path: wrap the textarea content in a Blob, mint a File from it, and
  // hand that File to the same upload() pipeline a picked file uses. Nothing
  // downstream knows the bytes came from a textarea. The "text/html" type means
  // presign stores it as text/html and the viewer renders it live. Size is
  // enforced server-side against the user's plan, the same as a picked file.
  const publishPaste = useCallback(
    (html: string) => {
      if (!isLoaded) return;
      if (!isSignedIn && !anonEnabled) {
        router.push("/sign-up");
        return;
      }
      setShowHtmlWarning(false);
      const blob = new Blob([html], { type: "text/html" });
      const file = new File([blob], `paste-${Date.now()}.html`, {
        type: "text/html",
      });
      void upload(file);
    },
    [isLoaded, isSignedIn, anonEnabled, router, upload],
  );

  const handlePublishClick = useCallback(() => {
    if (pasteValue.trim().length === 0) return;
    // "<!DOCTYPE ..." also begins with "<", so one leading-"<" check covers
    // both forms the spec calls out. Anything else gets the soft warning.
    const looksLikeHtml = pasteValue.trimStart().startsWith("<");
    if (!looksLikeHtml) {
      setShowHtmlWarning(true);
      return;
    }
    publishPaste(pasteValue);
  }, [pasteValue, publishPaste]);

  // A click or tap on the drop zone. Guests go to sign-up only when anonymous
  // uploads are off (no Turnstile site key in the build).
  const handleActivate = useCallback(() => {
    if (!isLoaded) return;
    if (!isSignedIn && !anonEnabled) {
      router.push("/sign-up");
      return;
    }
    inputRef.current?.click();
  }, [isLoaded, isSignedIn, anonEnabled, router]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (!file) return;
      if (!isSignedIn && !anonEnabled) {
        router.push("/sign-up");
        return;
      }
      void upload(file);
    },
    [isSignedIn, anonEnabled, router, upload],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      if (!isLoaded) return;
      if (!isSignedIn && !anonEnabled) {
        router.push("/sign-up");
        return;
      }
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles, isLoaded, isSignedIn, anonEnabled, router],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [shareUrl]);

  return (
    <div
      id="upload-widget"
      className={`mx-auto w-full max-w-xl ${className}`.trim()}
      style={{ animationDelay: "0.2s" }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <Suspense fallback={null}>
        <ClaimParamReader onClaim={setClaimSlug} />
      </Suspense>

      {/* Invisible unless Cloudflare decides to show a challenge. Mounted
          outside the status blocks so an issued token survives the idle →
          uploading transition. */}
      {isLoaded && !isSignedIn && anonEnabled && (
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          onToken={handleTurnstileToken}
          resetKey={turnstileResetKey}
        />
      )}

      {/* IDLE — a tab bar, then either the dashed drop zone or the paste panel */}
      {status === "idle" && (
        <div>
          {effectiveClaim && (
            <div className="mb-4 flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2 text-sm">
              <Link2
                size={14}
                className="shrink-0 text-muted"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate">
                <span className="text-charcoal">nudgehost.com/</span>
                <span className="font-semibold text-coral-dark">
                  {effectiveClaim}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setClaimDismissed(true)}
                aria-label="Dismiss claimed link"
                className="shrink-0 text-muted transition-colors hover:text-charcoal"
              >
                <X size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          )}
          {tabs === "both" && (
          <div
            role="tablist"
            aria-label="Choose how to publish"
            className="mb-6 flex gap-1 rounded-full bg-cream p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "file"}
              onClick={() => {
                setMode("file");
                setShowHtmlWarning(false);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "file"
                  ? "bg-white text-charcoal shadow-sm"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              Upload file
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "paste"}
              onClick={() => setMode("paste")}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === "paste"
                  ? "bg-white text-charcoal shadow-sm"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              Paste HTML
            </button>
          </div>
          )}

          {mode === "file" ? (
            <div
              id="upload-dropzone"
              role="button"
              tabIndex={0}
              aria-label="Upload your file"
              onClick={handleActivate}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleActivate();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-3xl border-2 border-dashed px-10 py-10 text-center shadow-[0_18px_40px_-16px_rgba(232,112,74,0.25)] transition-all ${
                dragActive
                  ? "border-coral bg-coral-light/40"
                  : "border-coral/60 bg-white hover:border-coral hover:bg-[#FFFBF7]"
              }`}
            >
              <div
                className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-coral-light text-2xl"
                style={{ height: "52px", width: "52px" }}
                aria-hidden="true"
              >
                📂
              </div>
              <strong className="block text-lg font-medium text-charcoal">
                Drop your file here
              </strong>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleActivate();
                }}
                onKeyDown={(event) => event.stopPropagation()}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
              >
                Choose a file
              </button>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {displayPills.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-charcoal/10 bg-cream px-3 py-1 text-xs font-medium text-muted"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-[1.5px] border-coral/40 bg-warm px-6 py-6 text-left">
              <label htmlFor="paste-html" className="sr-only">
                Paste your HTML
              </label>
              <textarea
                id="paste-html"
                value={pasteValue}
                onChange={(event) => {
                  setPasteValue(event.target.value);
                  if (showHtmlWarning) setShowHtmlWarning(false);
                }}
                placeholder="Paste your HTML here..."
                spellCheck={false}
                className="block min-h-[300px] w-full resize-y rounded-2xl border border-charcoal/10 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-charcoal outline-none transition-colors focus:border-coral"
              />
              <p className="mt-2 text-xs tabular-nums text-muted">
                {pasteValue.length.toLocaleString()} characters
              </p>

              {showHtmlWarning && (
                <div className="mt-4 rounded-2xl border border-coral/40 bg-coral-light px-4 py-3">
                  <p className="text-sm font-medium text-charcoal">
                    This doesn&apos;t look like HTML. Publish anyway?
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => publishPaste(pasteValue)}
                      className="rounded-full bg-coral px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHtmlWarning(false)}
                      className="rounded-full border border-charcoal/15 bg-white px-5 py-2 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handlePublishClick}
                disabled={pasteValue.trim().length === 0}
                className="mt-4 w-full rounded-full bg-coral px-6 py-3 text-sm font-medium text-white transition-all hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-coral"
              >
                Publish
              </button>
            </div>
          )}
        </div>
      )}

      {/* UPLOADING — filename, size, progress bar */}
      {status === "uploading" && (
        <div className="rounded-3xl border-[1.5px] border-coral/40 bg-warm px-8 py-9 text-left">
          <div className="flex items-center gap-3">
            <div
              className="flex shrink-0 items-center justify-center rounded-2xl bg-coral-light text-coral-dark"
              style={{ height: "44px", width: "44px" }}
              aria-hidden="true"
            >
              <FileUp size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-charcoal">
                {activeName}
              </p>
              <p className="text-xs text-muted">{formatBytes(activeSize)}</p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums text-coral-dark">
              {progress}%
            </span>
          </div>
          <div
            className="mt-5 h-2 w-full overflow-hidden rounded-full bg-coral-light"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Upload progress"
          >
            <div
              className="h-full rounded-full bg-coral transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Sending your file. This only takes a moment.
          </p>
        </div>
      )}

      {/* SUCCESS — shareable link + copy button */}
      {status === "success" && (
        <div className="rounded-3xl border-[1.5px] border-sage/50 bg-sage-light px-8 py-9 text-center">
          <div
            className="mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white text-sage"
            style={{ height: "52px", width: "52px" }}
            aria-hidden="true"
          >
            <Check size={26} strokeWidth={2.5} />
          </div>
          <strong className="block text-lg font-medium text-charcoal">
            Your link is ready
          </strong>
          <p className="mt-1 text-sm" style={{ color: "#3A6E3E" }}>
            Share it with anyone. No sign-in needed to view.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              readOnly
              value={shareUrl}
              aria-label="Your shareable link"
              onFocus={(event) => event.target.select()}
              className="min-w-0 flex-1 rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm text-charcoal outline-none focus:border-coral"
            />
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
            >
              {copied ? (
                <>
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} strokeWidth={2} aria-hidden="true" />
                  Copy link
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-charcoal"
          >
            <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
            Upload another file
          </button>
        </div>
      )}

      {/* ERROR — friendly message + retry */}
      {status === "error" && (
        <div className="rounded-3xl border-[1.5px] border-coral/50 bg-coral-light px-8 py-9 text-center">
          <strong className="block text-lg font-medium text-charcoal">
            That did not work
          </strong>
          <p className="mx-auto mt-2 max-w-sm text-sm text-coral-dark">
            {errorMessage}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {/* Offered only when the rejection was an anonymous limit an
                account would lift; reuses the existing sign-up route. */}
            {anonLimit && (
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
              >
                Sign up to continue
              </Link>
            )}
            <button
              type="button"
              onClick={reset}
              className={
                anonLimit
                  ? "inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-charcoal/30"
                  : "inline-flex items-center gap-1.5 rounded-full bg-coral px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coral-dark"
              }
            >
              <RotateCcw size={15} strokeWidth={2} aria-hidden="true" />
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
