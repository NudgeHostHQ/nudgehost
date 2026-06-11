"use client";

import dynamic from "next/dynamic";

// Lazy boundary so the tree only downloads when a JSON file is being viewed.
const JsonTree = dynamic(() => import("./json-tree"), {
  ssr: false,
  loading: () => (
    <p className="py-16 text-center text-sm text-muted">Loading JSON…</p>
  ),
});

export function JsonViewer({ src }: { src: string }) {
  return <JsonTree src={src} />;
}
