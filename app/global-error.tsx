"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// global-error replaces the root layout when a top-level error is thrown, so
// it must render its own <html>/<body>. globals.css/Tailwind are not loaded
// here, so the UI uses inline styles in the warm NudgeHost palette.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "24px",
          textAlign: "center",
          background: "#FBF7F0",
          color: "#2C2824",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 600, margin: 0 }}>
          Something went wrong.
        </h1>
        <p style={{ maxWidth: "28rem", color: "#7A6F65", margin: 0 }}>
          A hiccup on our end stopped this page from loading. The team has been
          notified. Try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            border: "none",
            cursor: "pointer",
            borderRadius: "9999px",
            padding: "12px 28px",
            fontSize: "15px",
            fontWeight: 500,
            color: "#ffffff",
            background: "#E8704A",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
