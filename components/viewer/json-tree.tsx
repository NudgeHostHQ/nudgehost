"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Children render only after their node expands, so a deep 10MB document
// never mounts its whole tree at once. Nodes deeper than this start
// collapsed.
const AUTO_EXPAND_DEPTH = 2;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type LoadState =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "invalid"; raw: string; parseError: string }
  | { status: "ready"; raw: string; value: JsonValue };

// One scalar value, colored by type. Always rendered as a text node, so
// values can't inject markup.
function Scalar({ value }: { value: string | number | boolean | null }) {
  if (value === null) {
    return <span className="font-semibold text-muted">null</span>;
  }
  switch (typeof value) {
    case "string":
      return <span className="text-[#3A6E3E]">&quot;{value}&quot;</span>;
    case "number":
      return <span className="text-coral-dark">{String(value)}</span>;
    default:
      return <span className="font-semibold text-[#7C5CB8]">{String(value)}</span>;
  }
}

function Node({
  name,
  value,
  depth,
}: {
  name: string | null;
  value: JsonValue;
  depth: number;
}) {
  const [open, setOpen] = useState(depth < AUTO_EXPAND_DEPTH);

  const label =
    name !== null ? (
      <span className="text-charcoal">&quot;{name}&quot;: </span>
    ) : null;

  if (value === null || typeof value !== "object") {
    return (
      <div className="pl-4">
        {label}
        <Scalar value={value} />
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: [string, JsonValue][] = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v])
    : Object.entries(value as { [key: string]: JsonValue });
  const summary = isArray
    ? `[${entries.length}]`
    : `{${entries.length}}`;

  return (
    <div className="pl-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-baseline gap-1 rounded text-left hover:bg-cream"
      >
        <span className="inline-block w-3 text-xs text-muted" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
        {label}
        <span className="text-muted">{open ? (isArray ? "[" : "{") : summary}</span>
      </button>
      {open && (
        <>
          {entries.map(([key, child]) => (
            <Node
              key={key}
              name={isArray ? null : key}
              value={child}
              depth={depth + 1}
            />
          ))}
          <div className="pl-3 text-muted">{isArray ? "]" : "}"}</div>
        </>
      )}
    </div>
  );
}

export default function JsonTree({ src }: { src: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`fetch failed (${res.status})`);
        const raw = (await res.text()).replace(/^﻿/, "");
        if (cancelled) return;
        try {
          const value = JSON.parse(raw) as JsonValue;
          setState({ status: "ready", raw, value });
        } catch (err) {
          // Invalid JSON is shown as plain text with the parse error, never
          // an error page.
          setState({
            status: "invalid",
            raw,
            parseError: err instanceof Error ? err.message : "Parse error",
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "failed",
            message:
              "This file could not be loaded for viewing. Use the download button above.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const copyRaw = async (raw: string) => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (state.status === "loading") {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading JSON…</p>
    );
  }

  if (state.status === "failed") {
    return (
      <p className="py-16 text-center text-sm text-muted">{state.message}</p>
    );
  }

  const copyButton = (
    <button
      type="button"
      onClick={() => copyRaw(state.raw)}
      className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 bg-white px-4 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-charcoal/30"
    >
      {copied ? (
        <>
          <Check size={13} strokeWidth={2.5} aria-hidden="true" />
          Copied
        </>
      ) : (
        <>
          <Copy size={13} strokeWidth={2} aria-hidden="true" />
          Copy raw JSON
        </>
      )}
    </button>
  );

  if (state.status === "invalid") {
    return (
      <div className="w-full">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-coral-dark">
            Not valid JSON ({state.parseError}). Showing the raw text.
          </p>
          {copyButton}
        </div>
        <pre className="max-h-[75vh] overflow-auto rounded-2xl border border-charcoal/10 bg-white p-5 font-mono text-xs leading-relaxed text-charcoal shadow-sm">
          {state.raw}
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">{copyButton}</div>
      <div className="max-h-[75vh] overflow-auto rounded-2xl border border-charcoal/10 bg-white py-4 pr-5 font-mono text-xs leading-relaxed shadow-sm">
        <Node name={null} value={state.value} depth={0} />
      </div>
    </div>
  );
}
