import Link from "next/link";
import { ContextualProse, renderTokens } from "@/components/contextual-prose";
import { internalLinks } from "@/lib/internal-links";
import type {
  ContentBlock,
  CompareBlock,
  CtaBlock,
  FaqBlock,
  RelatedBlock,
  ScreenshotBlock,
  StepsBlock,
  TestimonialBlock,
  BottomCtaBlock,
  BlogFaqItem,
} from "@/lib/blog-content";

// Renders the v5 typed content blocks for a blog post. Each block maps to a
// brand-styled component. Prose, step descriptions, table cells, testimonial
// text, related-post descriptions, and FAQ answers all flow through
// renderTokens() so {{key}} contextual links resolve inside them.

// In-article link treatment (#12): coral.dark text with a soft peach underline
// drawn as a bottom border (so descenders stay clean) that darkens on hover.
// Applied via an `[&_a]` arbitrary variant on prose-bearing containers, whose
// descendant selector outweighs the default anchor utilities from renderTokens.
// Kept off the comparison table and "Also useful" titles, which carry their own
// link styles.
export const bodyLinkClass =
  "[&_a]:font-medium [&_a]:text-coral-dark [&_a]:no-underline [&_a]:border-b [&_a]:border-[#F6DCCF] [&_a]:transition-colors [&_a:hover]:border-coral-dark";

function H2({ text, id }: { text: string; id: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-display text-2xl font-semibold leading-[1.2] tracking-tight text-charcoal md:!mt-14 md:text-[32px]"
    >
      {text}
    </h2>
  );
}

function H3({ text }: { text: string }) {
  return (
    <h3 className="font-display text-xl font-semibold tracking-tight text-charcoal">
      {text}
    </h3>
  );
}

