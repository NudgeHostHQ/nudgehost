import "server-only";
import yauzl from "yauzl";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";

// Unpack-and-serve for ZIP uploads. A confirmed ZIP is exploded into one R2
// object per file under sites/{fileId}/, the row is marked kind="site" with
// an entryPath, and /f/[slug]/[...path] serves the objects directly. The
// original archive is deleted after a successful unpack: the unpacked objects
// are the only copy anything reads, so keeping the archive would store every
// site twice for no reader. fileKey on a site row is therefore a dangling
// pointer; deleting a missing key is a no-op in R2, so the cleanup paths can
// still treat it like any other key.

// Hard ceiling on files extracted from one archive, independent of size.
export const SITE_MAX_ENTRIES = 200;
// An archive whose central directory claims more raw entries than this is
// rejected before we walk it; even all-junk archives shouldn't be this big.
const RAW_ENTRY_CEILING = 5000;
// R2 keys max out at 1024 bytes; leave room for the sites/{fileId}/ prefix.
const MAX_ENTRY_PATH_LENGTH = 900;

// OS noise that gets silently skipped (not rejected) at any depth.
const JUNK_BASENAMES = new Set([".ds_store", "thumbs.db", "desktop.ini"]);

const ZIP_MIME_TYPES = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
]);

export function siteObjectPrefix(fileId: string): string {
  return `sites/${fileId}/`;
}

// Extension or declared MIME says ZIP. This is only the cheap hint; callers
// must also check hasZipMagic on the actual bytes so a renamed .docx (also a
// ZIP container) or a mislabeled text file never gets unpacked by accident.
export function isZipUpload(filename: string, mimeType: string): boolean {
  if (ZIP_MIME_TYPES.has(mimeType.toLowerCase())) return true;
  return filename.toLowerCase().endsWith(".zip");
}

// Local-file-header signature PK\x03\x04. Empty archives (PK\x05\x06) are
// deliberately excluded; with no entries there is nothing to serve.
export function hasZipMagic(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  );
}

// MIME by extension for served site assets. Anything unknown falls back to
// application/octet-stream, which browsers download rather than execute.
const CONTENT_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  json: "application/json",
  map: "application/json",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  ico: "image/x-icon",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml",
  pdf: "application/pdf",
  wasm: "application/wasm",
  webmanifest: "application/manifest+json",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
};

function pathExtension(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1);
  const dot = base.lastIndexOf(".");
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : "";
}

export function contentTypeForPath(path: string): string {
  return CONTENT_TYPES[pathExtension(path)] ?? "application/octet-stream";
}

export function isHtmlPath(path: string): boolean {
  const ext = pathExtension(path);
  return ext === "html" || ext === "htm";
}

// Build-tool output like index-BX7k9aQ2.js or main.8a3b5c9d.chunk.css embeds
// a content hash in the filename, so the bytes behind a given name never
// change and the asset can be cached hard. Heuristic: a dot- or dash-set-off
// token of 8+ [a-zA-Z0-9_-] characters containing at least one digit, right
// before the extension chain.
export function isHashedAssetPath(path: string): boolean {
  const base = path.slice(path.lastIndexOf("/") + 1);
  const match = base.match(/[.-]([a-zA-Z0-9_-]{8,})(?:\.[a-z0-9]+)+$/);
  return match !== null && /[0-9]/.test(match[1]);
}

// User-facing rejection. Anything else thrown during unpack is a real bug or
// an infrastructure failure and surfaces as the generic retry message.
class SiteZipError extends Error {}

type KeptEntry = { path: string; entry: yauzl.Entry };

type SiteZipPlan = {
  zip: yauzl.ZipFile;
  kept: KeptEntry[];
  entryPath: string;
  declaredTotal: number;
};

export type UnpackResult =
  | { ok: true; entryPath: string; fileCount: number }
  | { ok: false; error: string };

