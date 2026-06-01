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

function Steps({ block, salt }: { block: StepsBlock; salt: string }) {
  return (
    <ol className="space-y-4">
      {block.items.map((step, i) => (
        <li
          key={i}
          className="group flex gap-4 rounded-2xl border border-charcoal/10 bg-white px-8 py-7 transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div>
            <p className="font-display text-[17px] font-semibold text-charcoal">
              {step.title}
            </p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted">
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

// NudgeHost column cell: a checkmark that links to the relevant feature page,
// styled sage to match the mockup's .nh-col a rule.
function NhCell({ value }: { value: string }) {
  const t = parseToken(value);
  if (t) {
    const target = internalLinks[t.key];
    const label = t.anchor ?? "✓";
    if (target) {
      return (
        <Link href={target.href} className="font-semibold text-sage hover:underline">
          {label}
        </Link>
      );
    }
    return <span className="font-semibold text-sage">{label}</span>;
  }
  return <span className="font-semibold text-sage">{value}</span>;
}

// A plain comparison value: a sage ✓ or a muted ✗, keeping any parenthetical.
function ValueCell({ value }: { value: string }) {
  if (value.startsWith("✓")) {
    return <span className="font-semibold text-sage">{value}</span>;
  }
  if (value.startsWith("✗")) {
    return <span className="text-charcoal/30">{value}</span>;
  }
  return <>{value}</>;
}

function Compare({ block, salt }: { block: CompareBlock; salt: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#EDE8E2] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#2D2D2D] text-left text-white">
            {block.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-[13px] font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-charcoal/10 transition-colors hover:bg-[#FDF8F3]">
              {row.cells.map((cell, ci) => {
                const isNh = ci === row.nhCol;
                const isFeature = ci === 0;
                return (
                  <td
                    key={ci}
                    className={[
                      "px-4 py-3 align-top",
                      isNh ? "bg-[rgba(232,112,74,0.06)] font-semibold" : "",
                      isFeature ? "font-semibold text-coral" : "",
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
  );
}

function Testimonial({ block, salt }: { block: TestimonialBlock; salt: string }) {
  return (
    <blockquote className="rounded-2xl border border-charcoal/10 border-l-[3px] border-l-coral bg-warm p-6">
      <p className="text-base leading-relaxed text-charcoal/90">
        {renderTokens(block.text, salt, "testimonial")}
      </p>
      {block.attribution && (
        <footer className="mt-3 text-sm font-semibold text-muted">
          {block.attribution}
        </footer>
      )}
    </blockquote>
  );
}

function InlineCta({ block, salt }: { block: CtaBlock; salt: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-coral to-coral-dark px-7 py-6 text-white">
      <strong className="mb-0.5 block text-base font-bold text-white">
        {block.title}
      </strong>
      <div className="text-sm leading-relaxed text-white/90">
        {renderTokens(block.text, salt, "cta")}
      </div>
      <Link
        href={block.link}
        className="mt-3 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-coral no-underline"
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

function Related({ block, salt }: { block: RelatedBlock; salt: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-warm p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
        📖 Also useful
      </p>
      <ul className="space-y-4">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-coral-light text-lg"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div>
              <Link
                href={item.href}
                className="font-display text-[15px] font-bold text-charcoal underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral"
              >
                {item.title}
              </Link>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
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
// the page shell for posts that carry no faq block of their own.
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
            <details className="group overflow-hidden rounded-xl border border-charcoal/10 bg-white transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <summary className="cursor-pointer list-none px-6 py-5 font-display text-base font-semibold text-charcoal transition-colors hover:bg-[#FAF6F1]">
                <span className="flex items-center justify-between">
                  {faq.q}
                  <span
                    className="ml-3 text-muted transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">
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
    <section className="relative overflow-hidden bg-gradient-to-br from-coral to-coral-dark px-6 py-16 text-center text-white before:pointer-events-none before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:content-['']">
      <h2 className="relative mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="relative mx-auto mb-8 max-w-xl text-base opacity-90">{text}</p>
      <Link
        href={link}
        className="relative inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral to-[#D4603A] px-8 py-11 text-center text-white before:pointer-events-none before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:content-['']">
      <h2 className="relative mb-2.5 font-display text-2xl font-bold tracking-tight md:text-[28px]">
        {block.title}
      </h2>
      <p className="relative mx-auto mb-5 max-w-md text-[15px] leading-relaxed opacity-90">
        {block.text}
      </p>
      <Link
        href={block.link}
        className="relative inline-block rounded-lg bg-white px-7 py-3 text-[15px] font-bold text-coral transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
            return <ContextualProse key={i} paragraphs={paras} salt={`${salt}:${i}`} />;
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
