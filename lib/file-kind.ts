// File-kind detection shared by the /f/[slug] viewer and the raw-content
// route, so both always agree on which files get which treatment. The
// original types (PDF, image, HTML) check MIME only and are unchanged;
// CSV/JSON also fall back to the filename extension because browsers
// report inconsistent MIME types for them (Windows famously labels .csv
// as application/vnd.ms-excel).

// Caps how much a CSV/JSON view will load into the browser. Bigger files
// get the download card instead.
export const TEXT_VIEW_MAX_BYTES = 10 * 1024 * 1024; // 10MB

// Browser-playable containers only; anything else keeps the download card.
const VIDEO_MIMES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const AUDIO_MIMES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/ogg",
]);

function extension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
}

export function isVideoFile(mime: string): boolean {
  return VIDEO_MIMES.has(mime);
}

export function isAudioFile(mime: string): boolean {
  return AUDIO_MIMES.has(mime);
}

export function isCsvFile(mime: string, filename: string): boolean {
  if (mime === "text/csv" || mime === "text/tab-separated-values") return true;
  return ["csv", "tsv"].includes(extension(filename));
}

export function isJsonFile(mime: string, filename: string): boolean {
  if (mime === "application/json" || mime === "text/json") return true;
  return extension(filename) === "json";
}
