import Link from "next/link";
import { btnOnGradient } from "@/components/ui/button";

// Full-width closing CTA band: coral→coral.dark gradient, white text, with two
// translucent circles overflowing opposite corners. Mirrors the blog post
// bottom CTA. All text is passed in by the caller.
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
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/[0.07]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/[0.07]"
      />
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
