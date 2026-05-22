import type { Metadata } from "next";
import { SiloHub } from "@/components/silo-hub";
import { devToolsSilo, devToolsContentMap } from "@/lib/dev-tools-content";

export const metadata: Metadata = {
  title: "Free Developer Tools: JSON formatter, Base64, JWT decoder",
  description:
    "Small, fast developer utilities that run in your browser: JSON formatter, Base64 encoder, URL encoder, JWT decoder. All free, nothing logged.",
  alternates: { canonical: "/dev-tools" },
};

const intro = [
  "Development is full of small, repetitive jobs: tidy this JSON, decode that token, encode this URL. NudgeHost's dev tools handle them instantly, in your browser, with nothing logged or uploaded.",
  "The {{dev-json-formatter}} and {{dev-jwt-decoder}} are the ones most people reach for, with {{dev-base64}} close behind. When you need to share a result rather than just read it, you can {{host-hub}} the output and send a link.",
];

export default function DevToolsHub() {
  return (
    <SiloHub
      silo={devToolsSilo}
      contentMap={devToolsContentMap}
      introParagraphs={intro}
      cardCaption={(c) => c.lead}
    />
  );
}
