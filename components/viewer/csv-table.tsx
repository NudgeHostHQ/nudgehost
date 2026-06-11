"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

const MAX_RENDERED_ROWS = 500;

type ParseState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; header: string[]; rows: string[][]; totalRows: number };

// Renders a CSV as an HTML table. Parsing goes through papaparse (quoted
// fields, embedded commas and newlines, delimiter detection), never naive
// splitting. All cell content renders as React text nodes, so values are
// escaped and can't inject markup. The first MAX_RENDERED_ROWS rows render;
// bigger files keep the download button in the header for the rest.
export default function CsvTable({ src }: { src: string }) {
  const [state, setState] = useState<ParseState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`fetch failed (${res.status})`);
        // Strip a UTF-8 BOM so the first header cell doesn't carry it.
        const text = (await res.text()).replace(/^﻿/, "");
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
        if (cancelled) return;
        const data = parsed.data;
        if (data.length === 0) {
          setState({ status: "error", message: "This file has no rows." });
          return;
        }
        const [header, ...rest] = data;
        setState({
          status: "ready",
          header,
          rows: rest.slice(0, MAX_RENDERED_ROWS),
          totalRows: rest.length,
        });
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
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

  if (state.status === "loading") {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading table…</p>
    );
  }

  if (state.status === "error") {
    return (
      <p className="py-16 text-center text-sm text-muted">{state.message}</p>
    );
  }

  return (
    <div className="w-full">
      {state.totalRows > state.rows.length && (
        <p className="mb-3 text-center text-xs text-muted">
          Showing first {state.rows.length} of{" "}
          {state.totalRows.toLocaleString()} rows. Download the file for the
          rest.
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-cream text-left">
              {state.header.map((cell, i) => (
                <th
                  key={i}
                  scope="col"
                  className="whitespace-nowrap px-3 py-2.5 font-semibold text-charcoal"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row, r) => (
              <tr
                key={r}
                className={r % 2 === 0 ? "bg-white" : "bg-cream/40"}
              >
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className="whitespace-nowrap px-3 py-2 text-charcoal/80"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
