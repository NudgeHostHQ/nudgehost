import Link from "next/link";
import { btnOnGradient } from "@/components/ui/button";

// Full-width closing CTA band: coral→coral.dark gradient, white text, with a
// large "nudge." wordmark bleeding off the bottom-right corner as a faint
// watermark. Mirrors the blog post bottom CTA. All text is passed in by the
// caller.
export function CtaSection({
  heading,
  text,
  href,
  label,
}: {
  heading: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,#E8704A,#C4522E)] px-6 py-16 text-center text-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[60px] -right-[40px] whitespace-nowrap font-display text-[140px] font-semibold italic leading-none text-white/[0.06] md:-bottom-[85px] md:text-[230px]"
      >
        nudge.
      </span>
      <h2 className="relative mb-3 font-display text-2xl font-semibold tracking-tight md:text-4xl">
        {heading}
      </h2>
      <p className="relative mx-auto mb-8 max-w-xl text-base text-white/90">
        {text}
      </p>
      <Link href={href} className={`relative ${btnOnGradient} px-7 py-3.5 text-base`}>
        {label}
      </Link>
    </section>
  );
}
