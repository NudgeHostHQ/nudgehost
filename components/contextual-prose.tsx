import Link from "next/link";
import { internalLinks, pickAnchor } from "@/lib/internal-links";

// Renders a paragraph of body copy that may contain contextual-link tokens.
//
// Tokens look like {{host-pdf}} — a key from lib/internal-links.ts. At render
// time the token is replaced with a real <Link>, and the anchor text is chosen
// from that destination's `anchors` list, varied per page via the `salt`.
//
// Body copy therefore never hard-codes anchor text or hrefs. The author writes
// a sentence designed around the link, e.g.:
//
//   "If you need a flat image instead of a clickable file, you can {{converter-pdf-to-jpg}} in seconds."
//
// and the renderer turns {{converter-pdf-to-jpg}} into, say,
//   <Link href="/converters/pdf-to-jpg">turn a PDF into images</Link>
//
// The surrounding words ("flat image", "clickable file") supply the topical
// context that makes this a strong contextual link rather than boilerplate.

const TOKEN = /\{\{([a-z0-9-]+)\}\}/gi;

function renderParagraph(text: string, salt: string, paraIndex: number) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let linkCount = 0;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(text)) !== null) {
    const [token, key] = match;
    const start = match.index;

    // Text before the token
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const target = internalLinks[key];
    if (target) {
      // Salt the anchor with page + paragraph + occurrence so the same
      // destination linked twice on one page still varies its anchor.
      const anchor = pickAnchor(key, `${salt}:${paraIndex}:${linkCount}`);
      nodes.push(
        <Link
          key={`${key}-${start}`}
          href={target.href}
          className="font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral"
        >
          {anchor}
        </Link>
      );
      linkCount++;
    } else {
      // Unknown key — render the token text plainly so a typo is visible,
      // not silently dropped.
      nodes.push(token);
    }

    lastIndex = start + token.length;
  }

  // Trailing text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function ContextualProse({
  paragraphs,
  salt,
}: {
  // Each string is one paragraph; may contain {{key}} tokens.
  paragraphs: string[];
  // Usually the page slug — keeps anchor-text choice stable per page
  // but varied across the site.
  salt: string;
}) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-charcoal/85">
      {paragraphs.map((para, i) => (
        <p key={i}>{renderParagraph(para, salt, i)}</p>
      ))}
    </div>
  );
}