function openZipBuffer(buffer: Buffer): Promise<yauzl.ZipFile> {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zip) => {
      if (err || !zip) {
        reject(
          new SiteZipError(
            "We could not read that ZIP file. Please re-zip the folder and try again.",
          ),
        );
      } else {
        resolve(zip);
      }
    });
  });
}

function readAllEntries(zip: yauzl.ZipFile): Promise<yauzl.Entry[]> {
  return new Promise((resolve, reject) => {
    const entries: yauzl.Entry[] = [];
    zip.on("entry", (entry: yauzl.Entry) => {
      entries.push(entry);
      zip.readEntry();
    });
    zip.on("end", () => resolve(entries));
    zip.on("error", () =>
      reject(
        new SiteZipError(
          "We could not read that ZIP file. Please re-zip the folder and try again.",
        ),
      ),
    );
    zip.readEntry();
  });
}

// Zip-slip guard. Rejects (throws) on anything that could escape the
// sites/{fileId}/ prefix: ".." or "." segments, absolute paths, drive
// letters, backslashes, null bytes, empty segments.
function assertSafeEntryPath(rawPath: string): void {
  const reject = () => {
    throw new SiteZipError(
      "That ZIP contains an unsafe file path, so it was not unpacked.",
    );
  };
  if (rawPath.includes("\0") || rawPath.includes("\\")) reject();
  if (rawPath.startsWith("/") || /^[a-zA-Z]:/.test(rawPath)) reject();
  if (rawPath.length > MAX_ENTRY_PATH_LENGTH) reject();
  for (const segment of rawPath.split("/")) {
    if (segment === "" || segment === "." || segment === "..") reject();
  }
}

// OS junk skipped without error: __MACOSX resource forks, Finder/Explorer
// metadata, and dotfiles at any depth. .well-known is the one dot-path kept,
// since real sites ship verification files under it.
function isJunkEntryPath(path: string): boolean {
  for (const segment of path.split("/")) {
    if (segment === "__MACOSX") return true;
    if (JUNK_BASENAMES.has(segment.toLowerCase())) return true;
    if (segment.startsWith(".") && segment !== ".well-known") return true;
  }
  return false;
}

function isSymlinkEntry(entry: yauzl.Entry): boolean {
  // Unix mode lives in the high 16 bits; 0xA000 is S_IFLNK.
  return ((entry.externalFileAttributes >>> 16) & 0xf000) === 0xa000;
}

