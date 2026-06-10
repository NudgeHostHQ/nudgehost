// Shared button styling for the marketing site. These are className constants
// (not components) so callers add their own sizing (px/py/text-size/w-full)
// while the brand identity stays in one place.

// Primary action: coral fill, white text, rounded pill, with a hover lift and
// coral glow. Used for "Get started free", "Try it free", and the like.
export const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-coral font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-[0_6px_16px_rgba(224,99,60,0.28)]";

// White button that sits on top of a coral gradient CTA band.
export const btnOnGradient =
  "inline-flex items-center justify-center rounded-full bg-white font-semibold text-coral-dark transition-all hover:-translate-y-0.5 hover:bg-cream";
