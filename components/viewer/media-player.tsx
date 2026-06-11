"use client";

import { useState } from "react";
import { Download } from "lucide-react";

// Native <video>/<audio> playback for the /f/[slug] viewer. No player
// library: browsers ship controls, and the formats we embed (H.264 MP4,
// WebM, MP3, WAV, M4A, OGG) play natively. If the browser can't decode the
// codec inside the container, the element fires an error and this swaps to
// a download card instead of a broken player. No transcoding is attempted.
export function MediaPlayer({
  kind,
  src,
  filename,
  downloadUrl,
}: {
  kind: "video" | "audio";
  src: string;
  filename: string;
  downloadUrl: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div
          className="mb-5 flex items-center justify-center rounded-2xl bg-coral-light text-2xl"
          style={{ height: "56px", width: "56px" }}
          aria-hidden="true"
        >
          {kind === "video" ? "🎬" : "🎵"}
        </div>
        <h2 className="mb-2 max-w-lg break-words font-display text-2xl font-semibold tracking-tight">
          {filename}
        </h2>
        <p className="mb-8 max-w-sm text-sm text-muted">
          Your browser can&apos;t play this {kind} inline. Download it and it
          will open in your usual player.
        </p>
        <a
          href={downloadUrl}
          className="inline-flex items-center gap-2 rounded-full bg-coral px-7 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
        >
          <Download size={18} strokeWidth={2} aria-hidden="true" />
          Download this file
        </a>
      </div>
    );
  }

  if (kind === "video") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption -- user-uploaded
      // video; no caption track exists to offer.
      <video
        controls
        preload="metadata"
        src={src}
        onError={() => setFailed(true)}
        className="max-h-[85vh] w-full max-w-full rounded-2xl border border-charcoal/10 bg-black shadow-sm"
      />
    );
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-charcoal/10 bg-warm px-6 py-8 shadow-sm">
      <p className="mb-4 truncate text-center text-sm font-medium text-charcoal">
        {filename}
      </p>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        controls
        preload="metadata"
        src={src}
        onError={() => setFailed(true)}
        className="w-full"
      />
    </div>
  );
}