// Validate the archive and decide what to extract. Throws SiteZipError with a
// user-facing message on any rejection; performs no writes.
async function analyzeSiteZip(
  zipBuffer: Buffer,
  maxTotalBytes: number,
): Promise<SiteZipPlan> {
  const zip = await openZipBuffer(zipBuffer);

  if (zip.entryCount > RAW_ENTRY_CEILING) {
    zip.close();
    throw new SiteZipError(
      `That ZIP holds too many files. The limit is ${SITE_MAX_ENTRIES} files per site.`,
    );
  }

  const entries = await readAllEntries(zip);
  const kept: KeptEntry[] = [];
  let declaredTotal = 0;

  for (const entry of entries) {
    const rawPath = entry.fileName;
    if (rawPath.endsWith("/")) continue; // directory marker

    assertSafeEntryPath(rawPath);
    if (isJunkEntryPath(rawPath)) continue;

    if (isSymlinkEntry(entry)) {
      throw new SiteZipError(
        "That ZIP contains a symbolic link, which sites cannot include.",
      );
    }
    if ((entry.generalPurposeBitFlag & 0x1) !== 0) {
      throw new SiteZipError(
        "That ZIP is password protected. Please upload an unprotected ZIP.",
      );
    }
    // No recursion into archives inside the archive.
    if (rawPath.toLowerCase().endsWith(".zip")) {
      throw new SiteZipError(
        "That ZIP contains another ZIP inside it. Please unpack it and zip just the site files.",
      );
    }

    kept.push({ path: rawPath, entry });
    if (kept.length > SITE_MAX_ENTRIES) {
      throw new SiteZipError(
        `That ZIP holds too many files. The limit is ${SITE_MAX_ENTRIES} files per site.`,
      );
    }
    declaredTotal += entry.uncompressedSize;
  }

  if (kept.length === 0) {
    throw new SiteZipError(
      "That ZIP has no usable files in it. Please zip your site folder and try again.",
    );
  }

  // First gate on the size cap: the sizes the archive declares for itself.
  // The extract loop enforces the same cap on the bytes actually inflated, so
  // a bomb that lies in its headers still gets cut off mid-extract.
  if (declaredTotal > maxTotalBytes) {
    throw new SiteZipError(
      "The unpacked site is bigger than the file size limit on your plan. Try a smaller build or upgrade for more room.",
    );
  }

  // Exports commonly wrap everything in a single folder ("dist/", "my-app/").
  // Strip shared wrapper folders so the site serves from the prefix root and
  // the wrapper never shows up in URLs. Bounded in case of pathological depth.
  for (let depth = 0; depth < 16; depth++) {
    if (!kept.every(({ path }) => path.includes("/"))) break;
    const first = kept[0].path.split("/")[0];
    if (!kept.every(({ path }) => path.split("/")[0] === first)) break;
    for (const item of kept) {
      item.path = item.path.slice(first.length + 1);
    }
  }

  // Entry point: the shallowest index.html after unwrapping; ties go to
  // archive order.
  let entryPath = "";
  let entryDepth = Number.MAX_SAFE_INTEGER;
  for (const { path } of kept) {
    const base = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
    if (base !== "index.html") continue;
    const pathDepth = path.split("/").length;
    if (pathDepth < entryDepth) {
      entryDepth = pathDepth;
      entryPath = path;
    }
  }
  if (!entryPath) {
    throw new SiteZipError(
      "We could not find an index.html in that ZIP. Add one so we know which page to serve first.",
    );
  }

  return { zip, kept, entryPath, declaredTotal };
}

// Inflate one entry to a buffer, failing once the running total for the whole
// archive would pass the cap. yauzl additionally errors out when an entry
// inflates past its declared size, so both layers hold the cap.
function inflateEntry(
  zip: yauzl.ZipFile,
  entry: yauzl.Entry,
  remainingBytes: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zip.openReadStream(entry, (err, stream) => {
      if (err || !stream) {
        reject(
          new SiteZipError(
            "We could not read that ZIP file. Please re-zip the folder and try again.",
          ),
        );
        return;
      }
      const chunks: Buffer[] = [];
      let total = 0;
      stream.on("data", (chunk: Buffer) => {
        total += chunk.length;
        if (total > remainingBytes) {
          stream.destroy();
          reject(
            new SiteZipError(
              "The unpacked site is bigger than the file size limit on your plan. Try a smaller build or upgrade for more room.",
            ),
          );
          return;
        }
        chunks.push(chunk);
      });
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", () =>
        reject(
          new SiteZipError(
            "We could not read that ZIP file. Please re-zip the folder and try again.",
          ),
        ),
      );
    });
  });
}

// Validation-only pass, for callers that need to know the archive is good
// before tearing down what it will replace. Performs no writes.
export async function planSiteUnpack(
  zipBuffer: Buffer,
  maxTotalBytes: number,
): Promise<UnpackResult> {
  try {
    const plan = await analyzeSiteZip(zipBuffer, maxTotalBytes);
    plan.zip.close();
    return {
      ok: true,
      entryPath: plan.entryPath,
      fileCount: plan.kept.length,
    };
  } catch (err) {
    if (err instanceof SiteZipError) return { ok: false, error: err.message };
    return {
      ok: false,
      error: "We could not unpack that ZIP. Please try again.",
    };
  }
}

