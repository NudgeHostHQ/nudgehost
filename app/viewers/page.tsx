import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { viewersSilo, viewersContentMap } from "@/lib/viewers-content";

export const metadata: Metadata = {
  title: "File Viewers — Open PDFs, Word docs, CSVs and JSON online",
  description:
    "Open any file in your browser without installing anything. Free online viewers for PDF, DOCX, CSV, JSON and more.",
  alternates: { canonical: "/viewers" },
};

const intro = [
  "Some files are awkward to open: a PDF on a locked-down laptop, a Word document on a Chromebook, a CSV that looks like noise in a text editor. NudgeHost's viewers render any of them straight in your browser, with nothing to install.",
  "The most-used ones are the {{viewer-pdf}} and the {{viewer-docx}}, but the {{viewer-csv}} and {{viewer-json}} are just as handy for data work. And viewing is only step one — once a file is open, you can {{host-hub}} it and share a link so anyone else opens it just as easily.",
];

export default function ViewersHub() {
  return (
    <SiloHub
      silo={viewersSilo}
      contentMap={viewersContentMap}
      introParagraphs={intro}
      cardCaption={(c) => c.lead}
    />
  );
}
