// Blog content. Posts are the densest contextual-linking surface on the site:
// each one links into several tool, use-case, glossary, and money pages so blog
// authority flows down to the pages that convert. Body is a single string with
// {{key}} tokens (see lib/internal-links.ts); the renderer splits it into
// paragraphs and resolves the tokens through ContextualProse.

export type BlogFaq = { question: string; answer: string };

export type BlogPost = {
  slug: string;
  title: string; // <title>
  metaDescription: string;
  h1: string;
  author: string;
  publishedDate: string; // ISO
  modifiedDate: string; // ISO
  pillar: "sharing-files" | "ai-publishing" | "hosting-vs-cloud";
  tldr: string; // 3-4 sentence key-points block
  body: string; // long-form prose with {{key}} tokens, paragraphs split on blank lines
  faqs: BlogFaq[];
  relatedToolSlugs: string[]; // TOOL_REGISTRY keys for the Related tools grid
};

export const blogContentMap: Record<string, BlogPost> = {
  "how-to-host-a-claude-artifact": {
    slug: "how-to-host-a-claude-artifact",
    title: "How to host a Claude artifact as a public link",
    metaDescription:
      "A step-by-step guide to publishing a Claude artifact. Copy the HTML, paste it into NudgeHost, and get a public link anyone can open with no Anthropic account.",
    h1: "How to host a Claude artifact",
    author: "Mark Boreland",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "ai-publishing",
    tldr: "Claude can build a working HTML artifact inside a conversation, but the artifact stays there until you publish it. Copy the artifact's source, paste it into NudgeHost, and you get a public link in seconds. The recipient opens it in any browser with no Anthropic account. Update the source later and the link stays the same.",
    body: `Claude's artifacts feature turns a prompt into something working in front of you: a dashboard, a calculator, a landing page, a small game, rendered live in the conversation. The problem starts the moment you want someone else to see it. The artifact lives inside Claude, behind your account, and there is no public URL to send. Screenshotting loses the interactivity, and inviting someone into your Claude account is not an option.

The fix takes about thirty seconds. Open the artifact in Claude and switch to its code or source view, which shows the underlying HTML. Copy the whole block. Then you {{host-claude-artifact}} by pasting that HTML straight into NudgeHost, with no file to save first. A public link comes back, and anyone who clicks it sees the working artifact in their browser. They need no Anthropic account, and they never see your conversation.

An artifact is almost always self-contained HTML, which is why it hosts so cleanly. See {{glossary-static-site}} for the longer explanation of why files served as they are load fast and need no server. If Claude loaded a library like React or Tailwind from a CDN, those requests fire as normal from the hosted page, so the artifact behaves online exactly as it did in the conversation.

Most artifacts are a single HTML file, but occasionally Claude splits things across several files, or you have built something larger around it. In that case the same approach that lets you {{host-html}} handles the rest. Zip the files together and upload the archive, and NudgeHost unpacks it and serves the index as the entry point. Either way the result is a single clean URL.

The link you get is short and on nudgehost.com, the kind of URL you can paste into a Slack message or a tweet without it looking suspicious. The page renders full screen, and when you share it the preview unfurls with a sensible title and image, so the link reads as intentional rather than broken.

Artifacts evolve. You ask Claude for a second version, it rebuilds the thing, and you want the same link to show the new one. Swap the source in your NudgeHost dashboard and the URL does not change, so everyone who already has the link sees the update on their next visit. This is the part screenshots and one-off uploads get wrong, where every change means a new file and a new link to redistribute.

The most common next step is showing the artifact to someone whose opinion matters. If Claude built you a pitch tool or an interactive prototype, you can {{use-case-deck}} and send the live link as the working demo rather than a slide about it. A client clicking a real, working thing lands differently than a screenshot in a deck.

Hosting an artifact is free, and the 25MB limit on {{pricing}} sits far above the size of anything Claude produces, which is almost always under a few hundred kilobytes. The paid tiers add custom domains and password protection, both of which matter once the link is going to a client rather than a friend. If you just want to try it, you can {{home}} with the artifact HTML right now.`,
    faqs: [
      {
        question: "How do I get the HTML out of a Claude artifact?",
        answer:
          "In the artifact view, switch to the code or source toggle to see the underlying HTML, then copy the whole block. You can also ask Claude directly for the artifact's full HTML source.",
      },
      {
        question: "Does the person I share it with need a Claude account?",
        answer:
          "No. The hosted link is a normal public URL. Your conversation never leaves Claude; only the HTML you paste reaches NudgeHost.",
      },
      {
        question: "Will external libraries like React or Tailwind still work?",
        answer:
          "Yes. If the artifact loads them from a CDN, those requests fire from the hosted page exactly as they did in the conversation.",
      },
      {
        question: "Can I update the artifact without changing the link?",
        answer:
          "Yes. Replace the source in your dashboard and the URL stays the same, so anyone who already has the link sees the new version.",
      },
    ],
    relatedToolSlugs: ["host-claude-artifact", "host-html", "host-chatgpt-html", "host-v0-export"],
  },

  "how-to-share-a-lovable-site": {
    slug: "how-to-share-a-lovable-site",
    title: "How to share a Lovable site with a public link",
    metaDescription:
      "Export your Lovable app and host it on NudgeHost for a public link. Covers the ZIP export, how routing works, and putting the app on your own custom domain.",
    h1: "How to share a Lovable site",
    author: "Mark Boreland",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "ai-publishing",
    tldr: "Lovable builds a full app from a chat, then offers its own deploy path. If you would rather host it yourself, export the project, drop the build into NudgeHost, and get a public link. A custom domain puts it on your own address. Re-export and the link updates in place.",
    body: `Lovable.dev is one of the cleanest of the AI app builders. You describe what you want in plain language, it generates a working React app, and you refine it in the chat. Lovable has its own deploy button, which is fine if you want to stay inside Lovable. The moment you want the app on your own domain, or want to hand someone a link without onboarding them onto another tool, hosting the export yourself is the simpler path.

Start by exporting the project from Lovable. The export is a ZIP of the built React app, and Lovable's export panel has an option to include the built output rather than only the source, which saves you a local build step. If you only have the source, run an install and a build locally first, then zip the output folder. Either way you end up with one archive that holds the whole app.

Drop that ZIP into NudgeHost and you {{host-lovable-export}} in one step. NudgeHost unpacks the archive, serves the index as the entry point, and rewrites unknown paths back to it so client-side routing works on a direct visit. This is the same pipeline that runs when you {{host-html}} a multi-file site, so a Lovable export and a hand-built site host the same way. The result is a public link that loads the app exactly as it ran in Lovable.

A Lovable build is static once it leaves the chat, a folder of HTML, JavaScript, and assets with no server behind it. The one thing to know is routing. An app using React Router handles its own URLs in the browser, so a direct visit to a sub-path would normally fail on a plain host. NudgeHost's fallback sends unmatched paths to the index so the router takes over, which means deep links into the app keep working.

The default link sits on nudgehost.com, which is fine for sharing with a friend. For anything client-facing, putting the app on your own address reads as more established. Our explainer on {{glossary-custom-domain}} covers the setup, which is a single DNS record with the securing certificate issued for you. Custom domains live on {{pricing}}, alongside password protection and the removal of NudgeHost branding.

Builders who are job-hunting often ship a Lovable app as proof of what they can do, and a working link beats a description every time. You can {{use-case-recruiter}} with the live URL in an application, so a hiring manager clicks once and uses the thing you built. The same link works in a portfolio or a cold email.

Re-export from Lovable whenever you change the app, upload the new ZIP to the same link, and the URL stays put. Anyone who already has it sees the new version. The approach is identical for the other AI builders, so once you have done this you can {{host-v0-export}} or a Bolt project the same way. The mental model is simple. Export the build, drop the archive, share the link.

Hosting a Lovable export is free to start, and most exports compress to a few megabytes, well under the free-plan limit. Upgrade when you want a custom domain or are sharing the link widely. There is no deploy config to learn and no server to keep alive.`,
    faqs: [
      {
        question: "Do I export source code or the built app?",
        answer:
          "Export the built app where Lovable offers it. If you only have source, run an install and build locally and zip the output folder before uploading.",
      },
      {
        question: "Will client-side routing work after I host it?",
        answer:
          "Yes. NudgeHost rewrites unknown paths to the index so React Router can handle them, which keeps deep links working on a direct visit.",
      },
      {
        question: "Can I use my own domain?",
        answer:
          "Yes, on a paid plan. Add a single DNS record pointing your domain at NudgeHost, and the certificate is issued automatically.",
      },
      {
        question: "Does my Lovable URL stop working if I host elsewhere?",
        answer:
          "No. The NudgeHost link is a separate destination. Both keep working, and you choose which one to share.",
      },
    ],
    relatedToolSlugs: ["host-lovable-export", "host-v0-export", "host-react-app", "host-html"],
  },

  "how-to-send-a-large-pdf-without-email": {
    slug: "how-to-send-a-large-pdf-without-email",
    title: "How to send a large PDF without email size limits",
    metaDescription:
      "Gmail caps attachments at 25MB and Outlook at 20MB. Host the PDF as a link instead and the recipient opens it in the browser at full quality, with nothing to download.",
    h1: "How to send a large PDF without email",
    author: "Mark Boreland",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "sharing-files",
    tldr: "Gmail rejects attachments over 25MB and Outlook over 20MB, so a detailed report or a scanned document bounces. The usual workarounds make the recipient sign into Dropbox or Google Drive. Hosting the PDF as a link sidesteps the limit, and the recipient opens it in the browser with nothing to download.",
    body: `Email was never built to move large files, and the limits make that obvious. Gmail bounces any attachment over 25MB. Outlook caps at 20MB. Many corporate mail servers are stricter still, stripping anything over 10MB before it reaches the inbox. A detailed proposal with embedded images, a scanned contract, or a print-ready PDF blows past these limits without trying. The send fails, or worse, it silently never arrives.

The standard escape routes each carry friction. Dropbox and Google Drive work, but they ask the recipient to sign in or fight a permissions dialog before they see the file. WeTransfer avoids the account but expires the link after a few days and wraps the download in ads. Compressing the PDF until it squeezes under the limit usually wrecks the image quality that mattered in the first place. None of these is the clean experience you want when the file is going to a client or a hiring manager.

Hosting the file as a link removes the size limit from the equation. You {{host-pdf}} by dropping it onto NudgeHost, and a clean URL comes back. You send the URL instead of the file, and the recipient clicks and reads the document in their browser at full quality, with nothing to download and no account to create. The email that carries a link is light, so it never bounces, no matter how large the underlying PDF is.

The numbers are generous. The free plan handles files up to 25MB, which covers most reports and scanned documents. When you genuinely need more, {{pricing}} raises the ceiling to 250MB on Pro, enough for a high-resolution print file or a long scanned dossier. There are no visitor caps, so a link opened by a whole hiring committee keeps working rather than cutting off.

That no-cap detail matters more than it sounds. Some hosts limit how much {{glossary-bandwidth}} a link can use and stop serving once a file gets popular, which is the opposite of what you want when a document is doing its job. NudgeHost keeps the link live because the file is served through a fast network rather than a single machine.

If your PDF is needlessly large, the cause is usually uncompressed images inside it, and a round of {{glossary-file-compression}} before uploading can halve the size with no visible loss. That is optional, though. The point of the link is that you do not have to shrink a file just to send it. When the recipient opens the link, they read it through an in-browser view, the same way they would {{viewer-pdf}} any document, so there is no reader app to install.

Sometimes a large PDF travels with companions, a cover letter, an appendix, a spreadsheet of figures. Rather than sending three links, zip them together and you {{host-zip}} as a single archive the recipient browses from one URL. It keeps a related set of documents under one link instead of scattered across an email thread.

Hosting also gives you control after sending, which an attachment never does. You can set the link to expire once a deal closes, or add a password for a sensitive document. The full walkthrough for the specific case of a big file lives in the guide to {{use-case-large-pdf}}, including how expiry and password gating work. The short version is that the link is the file's address, not the file itself, so you decide how long that address stays live.

Drop the file, copy the URL, and paste it into your email. The recipient gets the document at full quality in their browser, you get a record of when they opened it, and your message lands in the inbox instead of bouncing off a size limit.`,
    faqs: [
      {
        question: "What is the actual attachment limit for Gmail and Outlook?",
        answer:
          "Gmail rejects attachments over 25MB and Outlook over 20MB. Many corporate mail servers strip anything over 10MB before delivery.",
      },
      {
        question: "How large a PDF can I host on the free plan?",
        answer:
          "Up to 25MB free, and up to 250MB on Pro. The recipient never downloads it unless they choose to.",
      },
      {
        question: "Does the recipient need an account to open the link?",
        answer:
          "No. The PDF opens in their browser from the link. There is no sign-in and no download step unless they want a copy.",
      },
      {
        question: "Can I stop people opening the file later?",
        answer:
          "Yes. Set an expiry date or delete the link at any time, which revokes access immediately. You can also add a password.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "use-case-large-pdf", "viewer-pdf", "host-zip"],
  },

  "how-to-share-a-resume-as-a-link": {
    slug: "how-to-share-a-resume-as-a-link",
    title: "How to share your resume as a link recruiters will open",
    metaDescription:
      "Share your resume as a link instead of an attachment. It opens in the browser, tracks when a recruiter views it, and always shows the latest version. Here is the flow.",
    h1: "How to share your resume as a link",
    author: "Mark Boreland",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "sharing-files",
    tldr: "Recruiters open dozens of CVs a day, and an attachment adds friction with a download, a reader, and a file that may be out of date. A link opens in the browser, tracks when it was viewed, and always shows the latest version. Here is how to turn your resume into a link that does all three.",
    body: `A recruiter opening a job application is not so much reading your resume as triaging it, one of many that day. Every small friction counts against you. An attachment makes them download a file, trust it, and open it in whatever reader their machine defaults to. A link does none of that. They click, the resume opens in the browser, and they are reading it a second later. The format you control, on any device, with nothing to install.

Most resumes are PDFs, because PDF holds its layout on every screen, and that is the right choice here. You {{host-pdf}} by dropping the file onto NudgeHost, and a clean link comes back with open-tracking switched on. Put that link in your application email, your LinkedIn, and your email signature. One link, everywhere, instead of attaching the same file over and over.

The tracking is the part that changes how you job-hunt. The link reports when it was opened and roughly from where, so you learn whether a recruiter actually looked at your CV before an interview or whether the application is still sitting unread. The recruiter sees an ordinary link with no hint of tracking. The data is yours alone, in your dashboard. If you make a separate link per application, you can tell which company opened it, which tells you where a follow-up is worth sending.

An attachment freezes the moment you send it. Spot a typo after applying to forty roles and every one of those inboxes holds the wrong version. A hosted resume fixes this. Swap the file in your dashboard and the link stays the same, so the next time anyone opens it they see the corrected version. You update once instead of re-sending forty times.

There is a small detail that makes a resume link look professional when it travels. When you paste the link into LinkedIn or an email, the preview card that unfurls comes down to {{glossary-og-image}}, the little image and title a platform shows. A link with a clean preview reads as deliberate, where a bare URL reads as careless. NudgeHost generates a sensible preview for the file, so the link looks intentional wherever you share it.

A resume rarely travels alone for design, product, or engineering roles. The stronger move is to send the CV alongside your work, so you can {{host-portfolio}} and share both as trackable links. The dedicated walkthrough for the CV case lives in the guide to {{use-case-resume-link}}, and the companion flow to {{use-case-recruiter}} covers sending a portfolio to a hiring manager. Together they cover most of what a job application needs to carry.

Hosting one resume is free, and a CV sits far under the 25MB limit. {{pricing}} adds a custom domain and removes NudgeHost branding from the link, both worth it once you are applying widely and want the URL to look like your own. For a single application the free plan is all you need.

Drop your resume, copy the link, and put it everywhere you would have attached the file. You will know when it is read, you will never send a stale version, and the recruiter opens your CV in the time it takes an attachment to start downloading.`,
    faqs: [
      {
        question: "Will the recruiter know I am tracking the link?",
        answer:
          "No. It looks like an ordinary link. The open data is visible only to you, in your dashboard.",
      },
      {
        question: "What format should my resume be?",
        answer:
          "PDF. It holds its layout on every device. Convert a Word file to PDF first if needed.",
      },
      {
        question: "Can I tell which company opened my resume?",
        answer:
          "If you create a separate link per application, yes. Each link reports its own opens.",
      },
      {
        question: "Can I update my resume without changing the link?",
        answer:
          "Yes. Replace the file in your dashboard and the URL stays the same, so everyone who has the link sees the new version.",
      },
    ],
    relatedToolSlugs: ["host-pdf", "host-portfolio", "use-case-resume-link", "use-case-recruiter"],
  },

  "how-to-host-a-v0-export": {
    slug: "how-to-host-a-v0-export",
    title: "How to host a v0 export as a live site",
    metaDescription:
      "Export from v0, Vercel's AI UI builder, and host it on NudgeHost for a live link. Covers the paste-HTML route for a single component and the ZIP route for a full app.",
    h1: "How to host a v0 export",
    author: "Mark Boreland",
    publishedDate: "2026-05-25",
    modifiedDate: "2026-05-25",
    pillar: "ai-publishing",
    tldr: "v0 is Vercel's AI UI builder. It generates React and Tailwind code you preview in the chat, but sharing it usually means deploying to Vercel. If you would rather host it yourself, export the code or the build, drop it into NudgeHost, and get a live link. A single component or a full app both work.",
    body: `v0 is Vercel's design-and-code generator. You describe an interface, v0 produces React and Tailwind code, and you refine it in the chat. The default next step is to deploy on Vercel, which makes sense if you already live in Vercel-land. If you just want to show someone what v0 built, or put it on your own domain, hosting the export yourself is lighter than a full deploy.

What you export depends on what you built. For a single self-contained component, copy the HTML that v0 produces and you {{host-html}} by pasting it straight in, which gives you a URL in seconds. This is the same paste flow that works for any AI output, so a v0 component and a Claude artifact host identically. It is the fastest route for a static demo of one piece of UI.

For a multi-file app, export the project and you {{host-v0-export}} by uploading the ZIP. NudgeHost unpacks it and serves the index as the entry point, with unknown paths rewritten back to it so client-side routing works. Under the hood this is the same pipeline you hit when you {{host-react-app}} directly, because a v0 app is a React build once it leaves the chat. If the export is source rather than a build, run an install and a build locally first, then zip the output folder.

Whichever path you take, the output is static, a folder of files served as they are with the JavaScript running in the browser. See {{glossary-static-site}} for why that hosts without a server. v0 exports often pull Tailwind from a CDN and inline their shadcn components, and both work from the hosted page exactly as they did in the preview, so the design survives the move intact.

One practical detail trips people up. v0 sometimes splits output across several files, a page file and a folder of components, and pasting only the preview HTML loses the structure. If you want the full app rather than a static snapshot, take the project export and host the ZIP. If a static snapshot of the UI is all you need, the pasted HTML is enough and quicker. Pick based on whether the thing needs to actually run or just be seen.

A v0 build is often the centrepiece of a pitch, an internal demo, or a design review. You can {{use-case-deck}} and hand over the live link as the working demo rather than a screenshot in slides. A stakeholder clicking a real interface understands it faster than any description, and the link works on their phone as well as their laptop.

Re-export from v0 whenever the design changes, upload to the same link, and the URL stays the same so nobody needs a new one. Hosting is free to start, and most v0 exports are small enough to sit well under the free-plan limit. {{pricing}} adds custom domains and password protection for when the link goes to a client. The deploy step you were about to set up turns out to be a drag-and-drop.`,
    faqs: [
      {
        question: "Should I paste the code or upload a ZIP?",
        answer:
          "Paste the HTML for a single-file static demo. Upload a ZIP for a multi-file app where you want the whole thing to run.",
      },
      {
        question: "Will Tailwind and shadcn components work once hosted?",
        answer:
          "Yes. v0 typically loads Tailwind from a CDN and inlines shadcn components, and both work from the hosted page as they did in the preview.",
      },
      {
        question: "Do I need a Vercel account to host a v0 export?",
        answer:
          "No. Hosting on NudgeHost is independent of Vercel. You export from v0 and host the result without deploying anywhere else.",
      },
      {
        question: "Will client-side routes work?",
        answer:
          "Yes. NudgeHost rewrites unknown paths to the index so the router handles them, which keeps direct visits to sub-paths working.",
      },
    ],
    relatedToolSlugs: ["host-v0-export", "host-react-app", "host-html", "host-claude-artifact"],
  },
};