// Validate and extract an archive into sites/{fileId}/. Fail closed: any
// rejection or write failure returns ok: false and the caller is expected to
// clean up partially written objects with deleteSiteObjects.
export async function unpackZipToSite(opts: {
  fileId: string;
  zipBuffer: Buffer;
  maxTotalBytes: number;
}): Promise<UnpackResult> {
  let plan: SiteZipPlan;
  try {
    plan = await analyzeSiteZip(opts.zipBuffer, opts.maxTotalBytes);
  } catch (err) {
    if (err instanceof SiteZipError) return { ok: false, error: err.message };
    return {
      ok: false,
      error: "We could not unpack that ZIP. Please try again.",
    };
  }

  const prefix = siteObjectPrefix(opts.fileId);
  try {
    let remaining = opts.maxTotalBytes;
    for (const { path, entry } of plan.kept) {
      const body = await inflateEntry(plan.zip, entry, remaining);
      remaining -= body.length;

      const key = `${prefix}${path}`;
      // Belt-and-braces re-check of the invariant every key must satisfy.
      if (!key.startsWith(prefix) || key.includes("..")) {
        throw new SiteZipError(
          "That ZIP contains an unsafe file path, so it was not unpacked.",
        );
      }
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: body,
          ContentType: contentTypeForPath(path),
        }),
      );
    }
  } catch (err) {
    if (err instanceof SiteZipError) return { ok: false, error: err.message };
    return {
      ok: false,
      error: "We could not unpack that ZIP. Please try again.",
    };
  } finally {
    plan.zip.close();
  }

  return { ok: true, entryPath: plan.entryPath, fileCount: plan.kept.length };
}

// Remove every unpacked object under sites/{fileId}/, in DeleteObjects
// batches (R2 takes up to 1000 keys per call). Throws on failure so callers
// decide whether that's fatal (cron retries next run) or best-effort.
export async function deleteSiteObjects(fileId: string): Promise<void> {
  const prefix = siteObjectPrefix(fileId);
  let continuationToken: string | undefined;

  do {
    const listed = await r2.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    const keys = (listed.Contents ?? [])
      .map((object) => object.Key)
      .filter((key): key is string => Boolean(key));

    if (keys.length > 0) {
      await r2.send(
        new DeleteObjectsCommand({
          Bucket: R2_BUCKET,
          Delete: { Objects: keys.map((key) => ({ Key: key })), Quiet: true },
        }),
      );
    }
    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined;
  } while (continuationToken);
}

// The anonymous attribution banner, injected into every served HTML page of
// an anonymous site at response time. The stored objects are never modified;
// a page is stamped on its way out, and once the file is adopted into an
// account (anonToken cleared) the same bytes serve clean. Inline styles only,
// since the user's page has no reason to carry our stylesheet. Mirrors the
// bar the /f/[slug] viewer shows for anonymous single HTML files.
export function injectAnonBanner(html: string, slug: string): string {
  const reportHref = `mailto:support@nudgehost.com?subject=${encodeURIComponent(
    `Report abuse: ${slug}`,
  )}`;
  const banner =
    `<div style="position:fixed;left:0;right:0;bottom:0;z-index:2147483647;pointer-events:none;">` +
    `<div style="display:flex;align-items:center;justify-content:center;gap:10px;border-top:1px solid #E7DFD2;background:#FBF7F0;padding:8px 16px;font:13px/1.4 system-ui,sans-serif;color:#2C2824;">` +
    `<a href="https://www.nudgehost.com/" style="pointer-events:auto;color:#2C2824;font-weight:700;font-size:15px;text-decoration:none;">nudge<span style="color:#E8704A;">host</span></a>` +
    `<span style="color:#7A6F65;">Hosted free on NudgeHost</span>` +
    `<span style="color:#7A6F65;" aria-hidden="true">&middot;</span>` +
    `<a href="${reportHref}" style="pointer-events:auto;color:#7A6F65;">Report</a>` +
    `</div></div>`;

  const lower = html.toLowerCase();
  const bodyClose = lower.lastIndexOf("</body");
  if (bodyClose === -1) return html + banner;
  return html.slice(0, bodyClose) + banner + html.slice(bodyClose);
}