// Numbered steps rendered as a connected vertical timeline. A 2px coral.light
// rail runs down the left behind the number circles; each circle carries a 5px
// cream ring (box-shadow) so the rail reads as passing behind it. On mobile the
// number sits as a simple inline marker aligned with the heading's first line.
function Steps({ block, salt }: { block: StepsBlock; salt: string }) {
  return (
    <ol className="space-y-5">
      {block.items.map((step, i) => (
        <li
          key={i}
          className="group flex items-start gap-4 rounded-xl border border-[#E7DFD2] bg-white p-6 shadow-sm transition-all duration-[180ms] hover:-translate-y-0.5 hover:shadow-md"
        >
          <span
            className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-coral text-sm font-semibold leading-none text-white"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div>
            <p className="font-display text-[17px] font-semibold text-charcoal">
              {step.title}
            </p>
            <p className={`mt-1 text-[15px] leading-relaxed text-muted ${bodyLinkClass}`}>
              {renderTokens(step.desc, salt, `step-${i}`)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Parses a string that is exactly one {{key}} or {{key|anchor}} token.
function parseToken(value: string): { key: string; anchor?: string } | null {
  const m = value.match(/^\{\{([a-z0-9-]+)(?:\|([^}]*))?\}\}$/);
  return m ? { key: m[1], anchor: m[2] } : null;
}

// Splits a trailing parenthetical note off a cell value so it can be rendered
// smaller, e.g. "✓ (50MB)" → ["✓ ", "(50MB)"].
function splitNote(value: string): [string, string | null] {
  const m = value.match(/^(.*?)(\([^)]*\))\s*$/);
  return m ? [m[1], m[2]] : [value, null];
}

function CellNote({ note }: { note: string }) {
  return <span className="text-xs opacity-80"> {note}</span>;
}

// NudgeHost column cell: a checkmark that links to the relevant feature page,
// styled coral.dark to read as the highlighted column.
function NhCell({ value }: { value: string }) {
  const t = parseToken(value);
  if (t) {
    const target = internalLinks[t.key];
    const label = t.anchor ?? "✓";
    if (target) {
      return (
        <Link
          href={target.href}
          className="font-semibold text-coral-dark hover:underline"
        >
          {label}
        </Link>
      );
    }
    return <span className="font-semibold text-coral-dark">{label}</span>;
  }
  const [main, note] = splitNote(value);
  return (
    <span className="font-semibold text-coral-dark">
      {main}
      {note && <CellNote note={note} />}
    </span>
  );
}

// A plain comparison value: a sage ✓ or a muted ✗, keeping any parenthetical.
function ValueCell({ value }: { value: string }) {
  const [main, note] = splitNote(value);
  if (value.startsWith("✓")) {
    return (
      <span className="font-semibold text-sage">
        {main}
        {note && <CellNote note={note} />}
      </span>
    );
  }
  if (value.startsWith("✗")) {
    return (
      <span className="text-muted/75">
        {main}
        {note && <CellNote note={note} />}
      </span>
    );
  }
  return (
    <>
      {main}
      {note && <CellNote note={note} />}
    </>
  );
}

// Comparison table with the NudgeHost column highlighted: charcoal header row
// except the NudgeHost header (coral), coral.light body cells in that column,
// cream row hover elsewhere.
function Compare({ block, salt }: { block: CompareBlock; salt: string }) {
  const nhCol = block.rows[0]?.nhCol;
  return (
    <div className="overflow-hidden rounded-xl border border-[#E7DFD2] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-white">
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  className={[
                    "px-4 py-3.5 text-[13px] font-semibold",
                    i === nhCol ? "bg-coral" : "bg-charcoal",
                  ].join(" ")}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className="group border-t border-[#E7DFD2]">
                {row.cells.map((cell, ci) => {
                  const isNh = ci === row.nhCol;
                  const isFeature = ci === 0;
                  return (
                    <td
                      key={ci}
                      className={[
                        "px-4 py-3 align-top transition-colors",
                        isNh
                          ? "bg-coral-light font-semibold text-coral-dark group-hover:bg-[#F6DCCF]"
                          : isFeature
                          ? "bg-white font-semibold text-charcoal group-hover:bg-cream"
                          : "bg-white text-muted group-hover:bg-cream",
                      ].join(" ")}
                    >
                      {isFeature ? (
                        renderTokens(cell, salt, `cmp-${ri}`)
                      ) : isNh ? (
                        <NhCell value={cell} />
                      ) : (
                        <ValueCell value={cell} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Pull-quote callout on a coral.light field with a large decorative opening
// quotation mark anchored to the top-left corner.
function Testimonial({ block, salt }: { block: TestimonialBlock; salt: string }) {
  return (
    <blockquote className="relative rounded-xl border border-[#F6DCCF] bg-coral-light p-7 pt-11">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-3 font-display text-[72px] leading-none text-coral/35"
      >
        &ldquo;
      </span>
      <p
        className={`relative font-display text-[18.5px] leading-relaxed text-charcoal ${bodyLinkClass}`}
      >
        {renderTokens(block.text, salt, "testimonial")}
      </p>
      {block.attribution && (
        <footer className="relative mt-3 text-sm font-semibold text-muted">
          {block.attribution}
        </footer>
      )}
    </blockquote>
  );
}

// Mid-page CTA band: heading + sub on the left, white pill button pushed to the
// right, wrapping on narrow screens.
function InlineCta({ block, salt }: { block: CtaBlock; salt: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-2xl bg-[linear-gradient(120deg,#E8704A,#C4522E)] px-8 py-7 text-white shadow-[0_14px_36px_rgba(196,82,46,0.25)]">
      <div className="min-w-0">
        <strong className="block text-lg font-bold text-white">
          {block.title}
        </strong>
        <div className="mt-1 text-sm leading-relaxed text-white/90">
          {renderTokens(block.text, salt, "cta")}
        </div>
      </div>
      <Link
        href={block.link}
        className="ml-auto shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-coral-dark transition-all hover:-translate-y-0.5 hover:bg-cream"
      >
        {block.label}
      </Link>
    </div>
  );
}

function Screenshot({ block }: { block: ScreenshotBlock }) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-[#E8E2DA] bg-cream px-5 text-center text-sm font-medium text-muted">
      <span>{block.alt}</span>
      {block.caption && (
        <span className="mt-1.5 text-xs font-semibold text-coral">
          {block.caption}
        </span>
      )}
    </div>
  );
}

// "Also useful" block: a white card listing related reads, each with a coral
// icon tile and a divider between items.
function Related({ block, salt }: { block: RelatedBlock; salt: string }) {
  return (
    <div className="rounded-xl border border-[#E7DFD2] bg-white p-6 shadow-sm">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-coral-dark">
        📖 Also useful
      </p>
      <ul>
        {block.items.map((item, i) => (
          <li
            key={i}
            className={`flex gap-4 py-4 ${
              i > 0 ? "border-t border-[#E7DFD2]" : ""
            }`}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-coral-light text-lg"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div>
              <Link
                href={item.href}
                className="font-display text-[17px] font-semibold text-charcoal transition-colors hover:text-coral-dark"
              >
                {item.title}
              </Link>
              <p className={`mt-0.5 text-sm leading-relaxed text-muted ${bodyLinkClass}`}>
                {renderTokens(item.desc, salt, `related-${i}`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Shared FAQ renderer. Used by the in-body `faq` block and, as a fallback, by
// the page shell for posts that carry no faq block of their own. Each item is a
// card whose round +/× toggle rotates and fills coral when opened.
export function BlogFaqList({
  items,
  salt,
}: {
  items: BlogFaqItem[];
  salt: string;
}) {
  return (
    <div>
      <h2
        id="faq"
        className="scroll-mt-28 mb-6 font-display text-2xl font-semibold leading-[1.2] tracking-tight text-charcoal md:text-[32px]"
      >
        Frequently asked questions
      </h2>
      <ul className="space-y-3">
        {items.map((faq, i) => (
          <li key={i}>
            <details className="group overflow-hidden rounded-xl border border-[#E7DFD2] bg-white shadow-sm transition-colors open:border-[#F6DCCF]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[18px] font-semibold text-charcoal">
                <span>{faq.q}</span>
                <span
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-coral-light text-coral-dark transition-all duration-200 group-open:rotate-45 group-open:bg-coral group-open:text-white"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className={`px-6 pb-5 text-[15px] leading-relaxed text-muted ${bodyLinkClass}`}>
                {renderTokens(faq.a, salt, `faq-${i}`)}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq({ block, salt }: { block: FaqBlock; salt: string }) {
  return <BlogFaqList items={block.items} salt={salt} />;
}

// Decorative translucent circles overflowing two corners of a CTA block.
function CtaGlowCircles() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/[0.07]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/[0.07]"
      />
    </>
  );
}

// Full-width coral-gradient CTA. Rendered by the page shell (outside the
// article column), so this component is exported and used there directly.
export function BottomCta({
  title,
  text,
  link,
  label,
}: {
  title: string;
  text: string;
  link: string;
  label: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,#E8704A,#C4522E)] px-6 py-16 text-center text-white">
      <CtaGlowCircles />
      <h2 className="relative mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="relative mx-auto mb-8 max-w-xl text-base text-white/90">
        {text}
      </p>
      <Link
        href={link}
        className="relative inline-block rounded-full bg-white px-7 py-3.5 text-base font-semibold text-coral-dark transition-all hover:-translate-y-0.5 hover:bg-cream"
      >
        {label}
      </Link>
    </section>
  );
}

// Contained, rounded coral-gradient CTA rendered at the end of the article
// column (matches the v5 mockup .bottom-cta box).
function InlineBottomCta({ block }: { block: BottomCtaBlock }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(150deg,#E8704A,#C4522E)] px-8 py-16 text-center text-white shadow-[0_20px_50px_rgba(196,82,46,0.32)]">
      <CtaGlowCircles />
      <h2 className="relative mb-3 font-display text-2xl font-semibold tracking-tight md:text-[30px]">
        {block.title}
      </h2>
      <p className="relative mx-auto mb-7 max-w-md text-[15px] leading-relaxed text-white/90">
        {block.text}
      </p>
      <Link
        href={block.link}
        className="relative inline-block rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-coral-dark transition-all hover:-translate-y-0.5 hover:bg-cream"
      >
        {block.label}
      </Link>
    </div>
  );
}

// Renders the article column. The `bottom-cta` block renders inline here as a
// contained box; posts without one fall back to the page shell's full-width CTA.
export function BlogBlocks({
  blocks,
  salt,
}: {
  blocks: ContentBlock[];
  salt: string;
}) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "prose": {
            const paras = block.text
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean);
            return (
              <div key={i} className={bodyLinkClass}>
                <ContextualProse paragraphs={paras} salt={`${salt}:${i}`} />
              </div>
            );
          }
          case "h2":
            return <H2 key={i} text={block.text} id={block.id} />;
          case "h3":
            return <H3 key={i} text={block.text} />;
          case "steps":
            return <Steps key={i} block={block} salt={`${salt}:${i}`} />;
          case "compare":
            return <Compare key={i} block={block} salt={`${salt}:${i}`} />;
          case "testimonial":
            return <Testimonial key={i} block={block} salt={`${salt}:${i}`} />;
          case "cta":
            return <InlineCta key={i} block={block} salt={`${salt}:${i}`} />;
          case "screenshot":
            return <Screenshot key={i} block={block} />;
          case "related":
            return <Related key={i} block={block} salt={`${salt}:${i}`} />;
          case "faq":
            return <Faq key={i} block={block} salt={`${salt}:${i}`} />;
          case "bottom-cta":
            return <InlineBottomCta key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
