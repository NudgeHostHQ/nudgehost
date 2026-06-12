"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Minimal typing for the slice of the Turnstile JS API this component uses.
type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      execution?: "render" | "execute";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      "before-interactive-callback"?: () => void;
      "after-interactive-callback"?: () => void;
    },
  ) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export type TurnstileHandle = {
  // Run the challenge now. Safe to call before the widget has rendered; the
  // run is queued and fires as soon as it has.
  execute: () => void;
};

// Cloudflare Turnstile, deferred: nothing renders or runs at page load. The
// challenge executes only when the parent calls execute() (at upload start),
// so tokens are minted right before they're spent and never sit around going
// stale. Most visitors still see nothing (interaction-only); when Cloudflare
// genuinely wants interaction, the challenge expands inside this component's
// container and onInteractiveChange reports it so the parent can frame it.
// onToken fires with a fresh token when the check passes and with null when a
// token expires or errors. Bump resetKey after consuming a token (they are
// single-use) to arm the widget for the next execute().
export const TurnstileWidget = forwardRef<
  TurnstileHandle,
  {
    siteKey: string;
    onToken: (token: string | null) => void;
    onInteractiveChange?: (visible: boolean) => void;
    resetKey?: number;
  }
>(function TurnstileWidget({ siteKey, onToken, onInteractiveChange, resetKey = 0 }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // execute() before the script/widget is ready queues one run for later.
  const pendingExecuteRef = useRef(false);
  // Keep the latest callbacks in refs so the render effect never re-runs
  // (re-rendering the widget would discard an in-flight challenge).
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const onInteractiveRef = useRef(onInteractiveChange);
  onInteractiveRef.current = onInteractiveChange;

  useImperativeHandle(
    ref,
    () => ({
      execute: () => {
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.execute(widgetIdRef.current);
        } else {
          pendingExecuteRef.current = true;
        }
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        appearance: "interaction-only",
        // The widget mounts dormant; the challenge waits for execute().
        execution: "execute",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
        "before-interactive-callback": () => onInteractiveRef.current?.(true),
        "after-interactive-callback": () => onInteractiveRef.current?.(false),
      });
      if (pendingExecuteRef.current) {
        pendingExecuteRef.current = false;
        window.turnstile.execute(widgetIdRef.current);
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Load the script once per page, even with several widget instances.
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`,
      );
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  // Tokens are single-use; the parent bumps resetKey after spending one.
  // reset() returns the widget to its dormant pre-execute state.
  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetKey]);

  return <div ref={containerRef} className="flex justify-center" />;
});
