"use client";

import dynamic from "next/dynamic";

// Lazy boundary so papaparse and the table only download when a CSV file is
// actually being viewed, not on every /f/ page.
const CsvTable = dynamic(() => import("./csv-table"), {
  ssr: false,
  loading: () => (
    <p className="py-16 text-center text-sm text-muted">Loading table…</p>
  ),
});

export function CsvViewer({ src }: { src: string }) {
  return <CsvTable src={src} />;
}
