import Link from "next/link";
import { ContextualProse, renderTokens } from "@/components/contextual-prose";
import type {
  ContentBlock,
  CompareBlock,
  CtaBlock,
  FaqBlock,
  RelatedBlock,
  ScreenshotBlock,
  StepsBlock,
  TestimonialBlock,
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
      className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl"
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
          className="group flex gap-4 rounded-2xl border border-charcoal/10 bg-warm p-5 transition-colors hover:border-coral/50"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div>
            <p className="font-display text-base font-semibold text-charcoal">
              {step.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {renderTokens(step.desc, salt, `step-${i}`)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CompareCell({
  value,
  salt,
  scope,
}: {
  value: string;
  salt: string;
  scope: string;
}) {
  if (value === "✓") {
    return (
      <span className="text-base font-semibold text-sage" aria-label="Yes">
        ✓
      </span>
    );
  }
  if (value === "✗") {
    return (
      <span className="text-base text-charcoal/25" aria-label="No">
        ✗
      </span>
    );
  }
  return <>{renderTokens(value, salt, scope)}</>;
}

function Compare({ block, salt }: { block: CompareBlock; salt: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal/10">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-charcoal text-left text-white">
            {block.headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-t border-charcoal/10">
              {row.cells.map((cell, ci) => {
                const isNh = ci === row.nhCol;
                const isFeature = ci === 0;
                return (
                  <td
                    key={ci}
                    className={[
                      "px-4 py-3",
                      isNh ? "bg-[rgba(232,112,74,0.06)]" : "",
                      isFeature
                        ? "font-medium text-charcoal"
                        : "text-center text-charcoal/80",
                    ].join(" ")}
                  >
                    <CompareCell value={cell} salt={salt} scope={`cmp-${ri}-${ci}`} />
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
    <div className="flex items-start gap-4 rounded-2xl bg-gradient-to-br from-coral-light to-peach/60 p-6">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral text-xl text-white"
        aria-hidden="true"
      >
        ↗
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-charcoal">
          {block.title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-charcoal/80">
          {renderTokens(block.text, salt, "cta")}
        </p>
        <Link
          href={block.link}
          className="mt-3 inline-block font-medium text-coral-dark underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral"
        >
          {block.label}
        </Link>
      </div>
    </div>
  );
}

function Screenshot({ block }: { block: ScreenshotBlock }) {
  return (
    <figure>
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-coral/30 bg-cream px-6 py-10 text-center">
        <p className="text-sm font-medium text-muted">{block.alt}</p>
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-coral">
          Replace with real screenshot before launch
        </p>
      </div>
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Related({ block, salt }: { block: RelatedBlock; salt: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-warm p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
        Also useful
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
                className="font-display text-base font-semibold text-charcoal underline decoration-coral/30 underline-offset-2 transition-colors hover:decoration-coral"
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
        className="scroll-mt-28 mb-6 font-display text-2xl font-semibold tracking-tight text-charcoal md:text-3xl"
      >
        Frequently asked questions
      </h2>
      <ul className="space-y-3">
        {items.map((faq, i) => (
          <li key={i}>
            <details className="group rounded-2xl border border-charcoal/10 bg-warm p-5 transition-colors hover:border-coral/30">
              <summary className="cursor-pointer list-none font-display text-base font-semibold text-charcoal">
                <span className="flex items-center justify-between">
                  {faq.q}
                  <span
                    className="ml-3 text-coral transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">
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
    <section className="bg-gradient-to-br from-coral to-coral-dark px-6 py-16 text-center text-white">
      <h2 className="mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-base opacity-90">{text}</p>
      <Link
        href={link}
        className="inline-block rounded-full bg-white px-7 py-3.5 text-base font-medium text-coral-dark transition-all hover:-translate-y-0.5 hover:opacity-95"
      >
        {label}
      </Link>
    </section>
  );
}

// Renders the article column: every block except `bottom-cta`, which the page
// shell pulls out and renders full width.
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
            // Rendered full-width by the page shell, not inside the article.
            return null;
          default:
            return null;
        }
      })}
    </div>
  );
}
