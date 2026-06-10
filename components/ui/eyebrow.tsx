// Eyebrow pill shown above a page H1: uppercase coral.dark text on a coral.light
// pill. Content is passed in; this component adds no text of its own.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-coral-light px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-coral-dark">
      {children}
    </span>
  );
}
