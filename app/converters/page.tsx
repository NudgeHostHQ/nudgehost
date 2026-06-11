import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { convertersSilo, convertersContentMap } from "@/lib/converters-content";
import { pageOpenGraph } from "@/lib/og";

export const metadata: Metadata = {
  title: "File Conversion Guides: PDF to JPG, DOCX to PDF, and more",
  description:
    "Short guides to common file conversions using tools you already have, plus free hosting for the result. PDF to JPG, DOCX to PDF, PNG to WebP, HEIC to JPG.",
  alternates: { canonical: "/converters" },
  openGraph: pageOpenGraph("/converters"),
};

const intro = [
  "Sometimes the file you have isn't the file you need: a PDF where an image would do, a Word document that should be a PDF, an iPhone photo that won't open on anything but an iPhone. These guides show how to make each conversion with software you already have, then host the result here and share it as a link.",
  "Common jobs include how to {{converter-pdf-to-jpg}} for slides and posts, and how to {{converter-docx-to-pdf}} before sending anything that matters. Once converted, you can {{host-hub}} and share it as a link.",
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
