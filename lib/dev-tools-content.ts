import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const devToolsSilo: SiloConfig = {
  key: "dev-tools",
  basePath: "/dev-tools",
  hubLabel: "Dev tools",
  schemaType: "WebApplication",
  heroVariant: "cta",
  ctaVerb: "try the dev tools",
};

export const devToolsContentMap: Record<string, SpokeContent> = {
  "json-formatter": {
    slug: "json-formatter",
    name: "JSON formatter",
    title: "JSON Formatter: format and validate JSON online, free",
    description:
      "Paste messy JSON and get it back cleanly indented and validated. Free online JSON formatter with no signup, runs in your browser.",
    h1: "Format and validate JSON.",
    lead: "Paste minified or messy JSON and get clean, indented, validated output back instantly.",
    keyPoints: [
      "Paste minified or messy JSON and get clean, indented output back instantly.",
      "Catches syntax errors and points to the exact line where the JSON breaks.",
      "Switch between pretty-printed and minified output with a click.",
      "Runs entirely in your browser. Your JSON never leaves your machine.",
    ],
    body: [
      "Minified JSON is fine for machines and miserable for humans. A formatter re-indents it into something readable and, just as usefully, tells you immediately if the JSON is broken and where. Paste your JSON here and it's tidied and checked in one step.",
      "Once your JSON is clean, you can {{viewer-json}} as a natural companion step. It renders the structure as a collapsible tree so you can step through a large object without scrolling endlessly. If you need to hand the file to a teammate, you can {{host-json}} instead of pasting hundreds of lines into chat.",
      "Formatting JSON is rarely the only thing you're doing. You'll often need to {{dev-base64}}, {{dev-url-encoder}}, or {{dev-jwt-decoder}} in the same session, and {{dev-tools-hub}} sit next to this formatter in the dashboard.",
      "Every dev tool here is free and runs in your browser. NudgeHost's paid plans on {{pricing}} are about hosting and sharing, not the tools themselves.",
    ],
    faqs: [
      {
        q: "Does my JSON get sent to a server?",
        a: "No. Formatting runs entirely in your browser. The JSON you paste never leaves your machine.",
      },
      {
        q: "Will it tell me what's wrong with invalid JSON?",
        a: "Yes. The formatter reports the parse error and points to the line where the syntax breaks.",
      },
      {
        q: "Can it minify as well as format?",
        a: "Yes. You can switch between pretty-printed output and a minified single line.",
      },
    ],
    relatedToolSlugs: ["viewer-json", "dev-base64", "dev-jwt-decoder", "dev-url-encoder"],
  },

  base64: {
    slug: "base64",
    name: "Base64 encoder",
    title: "Base64 Encoder & Decoder: free, runs in your browser",
    description:
      "Encode text to Base64 or decode Base64 back to text instantly. Free online Base64 tool with no signup, nothing leaves your browser.",
    h1: "Encode and decode Base64.",
    lead: "Paste text or Base64 and convert between the two instantly, entirely in your browser.",
    keyPoints: [
      "Paste text or Base64 to convert between the two instantly.",
      "Works for short tokens, data URIs, and small file encoding.",
      "Browser-only. Nothing is uploaded, nothing logged.",
      "Free with no signup.",
    ],
    body: [
      "Base64 turns up everywhere in development, from data URIs and API tokens to email attachments and config values. Encoding and decoding it by hand is error-prone, so a quick tool that does it instantly saves a surprising amount of friction. Paste your input here and convert in either direction.",
      "Base64 is often a step inside a bigger task. If you're decoding a token, {{dev-jwt-decoder}} is purpose-built for JSON web tokens specifically. If you're working with encoded JSON, {{dev-json-formatter}} will tidy the result so it's readable.",
      "When you need to share the output rather than just read it (say, a decoded file or a config dump), drop it into {{host-hub}} and send a link. The rest of the small utilities live alongside this one in {{dev-tools-hub}}.",
      "Free, browser-only, nothing logged. The hosting side lives separately under {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does the data leave my browser?",
        a: "No. Encoding and decoding happen locally. Nothing is uploaded or logged.",
      },
      {
        q: "Can it handle files, not just text?",
        a: "Yes. You can encode small files to Base64, useful for data URIs and inline assets.",
      },
      {
        q: "Why is my decoded output garbled?",
        a: "The input probably wasn't valid Base64, or it encoded binary data rather than text. Check the source.",
      },
    ],
    relatedToolSlugs: ["dev-jwt-decoder", "dev-json-formatter", "dev-url-encoder", "viewer-json"],
  },

  "url-encoder": {
    slug: "url-encoder",
    name: "URL encoder",
    title: "URL Encoder & Decoder: free online tool",
    description:
      "Encode or decode URL components instantly. Free online URL encoder that handles query strings and special characters, runs in your browser.",
    h1: "Encode and decode URLs.",
    lead: "Paste a URL or component and safely encode or decode special characters in a click.",
    keyPoints: [
      "Paste a URL or component to safely encode or decode special characters.",
      "Handles both component-level and whole-URL encoding correctly.",
      "Unicode characters convert to valid percent-encoded UTF-8.",
      "Runs entirely in your browser. Nothing is sent to a server.",
    ],
    body: [
      "Spaces, ampersands, and non-ASCII characters all need encoding before they're safe in a URL, and getting that wrong quietly breaks links and query strings. This tool encodes and decodes URL components correctly so you don't have to remember the rules. Paste your input to convert it.",
      "URL encoding tends to come up alongside other small jobs: {{dev-base64}} for encoded values, {{dev-json-formatter}} when a query string carries JSON. NudgeHost's {{dev-tools-hub}} keep all of them within reach.",
      "If you're building or sharing the page the URL points at, you can {{host-html}} from your dashboard and get a clean link back. The same uploader lets you {{host-hub}} the same way. NudgeHost's job is the link; this tool just makes sure the link is well-formed.",
      "Free and browser-based. Hosting plans are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "What's the difference between encoding a component and a full URL?",
        a: "Encoding a component escapes everything special, including slashes. Encoding a full URL leaves the structural characters intact. The tool offers both.",
      },
      {
        q: "Does this handle non-English characters?",
        a: "Yes. Unicode characters are encoded to valid percent-encoded UTF-8.",
      },
      {
        q: "Is anything sent to a server?",
        a: "No. The conversion runs entirely in your browser.",
      },
    ],
    relatedToolSlugs: ["dev-base64", "dev-json-formatter", "dev-jwt-decoder", "host-html"],
  },

  "jwt-decoder": {
    slug: "jwt-decoder",
    name: "JWT decoder",
    title: "JWT Decoder: inspect JSON web tokens online, free",
    description:
      "Paste a JWT and decode its header and payload instantly. Free online JWT decoder that runs in your browser with nothing logged.",
    h1: "Decode a JSON web token.",
    lead: "Paste a JWT and see its header and payload decoded and readable, instantly and privately.",
    keyPoints: [
      "Paste a JWT and see its header and payload decoded and readable.",
      "Inspect claims, expiry, and the signing algorithm at a glance.",
      "Runs locally in your browser. Tokens are never sent or logged.",
      "Decodes only; signature verification still belongs server-side.",
    ],
    body: [
      "Debugging authentication usually means staring at a JWT. Three Base64 segments separated by dots, unreadable until decoded. This tool splits the token and decodes the header and payload so you can see the claims, the expiry, and the signing algorithm at a glance. Paste a token to inspect it.",
      "A JWT is Base64 under the hood, so when you're decoding something that isn't a token you can {{dev-base64}} more generally. The payload is JSON, and once decoded you can run it through {{dev-json-formatter}} to pretty-print a dense response.",
      "When you need to share a decoded payload with a teammate while debugging, you can {{host-hub}} and send the link rather than pasting JSON into chat. The rest of NudgeHost's {{dev-tools-hub}} sit alongside this decoder.",
      "The decoder runs locally and logs nothing, which matters because tokens are sensitive. Hosting plans, unrelated to the tools, are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Is it safe to paste a token here?",
        a: "Decoding runs entirely in your browser and nothing is logged or transmitted. Still, treat production tokens with care and avoid pasting live credentials anywhere unnecessary.",
      },
      {
        q: "Does this verify the signature?",
        a: "No. It decodes the header and payload so you can read them. Signature verification requires the secret or public key and should happen server-side.",
      },
      {
        q: "Why does my token show as expired?",
        a: "The decoded payload includes the 'exp' claim. If that timestamp is in the past, the token is expired.",
      },
    ],
    relatedToolSlugs: ["dev-base64", "dev-json-formatter", "dev-url-encoder", "viewer-json"],
  },
};
