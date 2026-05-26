// Decorative hero illustration for the "host a Claude artifact" post.
// Two editor-style panels (Claude → NudgeHost) with a "Copy → Paste → Live link"
// badge. Pure CSS, no real screenshot. Mirrors the v5 mockup .hero-img markup.

function Dots() {
  return (
    <>
      <span className="h-[7px] w-[7px] rounded-full bg-coral" />
      <span className="h-[7px] w-[7px] rounded-full bg-[#F5C542]" />
      <span className="h-[7px] w-[7px] rounded-full bg-sage" />
    </>
  );
}

export function BlogHeroClaude() {
  return (
    <div
      className="relative mb-8 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-[#E8E2DA]"
      style={{
        background:
          "linear-gradient(135deg, #FAE8DF 0%, #F5DCC8 40%, #FBF7F0 100%)",
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-y-6 inset-x-10 flex overflow-hidden rounded-[10px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {/* Left panel: Claude */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-7 items-center gap-[5px] border-b border-[#E8E2DA] bg-cream px-2.5 text-[10px] font-medium text-muted">
            <Dots />
            <span className="ml-2">Claude</span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <div className="h-1.5 w-[85%] rounded-[3px] bg-cream" />
            <div className="h-1.5 w-[70%] rounded-[3px] bg-cream" />
            <div className="h-1.5 w-[85%] rounded-[3px] bg-cream" />
            <div className="h-1.5 w-[50%] rounded-[3px] bg-cream" />
            <div className="h-1.5 w-[70%] rounded-[3px] bg-cream" />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex w-12 items-center justify-center text-xl text-coral">
          →
        </div>

        {/* Right panel: NudgeHost */}
        <div className="flex flex-1 flex-col">
          <div className="flex h-7 items-center gap-[5px] border-b border-[#E8E2DA] bg-coral-light px-2.5 text-[10px] font-medium text-muted">
            <Dots />
            <span className="ml-2">NudgeHost</span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-3">
            <div className="h-1.5 w-[70%] rounded-[3px] bg-coral-light" />
            <div className="h-1.5 w-[50%] rounded-[3px] bg-coral-light" />
            <div className="h-1.5 w-[85%] rounded-[3px] bg-coral-light" />
            <div className="h-1.5 w-[40%] rounded-[3px] bg-coral-light" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3.5 right-5 rounded-md bg-coral px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
        Copy → Paste → Live link
      </div>
    </div>
  );
}
