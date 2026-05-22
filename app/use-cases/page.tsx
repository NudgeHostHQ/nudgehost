import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { useCasesSilo, useCasesContentMap } from "@/lib/use-cases-content";

export const metadata: Metadata = {
  title: "Use Cases: real ways people share files with NudgeHost",
  description:
    "Practical guides for sharing files: send a resume as a link, share a portfolio with a recruiter, send a large PDF without email, and more.",
  alternates: { canonical: "/use-cases" },
};

const intro = [
  "NudgeHost is a general tool, but most people arrive with one specific job in mind. These guides walk through the common ones end to end: the right format, the right settings, and the link at the end of it.",
  "Job hunters tend to start by learning how to {{use-case-resume-link}} or how to {{use-case-recruiter}}. People sending big files want to {{use-case-large-pdf}}. Whatever the job, the underlying step is the same: {{home}}.",
];

export default function UseCasesHub() {
  return (
    <SiloHub
      silo={useCasesSilo}
      contentMap={useCasesContentMap}
      introParagraphs={intro}
      cardCaption={(c) => c.lead}
    />
  );
}
