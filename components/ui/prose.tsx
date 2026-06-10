import { ContextualProse } from "@/components/contextual-prose";

// In-prose link treatment: coral.dark text with a soft peach (#F6DCCF) bottom
// border instead of an underline (so descenders stay clean) that darkens to
// coral.dark on hover. Applied via an `[&_a]` arbitrary variant on a wrapping
// element, whose descendant selector outweighs the default anchor utilities
// emitted by renderTokens().
export const bodyLinkClass =
  "[&_a]:font-medium [&_a]:text-coral-dark [&_a]:no-underline [&_a]:border-b [&_a]:border-[#F6DCCF] [&_a]:transition-colors [&_a:hover]:border-coral-dark";

// Body copy with the in-prose link style applied. A thin wrapper around
// ContextualProse so every template renders contextual links the same way.
export function BodyProse({
  paragraphs,
  salt,
}: {
  paragraphs: string[];
  salt: string;
}) {
  return (
    <div className={bodyLinkClass}>
      <ContextualProse paragraphs={paragraphs} salt={salt} />
    </div>
  );
}
