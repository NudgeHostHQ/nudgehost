import type { ReactNode } from "react";

// Shared pricing plan card so the homepage pricing section and the /pricing page
// render identically. The card chrome lives here; each page passes its own
// (unchanged) copy and its own CTA button as children. The featured plan gets a
// 2px coral border, a deeper coral shadow, and an inline "Most popular" label at
// the top of its content rather than a floating pill.
export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  featured,
  children,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={
        featured
          ? "relative flex h-full flex-col rounded-xl border-2 border-coral bg-white p-7 shadow-[0_14px_38px_rgba(196,82,46,0.16)]"
          : "relative flex h-full flex-col rounded-xl border border-line bg-white p-7 shadow-sm"
      }
    >
      {featured && (
        <p className="mb-3 text-[11.5px] font-bold uppercase tracking-widest text-coral-dark">
          Most popular
        </p>
      )}
      <h3 className="font-display text-[22px] font-semibold">{name}</h3>
      <p className="mt-1 font-display text-[44px] font-semibold leading-none tracking-tight">
        {price}
        <span className="font-sans text-base font-normal text-muted">
          {" "}/ {period}
        </span>
      </p>
      <p className="mt-3 text-sm text-muted">{description}</p>
      <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-muted">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-coral" aria-hidden="true">
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">{children}</div>
    </article>
  );
}
