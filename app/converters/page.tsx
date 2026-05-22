import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { convertersSilo, convertersContentMap } from "@/lib/converters-content";

export const metadata: Metadata = {
  title: "Free File Converters — PDF to JPG, DOCX to PDF, and more",
  description:
    "Convert files in your browser, free and without watermarks. PDF to JPG, DOCX to PDF, PNG to WebP, HEIC to JPG and more.",
  alternates: { canonical: "/converters" },
};

const intro = [
  "Sometimes the file you have isn't the file you need: a PDF where an image would do, a Word document that should be a PDF, an iPhone photo that won't open on anything but an iPhone. NudgeHost's converters fix the format mismatch, free and without watermarks.",
  "Common jobs include {{converter-pdf-to-jpg}} for turning documents into images and {{converter-docx-to-pdf}} for locking Word formatting in place. Once converted, you can {{host-hub}} the result and share it as a link.",
];

export default function ConvertersHub() {
  return (
    <SiloHub
      silo={convertersSilo}
      contentMap={convertersContentMap}
      introParagraphs={intro}
      cardCaption={(c) => c.lead}
    />
  );
}
