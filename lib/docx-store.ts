import "server-only";
import mammoth from "mammoth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "@/lib/r2";
import { deleteObjectsUnderPrefix } from "@/lib/site-store";

// Render-once pipeline for .docx uploads. At upload confirm the buffer goes
// through mammoth exactly once, the HTML is sanitized and stored as a single
// R2 object under derived/{fileId}/, and the viewer serves that stored HTML
// in its sandboxed iframe. The original .docx at fileKey is never touched; it
// stays the download. Conversion failure is never an upload failure: the
// caller leaves the row as a plain downloadable file (kind "file") and the
// viewer shows the download card, so a corrupt, encrypted, or renamed-ZIP
// .docx degrades to exactly what every other binary gets.

// One HTML object per file, alongside (not inside) the original. The derived/
// prefix is per-file so the same prefix cleanup that reclaims sites/{id}/
// works here.
export function derivedObjectPrefix(fileId: string): string {
  return `derived/${fileId}/`;
}

export function docxHtmlKey(fileId: string): string {
  return `${derivedObjectPrefix(fileId)}document.html`;
}

// Extension is the only cheap hint. Callers must also check hasZipMagic on
// the bytes (DOCX is zipped XML); whether it really contains a Word document
// (word/document.xml) is decided by letting mammoth try, since mammoth fails
// fast on a ZIP that isn't a DOCX and that failure is the plain-file
// fallback anyway.
export function isDocxUpload(filename: string): boolean {
  return filename.toLowerCase().endsWith(".docx");
}

// Ceiling for the stored HTML object. Images are budgeted to leave headroom
// for the document text; a document whose text alone blows the ceiling falls
// back to download-only rather than storing a multi-megabyte page.
const HTML_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_BUDGET_BYTES = 4 * 1024 * 1024;

// Neutral block shown in place of images dropped by the budget. The download
// always has the full document, so nothing is said to the user.
const IMAGE_PLACEHOLDER_SRC = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270"><rect width="100%" height="100%" fill="#F1ECE3"/></svg>',
).toString("base64")}`;

// ---------------------------------------------------------------------------
// Sanitizer. Mammoth's output is well-formed and it entity-escapes all text
// content, but the source document is user-controlled, so the stored HTML is
// rebuilt against an allowlist of mammoth's known output element set rather
// than trusted. Everything not allowlisted is dropped: unknown tags lose
// their tags (content kept), script/style-like containers lose their content
// too, attributes are reduced to the few each tag needs, and URL attributes
// must carry a safe scheme or they vanish.

const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "ul", "ol", "li", "blockquote", "pre", "code",
  "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption",
  "strong", "em", "b", "i", "u", "s", "sub", "sup",
  "br", "hr", "a", "img",
]);

// Containers whose inner content is dangerous or meaningless on its own, so
// tag and content both go.
const DROP_CONTENT_TAGS = new Set([
  "script", "style", "iframe", "object", "embed",
  "svg", "math", "head", "title", "noscript", "template",
]);

// Per-tag attribute allowlist. href/id on anchors cover mammoth's footnote
// links, id on li covers the footnote list items they point at.
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "id"]),
  img: new Set(["src", "alt"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan"]),
  li: new Set(["id"]),
};

const TAG_RE = /<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)\s*>/g;
const ATTR_RE = /([a-zA-Z][a-zA-Z0-9:_-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;

// Minimal entity decode so a scheme can't hide behind &#106;avascript:.
// Browsers decode entities in attribute values before resolving URLs, so the
// scheme check has to look at the decoded form.
function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (_m, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);?/g, (_m, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10)),
    )
    .replace(/&(amp|lt|gt|quot|apos);/gi, (_m, name: string) => {
      const map: Record<string, string> = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
      };
      return map[name.toLowerCase()];
    });
}

// Decoded, lowercased view of a URL value with control characters and spaces
// removed, the form a browser effectively parses the scheme from.
function urlProbe(value: string): string {
  let out = "";
  for (const ch of decodeEntities(value)) {
    if (ch.codePointAt(0)! > 0x20) out += ch;
  }
  return out.toLowerCase();
}

function isSafeHref(value: string): boolean {
  const probe = urlProbe(value);
  return (
    probe.startsWith("#") ||
    probe.startsWith("http://") ||
    probe.startsWith("https://") ||
    probe.startsWith("mailto:")
  );
}

// data:image/* covers the data URIs the conversion itself emits; inside an
// <img> element image documents never run script, so svg+xml is fine here.
function isSafeImgSrc(value: string): boolean {
  const probe = urlProbe(value);
  return (
    probe.startsWith("data:image/") ||
    probe.startsWith("http://") ||
    probe.startsWith("https://")
  );
}

function sanitizeAttrs(tag: string, rawAttrs: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";
  let out = "";
  for (const match of rawAttrs.matchAll(ATTR_RE)) {
    const name = match[1].toLowerCase();
    if (!allowed.has(name)) continue;
    // No on* ever, even if a future allowlist edit slips one in.
    if (name.startsWith("on")) continue;
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (tag === "a" && name === "href" && !isSafeHref(value)) continue;
    if (tag === "img" && name === "src" && !isSafeImgSrc(value)) continue;
    // Values are emitted in double quotes; the captured text keeps mammoth's
    // entity escaping, only embedded double quotes need re-encoding.
    out += ` ${name}="${value.replace(/"/g, "&quot;")}"`;
  }
  return out;
}

