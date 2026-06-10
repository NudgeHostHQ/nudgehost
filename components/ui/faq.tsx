// Shared FAQ accordion list. Native <details>/<summary> so it stays server
// rendered with no client JS. Each item is a white card whose round +/× toggle
// rotates and fills coral when opened, matching the blog FAQ treatment.
//
// Answers are plain strings here (spoke, glossary, and compare FAQ answers carry
// no contextual-link tokens). Callers normalise their FAQ shape to {question,
// answer} before passing it in.

export type FaqAccordionItem = { question: string; answer: string };

export function FaqAccordions({ items }: { items: FaqAccordionItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((faq, i) => (
        <li key={i}>
          <details className="group overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-colors open:border-[#F6DCCF]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[18px] font-semibold text-charcoal">
              <span>{faq.question}</span>
              <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-coral-light text-coral-dark transition-all duration-200 group-open:rotate-45 group-open:bg-coral group-open:text-white"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="px-6 pb-5 text-[15px] leading-relaxed text-muted">
              {faq.answer}
            </p>
          </details>
        </li>
      ))}
    </ul>
  );
}
