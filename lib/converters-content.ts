import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const convertersSilo: SiloConfig = {
  key: "converters",
  basePath: "/converters",
  hubLabel: "Converters",
  schemaType: "WebApplication",
  heroVariant: "upload",
  // A converter page takes a file; a Paste HTML tab makes no sense here, so
  // the widget shows the file mode only.
  uploadTabs: "file",
  ctaVerb: "convert your file",
};

// HONESTY NOTE: NudgeHost hosts files; it does not convert them. Every page
// in this silo is a how-to for making the conversion with tools the visitor
// already has, followed by hosting the result here. Do not write copy that
// claims NudgeHost performs the conversion.

export const convertersContentMap: Record<string, SpokeContent> = {
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    title: "PDF to JPG: convert the pages, then share them as a link",
    description:
      "How to turn PDF pages into JPG images with software you already have, then host the JPGs on NudgeHost and share them as a link. Free up to 25MB per file.",
    h1: "Convert a PDF to JPG and share it as a link.",
    lead: "Export your PDF pages as images with the reader you already have, then drop the JPGs here. The uploader hosts your converted file and hands back a link.",
    keyPoints: [
      "Most PDF readers export a page as an image from the file menu, and the preview apps built into Mac and Windows do it too.",
      "NudgeHost hosts the exported JPGs. Each upload becomes a link that opens in any browser.",
      "Uploads are free up to 25MB per file. Your first three links need no account and stay live for 7 days.",
      "A free account keeps 10 links live with no expiry.",
    ],
    body: [
      "A PDF is a great document and an awkward image. Slides, social posts, and chat apps often want a picture instead. The conversion is closer than most people think. Desktop PDF readers export a page as a JPG or PNG from the file menu, the preview apps built into Mac and Windows save pages as images, and for a single page a screenshot does the job in seconds.",
      "This page handles the second half of the job, which is getting the converted images in front of someone. Drop your exported JPGs above and you get a hosted link in seconds. If you would rather keep the original document in play, you can also {{host-pdf}} and send both. The PDF goes to people who want the real document, the JPGs go everywhere a PDF won't.",
      "If you only need to read the document rather than turn it into images, you can {{viewer-pdf}} with nothing to install. For images headed to the web, the next step when file size matters is to {{converter-png-to-webp}}. And since NudgeHost will {{host-hub}}, the JPGs, the source PDF, and anything else can sit in the same dashboard.",
      "Hosting is free for files up to 25MB. Passwords and custom domains are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does NudgeHost convert the PDF for me?",
        a: "No. NudgeHost hosts files. Export the pages as images with your PDF reader first, then upload the JPGs here to get a shareable link.",
      },
      {
        q: "What happens when I upload a JPG here?",
        a: "It gets a link on nudgehost.com. The image opens full screen in any browser, and nobody needs an account to view it.",
      },
      {
        q: "Is there a file size limit?",
        a: "Uploads are free up to 25MB per file. Without an account you can keep 3 links live at once and they last 7 days. A free account raises that to 10 links with no expiry.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-pdf", "converter-png-to-webp", "converter-docx-to-pdf"],
    filePillExamples: ["PDF", "JPG", "Up to 25MB free", "Share as a link"],
  },

  "docx-to-pdf": {
    slug: "docx-to-pdf",
    name: "DOCX to PDF",
    title: "DOCX to PDF: export from Word or Docs, then share the PDF as a link",
    description:
      "Word and Google Docs export straight to PDF. Save the PDF there, then host it on NudgeHost and send a link instead of an attachment. Free up to 25MB.",
    h1: "Convert a Word document to PDF and share it as a link.",
    lead: "Your word processor already exports to PDF. Save the PDF there, then drop it here to host your converted file and send a link instead of an attachment.",
    keyPoints: [
      "Word, Google Docs, and most word processors export to PDF from the file menu. No extra software needed.",
      "Upload the exported PDF here and it becomes a link that looks the same on every device.",
      "Free up to 25MB per file. Three links without an account (live for 7 days), or 10 with a free account and no expiry.",
      "Recipients read the PDF in their browser. No download, no account.",
    ],
    body: [
      "Word documents shift around depending on the reader's software, fonts, and version. PDF looks identical everywhere, which is why converting is the right move before you send anything that matters. The conversion is built into the tools you already use. Word has Save As PDF and Export, Google Docs has Download as PDF, and the print-to-PDF option on Mac and Windows works from any program.",
      "Once you have the PDF, you can {{host-pdf}} right here and send a link instead of an attachment. A link is lighter than a 4MB file in someone's inbox, and the recipient opens it in one click. If the document is a CV, it helps to {{use-case-resume-link}} so it arrives as a clean URL rather than an attachment a filter might catch.",
      "If you want to check the original Word file before exporting, you can {{viewer-docx}} in seconds. And when a page from the finished PDF needs to be an image, the guidance on how to {{converter-pdf-to-jpg}} picks up where this page ends.",
      "Hosting is free for files up to 25MB. Password protection and custom domains arrive when you {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does NudgeHost convert the DOCX for me?",
        a: "No. Export the PDF from Word, Google Docs, or your word processor's print menu first. NudgeHost hosts the PDF and gives you the link.",
      },
      {
        q: "Why send a link instead of attaching the PDF?",
        a: "A link is smaller than an attachment, never gets clipped by a mail server, and opens in the recipient's browser with nothing to install.",
      },
      {
        q: "Is there a file size limit?",
        a: "25MB per file, free. Anonymous uploads allow 3 active links for 7 days. A free account allows 10 links with no expiry.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "viewer-docx", "use-case-resume-link", "converter-pdf-to-jpg"],
    filePillExamples: ["DOCX", "PDF", "Up to 25MB free", "Share as a link"],
  },

  "png-to-webp": {
    slug: "png-to-webp",
    name: "PNG to WebP",
    title: "PNG to WebP: convert with your image tools, then host the result",
    description:
      "How to convert PNG to WebP with an image editor or a command-line encoder, then host the lighter file on NudgeHost and share it as a link. Free up to 25MB.",
    h1: "Convert PNG to WebP and host the result.",
    lead: "Most image editors and command-line encoders write WebP. Convert there, then drop the file here to host it and share a link.",
    keyPoints: [
      "WebP usually lands at half the size of the same PNG, and every current browser opens it.",
      "Most modern image editors export WebP from the save dialog. The format's reference encoder is a free command-line tool.",
      "Upload the converted file here for a shareable link. Free up to 25MB per file.",
      "No account needed for your first 3 links. A free account keeps 10 live with no expiry.",
    ],
    body: [
      "WebP is the image format every current browser supports, and it compresses far better than PNG. The same image often lands at half the size or less, which means faster pages and lighter shares. Converting is a short job with tools you may already have. Most modern image editors export WebP from the save dialog, and the format's reference encoder is a free command-line tool that processes a whole folder in one line.",
      "After converting, drop the WebP above to host it. If the image belongs to a site you're publishing, you can {{host-html}} and the lighter assets load noticeably faster. iPhone photographs have their own format problem, and {{converter-heic-to-jpg}} covers that one.",
      "Anything else in the project can ride along. NudgeHost will {{host-hub}}, so mockups, PDFs, and ZIPs sit in the same dashboard as the images. Developers tidying assets may also get use out of {{dev-tools-hub}} alongside this page.",
      "Hosting is free up to 25MB per file. Larger limits and custom domains are on {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does NudgeHost convert the PNG for me?",
        a: "No. Convert with your image editor or a command-line encoder first. NudgeHost hosts the WebP and gives you a link to share.",
      },
      {
        q: "Will browsers open a WebP link?",
        a: "Yes. Every current browser renders WebP, and a hosted image link opens full screen with no download.",
      },
      {
        q: "Is there a file size limit?",
        a: "25MB per file, free. Without an account you can hold 3 active links for 7 days. A free account gives 10 links with no expiry.",
      },
    ],
    relatedToolSlugs: ["converter-heic-to-jpg", "host-html", "host-pdf", "dev-json-formatter"],
    filePillExamples: ["PNG", "WebP", "Up to 25MB free", "Share as a link"],
  },

  "heic-to-jpg": {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    title: "HEIC to JPG: convert iPhone photos, then share them as a link",
    description:
      "iPhones can export JPG directly. Convert your HEIC photos on the device, then host the JPGs on NudgeHost and share one link. Free up to 25MB per file.",
    h1: "Convert HEIC to JPG and share the photo as a link.",
    lead: "Your iPhone can hand you a JPG by itself. Convert on the device, then drop the photo here to host it and send a link.",
    keyPoints: [
      "iPhones export JPG when you copy a photo into the Files app, and the Most Compatible camera setting captures JPG from the start.",
      "The photo apps built into Mac and Windows export JPG from a HEIC original too.",
      "Upload the JPG here for a link that opens on any device. Free up to 25MB per file.",
      "Your first 3 links need no account and stay live for 7 days. A free account holds 10 with no expiry.",
    ],
    body: [
      "iPhones save photos as HEIC, which is efficient but stubborn. Plenty of websites, older software, and non-Apple devices won't open it. The fix usually lives on the phone itself. Setting the camera to Most Compatible captures JPG from then on, copying a photo into the Files app converts it on the way, and the photo apps built into Mac and Windows export JPG from a HEIC original.",
      "With a JPG in hand, drop it above to host it and share a link, which beats sending a heavy attachment the recipient's phone refuses to preview. For a set of photos, host each one and send the handful of links; the dashboard keeps the set tidy.",
      "Since NudgeHost will {{host-hub}}, the originals can live next to the converted copies if you want both online. If the JPG needs to be lighter still for a website, the next step is to {{converter-png-to-webp}}. The same in-browser rendering behind {{viewer-pdf}} shows hosted images full screen as well.",
      "Hosting is free up to 25MB per photo. Passwords and custom domains arrive when you {{pricing}}.",
    ],
    faqs: [
      {
        q: "Does NudgeHost convert the HEIC for me?",
        a: "No. Convert on your iPhone or with your computer's photo app first, then upload the JPG here for a shareable link.",
      },
      {
        q: "Why won't my HEIC photo open elsewhere?",
        a: "HEIC is an Apple-favoured format. Many non-Apple devices and older apps don't support it, so JPG is the universal alternative.",
      },
      {
        q: "Is there a file size limit?",
        a: "25MB per file, free. You can publish 3 links without an account (live for 7 days) or 10 with a free account and no expiry.",
      },
    ],
    relatedToolSlugs: ["converter-png-to-webp", "host-zip", "host-pdf", "viewer-pdf"],
    filePillExamples: ["HEIC", "JPG", "Up to 25MB free", "Share as a link"],
  },
};
