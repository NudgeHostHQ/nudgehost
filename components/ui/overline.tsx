// Section overline label: a short coral rule followed by an uppercase coral.dark
// label. The alternative to the Eyebrow pill, used for page/section labels in
// the v3 design language. `onDark` brightens the label to plain coral so it
// stays legible on dark (charcoal) backgrounds.
export function Overline({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span aria-hidden="true" className="h-0.5 w-[34px] bg-coral" />
      <span
        className={`text-[12px] font-bold uppercase tracking-widest ${
          onDark ? "text-coral" : "text-coral-dark"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
