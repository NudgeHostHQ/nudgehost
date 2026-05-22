import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const convertersSilo: SiloConfig = {
  key: "converters",
  basePath: "/converters",
  hubLabel: "Converters",
  schemaType: "WebApplication",
  heroVariant: "upload",
  ctaVerb: "convert your file",
};

export const convertersContentMap: Record<string, SpokeContent> = {
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    filetypeShort: "PDF",
    title: "PDF to JPG Converter: turn PDF pages into images, free",
    description:
      "Convert a PDF into JPG images, one per page. Free, no signup, no watermark. Works in your browser on any device.",
    h1: "Convert a PDF to JPG.",
    lead: "Drop a PDF and get back a JPG for every page. Each one is ready to drop into a slide, a post, or a message.",
    keyPoints: [
      "Drop a PDF and get one JPG per page, ready to drop into slides, posts, or messages.",
      "High-resolution output with no watermark, even on the free plan.",
      "Each page is numbered in order so a multi-page PDF stays sequenced.",
      "Runs in your browser with no signup.",
    ],
    body: [
      "A PDF is a great document and an awkward image. When you need a page as a picture, converting to JPG is the fix. That covers slide decks, places that don't accept PDFs, and most social platforms. Drop your PDF here and each page comes back as a separate image.",
      "Once you have the images, you often want them online. You can {{host-hub}} the converted files and share a link, or if you'd rather keep the original document intact, {{host-pdf}} and send that instead. Many people do both: the PDF for people who want the real document, the JPGs for everywhere a PDF won't go.",
      "If you only wanted to read the PDF rather than convert it, the {{viewer-pdf}} opens it in your browser with nothing to install. And if your images need to be smaller for the web, {{converter-png-to-webp}} will shrink them further.",
      "This converter is free with no watermark. Higher limits and sharing features are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does each PDF page become a separate JPG?",
        a: "Yes. A 10-page PDF returns 10 JPG images, numbered in order.",
      },
      {
        q: "Is there a watermark on the output?",
        a: "No. The converted images are clean, even on the free plan.",
      },
      {
        q: "What resolution are the images?",
        a: "Images are exported at a high resolution suitable for slides and print. You can choose a smaller size if you need lighter files.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-pdf", "converter-png-to-webp", "converter-docx-to-pdf"],
  },

  "docx-to-pdf": {
    slug: "docx-to-pdf",
    name: "DOCX to PDF",
    filetypeShort: "DOCX",
    title: "DOCX to PDF Converter: Word to PDF online, free",
    description:
      "Convert a Word document to PDF in seconds. Fonts, tables, and layout survive intact; PDF locks the formatting so it can't shift on the recipient's device.",
    h1: "Convert a Word document to PDF.",
    lead: "Drop a DOCX file and get a clean PDF back. PDF is the format that looks the same on every device.",
    keyPoints: [
      "Drop a Word document and get a faithful PDF back with fonts, tables, and layout preserved.",
      "PDF travels better than DOCX because it doesn't depend on the recipient's software.",
      "Free with no watermark and no signup.",
      "Batch-convert several DOCX files at once if you have a stack to process.",
    ],
    body: [
      "Word documents shift around depending on the reader's software, fonts, and version. PDF doesn't; it looks identical everywhere. That's why converting to PDF is the right move before you send anything that matters: a resume, a contract, a proposal. Drop your DOCX here and a faithful PDF comes back.",
      "With the PDF in hand, the natural next step is to {{host-pdf}} and share a link instead of an attachment. The link is cleaner than a 4MB email attachment, it's trackable, and the recipient opens it in one click. If the document is specifically a CV, there's a tailored flow to {{use-case-resume-link}} that adds open-tracking so you know when it's been read.",
      "If you want to check the original Word file first, the {{viewer-docx}} opens it in your browser. And once converted, you can always {{converter-pdf-to-jpg}} if you need image versions of the pages too.",
      "Free, no watermark. Custom domains and passwords are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Will my formatting survive the conversion?",
        a: "Yes. Fonts, images, tables, and layout are preserved. PDF then locks that formatting so it can't shift.",
      },
      {
        q: "Can I convert several documents at once?",
        a: "Yes. Upload multiple DOCX files and each comes back as its own PDF.",
      },
      {
        q: "Is there a file size limit?",
        a: "The free plan handles documents up to 25MB, which covers all but the most image-heavy files.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-docx", "use-case-resume-link", "converter-pdf-to-jpg"],
  },

  "png-to-webp": {
    slug: "png-to-webp",
    name: "PNG to WebP",
    filetypeShort: "PNG",
    title: "PNG to WebP Converter: shrink images online, free",
    description:
      "Convert PNG to WebP and cut file size by half or more with no visible quality loss. Transparency is preserved; lossless mode keeps exact pixels. Free.",
    h1: "Convert PNG to WebP.",
    lead: "Drop a PNG and get a WebP back. The WebP is usually a fraction of the size, with no visible difference.",
    keyPoints: [
      "Drop a PNG and get a WebP back at usually half the size or less, with no visible quality loss.",
      "Lossless WebP available if you need pixel-for-pixel preservation at smaller size.",
      "Transparency is preserved through the conversion.",
      "Free, runs in your browser, no watermark.",
    ],
    body: [
      "WebP is the modern image format every browser now supports, and it compresses far better than PNG. Swapping a PNG for a WebP often cuts the file size by half or more with no visible quality loss, which means faster pages and lighter shares. Drop your PNG here to convert it.",
      "Smaller images matter most when they're going on the web. If you're publishing a page like a portfolio, a landing page, or an AI-built site, you can {{host-html}} and the lighter WebP assets will load noticeably faster. For photographs straight off an iPhone, {{converter-heic-to-jpg}} is the companion conversion.",
      "If the images are part of a larger document you can also {{host-hub}} the whole thing as a link. Developers optimizing assets will find the rest of NudgeHost's {{dev-tools-hub}} useful alongside this converter.",
      "Free with no watermark. Account features live on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Will I lose image quality?",
        a: "WebP's compression is very efficient. At normal settings the difference is invisible. You can also choose lossless WebP to keep the PNG's exact pixels at a smaller size.",
      },
      {
        q: "Does WebP work everywhere?",
        a: "Yes. Every current browser supports WebP. For very old software, keep a JPG or PNG fallback.",
      },
      {
        q: "Can I convert transparent PNGs?",
        a: "Yes. WebP supports transparency, so transparent PNGs convert cleanly.",
      },
    ],
    relatedToolSlugs: ["converter-heic-to-jpg", "host-html", "host-pdf", "dev-json-formatter"],
  },

  "heic-to-jpg": {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    filetypeShort: "HEIC",
    title: "HEIC to JPG Converter: iPhone photos to JPG, free",
    description:
      "Convert HEIC photos from your iPhone into universal JPG. HEIC won't open on non-Apple devices or older software; JPG works everywhere. Free, no watermark.",
    h1: "Convert HEIC to JPG.",
    lead: "Drop a HEIC photo from your iPhone and get a JPG back that opens anywhere.",
    keyPoints: [
      "Drop a HEIC photo from an iPhone and get a universal JPG back.",
      "Fixes the common problem of HEIC failing to open on non-Apple devices and older software.",
      "High-quality output with negligible visible difference from the original.",
      "Batch-convert several HEIC files at once if you're emptying a roll of photos.",
    ],
    body: [
      "iPhones save photos as HEIC, which is efficient but stubborn. Plenty of websites, older software, and non-Apple devices simply won't open it. Converting to JPG makes the photo universal. Drop your HEIC file here and a JPG comes back, ready to use anywhere.",
      "Once it's a JPG, you can {{host-hub}} the photo and share a link, which beats sending a heavy attachment that the recipient's phone then refuses to preview. If you're sharing several photos, zipping them together and choosing to {{host-zip}} keeps everything in one tidy link.",
      "If the JPG still needs to be lighter for a website, {{converter-png-to-webp}} will compress it further. And if you simply want to look at the photo without converting, the {{viewer-pdf}} and NudgeHost's other browser viewers handle common formats directly.",
      "Free, no watermark. Sharing extras are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Why won't my HEIC photo open elsewhere?",
        a: "HEIC is an Apple-favoured format. Many non-Apple devices and older apps don't support it, so JPG is the universal alternative.",
      },
      {
        q: "Will the photo lose quality?",
        a: "JPG conversion is near-lossless at high quality settings. The visible difference is negligible.",
      },
      {
        q: "Can I convert several photos at once?",
        a: "Yes. Upload multiple HEIC files and each comes back as a JPG.",
      },
    ],
    relatedToolSlugs: ["converter-png-to-webp", "host-zip", "host-pdf", "viewer-pdf"],
  },
};


