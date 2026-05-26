// pdfjs-dist ships no "exports" map and keeps its type declarations at
// types/src/pdf.d.ts, so the Node-friendly legacy ESM build has no co-located
// .d.ts for TypeScript to find. The legacy build exposes the same runtime API
// as the main entry, so point its types there.
declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export * from "pdfjs-dist";
}