export function sanitizeDocxHtml(html: string): string {
  const input = html.replace(/<!--[\s\S]*?-->/g, "");
  let out = "";
  let last = 0;
  // Inside a drop-content container this counts same-name nesting depth;
  // everything is discarded until it closes.
  let dropTag: string | null = null;
  let dropDepth = 0;

  for (const match of input.matchAll(TAG_RE)) {
    const [whole, closing, rawName, rawAttrs, selfClose] = match;
    const name = rawName.toLowerCase();
    const text = input.slice(last, match.index);
    last = match.index + whole.length;

    if (dropTag) {
      if (name === dropTag && !selfClose) {
        dropDepth += closing ? -1 : 1;
        if (dropDepth <= 0) dropTag = null;
      }
      continue; // swallow the text and the tag
    }
    out += text;

    if (DROP_CONTENT_TAGS.has(name)) {
      if (!closing && !selfClose) {
        dropTag = name;
        dropDepth = 1;
      }
      continue;
    }
    if (!ALLOWED_TAGS.has(name)) continue; // tag dropped, content kept

    if (closing) {
      out += `</${name}>`;
    } else {
      out += `<${name}${sanitizeAttrs(name, rawAttrs)}${selfClose ? " /" : ""}>`;
    }
  }
  out += input.slice(last);
  return out;
}

// ---------------------------------------------------------------------------
// Wrapper document. The sanitized fragment is set into a fixed shell whose
// style block is ours, not the document's (the sanitizer strips any styles
// the source carried): white page, readable measure, system type. It renders
// inside the viewer's sandboxed iframe on a presigned R2 URL, a separate
// origin from the app, so no app styles or fonts reach it.
function wrapDocxHtml(bodyHtml: string): string {
  return (
    "<!doctype html>" +
    '<html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    "<style>" +
    "body{margin:0;background:#fff;color:#2c2824;" +
    'font:16px/1.65 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;' +
    "-webkit-text-size-adjust:100%;}" +
    "article{max-width:760px;margin:0 auto;padding:48px 24px 96px;}" +
    "h1,h2,h3,h4,h5,h6{line-height:1.25;margin:1.6em 0 0.6em;}" +
    "h1{font-size:1.9em;}h2{font-size:1.5em;}h3{font-size:1.25em;}" +
    "p,ul,ol{margin:0 0 1em;}li{margin:0.25em 0;}" +
    "img{max-width:100%;height:auto;}" +
    "table{border-collapse:collapse;width:100%;margin:1em 0;}" +
    "td,th{border:1px solid #e7dfd2;padding:6px 10px;vertical-align:top;text-align:left;}" +
    "a{color:#c2563a;}" +
    "blockquote{margin:1em 0;padding-left:16px;border-left:3px solid #e7dfd2;color:#6b6258;}" +
    "pre{white-space:pre-wrap;}" +
    "hr{border:0;border-top:1px solid #e7dfd2;margin:2em 0;}" +
    "</style></head><body><article>" +
    bodyHtml +
    "</article></body></html>"
  );
}

// ---------------------------------------------------------------------------
// Conversion. Runs once, inside the confirm/replace request. Returns true
// when the derived HTML is stored and the row can flip to kind "docx"; false
// on any failure, after which the caller leaves the upload as a plain file.
// Mammoth's warnings are logged server-side only; the user never sees them.
export async function convertAndStoreDocxHtml(opts: {
  fileId: string;
  buffer: Buffer;
}): Promise<boolean> {
  let html: string;
  try {
    // Embedded images become data URIs in the stored HTML, one object per
    // file, no per-image R2 writes. Once the accumulated URIs would pass the
    // budget, remaining images render as a neutral placeholder instead.
    let imageBytes = 0;
    const result = await mammoth.convertToHtml(
      { buffer: opts.buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          if (!image.contentType?.startsWith("image/")) {
            return { src: IMAGE_PLACEHOLDER_SRC };
          }
          const base64 = await image.readAsBase64String();
          const src = `data:${image.contentType};base64,${base64}`;
          if (imageBytes + src.length > IMAGE_BUDGET_BYTES) {
            return { src: IMAGE_PLACEHOLDER_SRC };
          }
          imageBytes += src.length;
          return { src };
        }),
      },
    );
    if (result.messages.length > 0) {
      console.warn(
        `docx convert (${opts.fileId}): ${result.messages
          .map((m) => `${m.type}: ${m.message}`)
          .join("; ")}`,
      );
    }
    html = wrapDocxHtml(sanitizeDocxHtml(result.value));
  } catch (err) {
    // Corrupt file, encrypted docx, ZIP without word/document.xml: all land
    // here and the upload proceeds as a plain download.
    console.warn(`docx convert failed (${opts.fileId})`, err);
    return false;
  }

  if (Buffer.byteLength(html, "utf-8") > HTML_MAX_BYTES) {
    console.warn(
      `docx convert (${opts.fileId}): derived HTML over ${HTML_MAX_BYTES} bytes, keeping download-only`,
    );
    return false;
  }

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: docxHtmlKey(opts.fileId),
        Body: html,
        ContentType: "text/html; charset=utf-8",
      }),
    );
  } catch (err) {
    console.warn(`docx store failed (${opts.fileId})`, err);
    return false;
  }
  return true;
}

// Remove the derived object(s) for a file. Same prefix-batch helper the
// sites/ cleanup uses; throws on failure so callers pick their severity.
export async function deleteDerivedObjects(fileId: string): Promise<void> {
  await deleteObjectsUnderPrefix(derivedObjectPrefix(fileId));
}
