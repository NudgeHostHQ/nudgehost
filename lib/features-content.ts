// Centralized SEO content for /features/[slug] pages.
//
// The /features silo documents what a shared NudgeHost link can actually do:
// updating the file behind a URL, ZIP-to-site hosting, paste-HTML publishing,
// password gates, custom domains, the full-screen viewer, link previews,
// public-by-default access, live HTML rendering, and the shareable link format.
// Several blog posts and other silos reference these capabilities, so each one
// gets a real page rather than an alias.
//
// Same SpokeContent shape as every other silo, rendered by components/spoke-page.tsx.
// CONTEXTUAL LINKS, KEY POINTS, and the non-commodity quality bar all follow the
// rules in CLAUDE.md and STRATEGY.md. Aim for 3-6 {{key}} tokens per page,
// including at least one cross-silo link and one money page ({{pricing}}/{{home}}).

import type { SpokeContent, SiloConfig } from "@/lib/spoke-types";

export const featuresSilo: SiloConfig = {
  key: "features",
  basePath: "/features",
  hubLabel: "Features",
  schemaType: "SoftwareApplication",
  heroVariant: "upload",
  ctaVerb: "share your file",
};

export const featuresContentMap: Record<string, SpokeContent> = {
  "link-updating": {
    slug: "link-updating",
    name: "Link updating",
    title: "Link Updating | Change the file, keep the URL | NudgeHost",
    description:
      "Upload a new version of any file and the same NudgeHost link serves it. Nothing to resend. Ideal for AI artifacts, mockups, and decks still in revision.",
    h1: "Update a shared link without changing the URL.",
    lead: "Edit the file, not the link. Replace what a NudgeHost URL points to and everyone who already has it sees the new version on their next refresh.",
    keyPoints: [
      "Open a file's settings in your dashboard, click Replace file, and upload the new version. The link stays identical.",
      "Every place you already pasted the URL now serves the updated file, with nothing to resend.",
      "Re-uploading as a new file instead would mint a new URL and break every share you already sent.",
      "View counts and link settings carry over. Only the file behind the URL changes.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "A file you share is rarely final. A pitch deck gains a slide, a mockup gets a round of feedback, an export from an AI tool goes through three revisions before anyone else sees it. On most hosts that means uploading the new file, getting a new URL, and chasing down everyone you sent the old one to. NudgeHost keeps the URL fixed. Open the file in your dashboard, go to its settings, click Replace file, and drop in the new version. The link does not move.",
      "This matters most for the things people iterate on fastest. When you {{host-claude-artifact}}, the model often rebuilds it twice before you are happy with the result, and updating in place means you publish once and keep refining behind the same address. The same is true any time you {{host-html}} for a prototype a client is reviewing. You send one link at the start of the project and push new versions to it as the work changes, instead of flooding an inbox with v2, v3, and final-final URLs.",
      "The distinction worth understanding is between replacing a file and uploading a fresh one. Replacing keeps the slug, the view history, and any password or expiry you set. Uploading a new file creates a brand-new link, and the old one keeps serving the stale version until you delete it. Deleting the old link then strands anyone still holding it, which is the broken-link problem that {{glossary-404-error}} describes. Replace-in-place sidesteps all of it.",
      "Job seekers feel this the most. If you {{use-case-recruiter}} and then tighten a case study the night before an interview, the recruiter opens the same link and sees the improved version with no second email from you. Updating a file is free and unlimited on every plan, so {{pricing}} only enters the picture when you want a custom domain or more active links, not for the swap itself.",
    ],
    faqs: [
      {
        q: "Does replacing the file reset the view count?",
        a: "No. The view count, the slug, and any password or expiry stay with the link. Only the file behind it changes.",
      },
      {
        q: "Can I revert to a previous version?",
        a: "On the Pro plan, yes. NudgeHost keeps recent versions so you can roll back to the file you had before. On the free plan, replacing is one-way, so keep your own copy of the old file.",
      },
      {
        q: "Does the link preview update when I swap the file?",
        a: "Yes. The thumbnail and title that show in Slack or iMessage regenerate from the new file, though chat apps that cached the old preview can take a while to refresh it.",
      },
      {
        q: "Is there a limit on how many times I can update a link?",
        a: "No. You can replace the file behind a link as often as you like, on any plan.",
      },
    ],
    relatedToolSlugs: ["features-paste-html", "host-claude-artifact", "features-shareable-links", "host-html", "features-link-previews"],
    filePillExamples: ["Same URL", "New version", "PDF", "HTML", "Live in seconds"],
  },

  "zip-upload": {
    slug: "zip-upload",
    name: "ZIP upload",
    title: "ZIP Upload | Host multi-file projects from a single archive | NudgeHost",
    description:
      "Drop a .zip and NudgeHost unpacks it, finds index.html, and serves the project as a live site. Handles React builds and multi-page sites. Free to start.",
    h1: "Upload a ZIP file and serve it as a website.",
    lead: "Bundle a multi-file project into one .zip, drop it in, and NudgeHost unpacks the archive and serves it as a live site at a single URL.",
    keyPoints: [
      "Upload a .zip and NudgeHost extracts it, finds the index.html, and serves the unpacked files as a site.",
      "Asset paths resolve relative to the archive root, so CSS, fonts, images, and scripts load the way they do locally.",
      "Built React, Vue, and plain multi-page sites all work, as long as the entry point is an index.html.",
      "Free plan archives are up to 25MB. The Pro plan raises the per-file ceiling.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "A single HTML file is easy to share. A project that spans an index page, a stylesheet, a folder of images, and a few scripts is the awkward case, because all those files have to travel together and keep their relative paths intact. Zipping them solves that, and NudgeHost takes the archive the rest of the way. When you upload a .zip, it extracts the contents, looks for an index.html at the root, and serves the unpacked files as a live site. A request for /styles.css or /img/logo.png resolves against the archive exactly as it did on your machine.",
      "The choice between zipping and pasting comes down to how many files you have. For a self-contained single page, it is quicker to {{features-paste-html}} and skip the archive entirely. For anything with separate assets, the ZIP route is the one that keeps everything wired together. Either way the result is a {{glossary-static-site}}, served as plain files with nothing rebuilding on each visit, which is why it loads fast and never needs a server.",
      "Front-end build tools make this routine. Run your production build, zip the output folder, and you have a deployable archive. The flow to {{host-react-app}} is this exact path, and it applies equally to Vue, Svelte, and any framework that emits static files. Client-side routing keeps working because unmatched paths fall back to the index, so a direct visit to /about does not break.",
      "A couple of details save you a support ticket. If the archive has no index.html at its root, NudgeHost serves a file listing instead of a site, so check that your entry point is not buried one folder deep. ZIPs made on macOS carry a __MACOSX folder and stray .DS_Store files, both filtered out automatically on unpack. You can {{host-zip}} for free up to 25MB per archive, and {{pricing}} lifts that ceiling when a production bundle with vendored libraries runs larger.",
    ],
    faqs: [
      {
        q: "What happens if my ZIP has no index.html?",
        a: "NudgeHost serves a browsable file listing instead of a rendered site. Add an index.html at the archive root, or rename your entry page, and it serves as a site on the next upload.",
      },
      {
        q: "Can I upload nested folders inside the ZIP?",
        a: "Yes. The folder structure is preserved and files load at their relative paths. Just make sure the index.html that should load first sits at the top level of the archive.",
      },
      {
        q: "What is the largest ZIP I can upload?",
        a: "25MB on the free plan. Most static sites and prototype builds fit comfortably; the Pro plan raises the limit for heavier production bundles.",
      },
      {
        q: "Do Mac-specific files end up in my hosted site?",
        a: "No. __MACOSX directories and .DS_Store files are stripped during unpack, so they never appear in your URL structure.",
      },
    ],
    relatedToolSlugs: ["host-zip", "host-react-app", "features-html-rendering", "features-paste-html", "host-html"],
    filePillExamples: ["ZIP", "Multi-file site", "React build", "Vite build", "Up to 25MB free"],
  },

  "paste-html": {
    slug: "paste-html",
    name: "Paste HTML",
    title: "Paste HTML Mode | Publish without saving a file first | NudgeHost",
    description:
      "Copy HTML from Claude, ChatGPT, or your editor and paste it straight into NudgeHost. No file dialog, no saving to disk. It renders live in seconds.",
    h1: "Paste HTML directly and get a live link.",
    lead: "Copy the HTML, paste it in, get a live URL. No saving a file to disk first, no upload dialog, just a hosted page in a few seconds.",
    keyPoints: [
      "Click the Paste HTML tab, paste your markup, and publish. NudgeHost hosts it at a real URL.",
      "The pasted content becomes a normal hosted page, with its own link, preview, and settings.",
      "CSS in a style block and JavaScript in a script tag run as part of the page.",
      "Free to start, with no account needed to publish your first page.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "Saving a file just to upload it is a step that does not need to exist. When the HTML already lives in your clipboard, copied from a chat with an AI tool or straight out of your editor, you should be able to publish it as-is. That is what paste mode does. Open the uploader, click the Paste HTML tab, paste your markup into the box, and click publish. A live nudgehost.com page comes back in a few seconds, with no Save As dialog and no file sitting in your Downloads folder.",
      "This is the natural fit for AI output, which arrives as text rather than a file in the first place. To {{host-claude-artifact}}, you open the artifact's source, copy the HTML, and paste it here, skipping the round trip through your filesystem. The same applies when you {{host-chatgpt-html}} from a code block in a conversation. Inline styles apply, scripts run, and libraries loaded from a CDN fetch normally, so the page behaves the way it did in the chat preview.",
      "What you paste is not a throwaway snippet. It becomes a real hosted page with its own URL, its own link preview, and the same settings as any uploaded file. You can password-protect it, set it to expire, or {{features-link-updating}} by pasting a revised version over the top. That last part is handy when you are tweaking a layout. Paste, look at the live page, paste again, all at the same address.",
      "Paste mode is free, and you can {{home}} without making an account first. {{pricing}} only matters once you want a custom domain on the page, more active links, or the NudgeHost branding removed. For a single quick page from an AI chat, the free plan covers the whole thing.",
    ],
    faqs: [
      {
        q: "Can I paste CSS and JavaScript too, or only HTML?",
        a: "All of it. CSS inside a style block and JavaScript inside a script tag run as part of the page. External stylesheets and scripts loaded from a CDN work as well.",
      },
      {
        q: "Is there a character limit on what I can paste?",
        a: "Nothing you are likely to hit by hand. The paste box accepts full single-file pages. If you are pasting something enormous, it is usually a sign the project should be a ZIP upload instead.",
      },
      {
        q: "Can I edit the HTML after publishing?",
        a: "Yes. Reopen the link in your dashboard and paste a revised version, and the page updates at the same URL. Keep your own copy of the source if you want a backup.",
      },
      {
        q: "Does the pasted page get its own real URL?",
        a: "Yes. It is a normal hosted page with its own nudgehost.com link, preview, and settings, identical to an uploaded file.",
      },
    ],
    relatedToolSlugs: ["host-claude-artifact", "host-chatgpt-html", "features-html-rendering", "features-link-updating", "host-html"],
    filePillExamples: ["Paste HTML", "AI output", "Claude artifact", "No file needed", "Live in seconds"],
    widgetDefaultTab: "paste",
  },

  "password-protection": {
    slug: "password-protection",
    name: "Password protection",
    title: "Password Protection | Control who sees your files | NudgeHost",
    description:
      "Add a password to any shared link. Recipients see a clean gate page, enter the password, and get access. Passwords are hashed with bcrypt. On the Pro plan.",
    h1: "Password-protect a shared link.",
    lead: "Put a password in front of any link. The recipient sees a clean gate page, enters the password, and the file opens. The password is hashed, never stored as text.",
    keyPoints: [
      "Open a file's settings, switch on password protection, and type the password. The link is then gated.",
      "Recipients see a NudgeHost gate page, not a browser dialog, and enter the password to view the file.",
      "Passwords are stored as a bcrypt hash, never as readable text.",
      "Available on the Pro plan, and it works the same for any file type.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "Some links are not meant for whoever finds them. A signed contract, a client deliverable, a design that is not public yet. Password protection puts a gate in front of the file. In the link's settings, switch on the password toggle and type the password you want. From then on, anyone opening the URL has to enter it before the file loads. It works the same whether you {{host-pdf}}, an image, or a full HTML page, because the gate sits in front of the link rather than inside the file.",
      "The recipient experience is deliberately plain. Instead of the grey browser authentication box that looks like a security warning, they see a NudgeHost gate page with a single password field. They type the password, and the file opens in the same tab. Behind the scenes the password is run through bcrypt and stored only as a hash, so even NudgeHost cannot read it back. For the full background on the mechanism, {{glossary-password-protection}} covers how the gate and the hashing fit together.",
      "The common cases are commercial. An NDA-covered document you send to a single counterparty, a deliverable a client has not paid for yet, or a portfolio you only {{use-case-recruiter}} once a callback is on the table. Pair the lock with {{features-link-previews}} you control, and the unfurl in Slack or email shows a neutral title rather than the file's contents, so the gate is not undercut by a thumbnail that gives it away.",
      "Password protection is part of {{pricing}} on the Pro tier. You can change or remove the password at any time from the dashboard, which immediately changes what visitors need to enter. The honest framing is that this is a practical lock for ordinary sharing, not military-grade security, and for keeping a stray forwarded link from opening the wrong file, it does exactly that.",
    ],
    faqs: [
      {
        q: "Can I change the password after I have shared the link?",
        a: "Yes. Update it in the link settings at any time. The URL stays the same, and the next visitor needs the new password.",
      },
      {
        q: "How is the password stored?",
        a: "As a bcrypt hash, never as plain text. NudgeHost compares what a visitor types against the hash, so the original password is not recoverable, even by us.",
      },
      {
        q: "Can I see who entered the password?",
        a: "You see that the file was opened and when, through the link's view stats. The gate checks the password, not the visitor's identity, so it does not collect names or emails.",
      },
      {
        q: "Does password protection work on every file type?",
        a: "Yes. The gate sits in front of the link, so a PDF, an image, a ZIP, or an HTML page is all protected the same way.",
      },
    ],
    relatedToolSlugs: ["features-custom-domains", "host-pdf", "use-case-deck", "features-link-previews", "use-case-recruiter"],
    // Pro-feature chips removed: the widget runs the free/anonymous upload
    // flow, so chips only name what that flow delivers.
    filePillExamples: ["PDF", "NDA", "Client deliverable"],
  },

  "custom-domains": {
    slug: "custom-domains",
    name: "Custom domains",
    title: "Custom Domains | Share from yourname.com | NudgeHost",
    description:
      "Point your domain at NudgeHost and serve shared files from yourname.com instead of nudgehost.com. SSL is provisioned automatically. On Pro and Team plans.",
    h1: "Use your own domain for shared links.",
    lead: "Serve your links from your own address. Point a domain at NudgeHost, and files load from yourname.com instead of nudgehost.com, with the certificate handled for you.",
    keyPoints: [
      "Add your domain in the dashboard, create one CNAME record at your registrar, and links serve from your address.",
      "SSL is provisioned automatically and free, so your custom-domain links are HTTPS with no extra setup.",
      "A subdomain like files.yourcompany.com works as well as a root domain.",
      "Available on the Pro and Team plans.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "A link is part of how your work reads. A client opening files.yourstudio.com trusts it more than a generic URL from a host they have never heard of, and the link stops advertising someone else's brand on your behalf. That is what a custom domain does. It swaps the nudgehost.com part of every link for an address you own, while the file and everything around it stay exactly the same. The background on what changes and what does not is in {{glossary-custom-domain}}.",
      "Setup is one DNS record, not a migration. Add your domain or a subdomain in the dashboard, then create a CNAME record at your registrar pointing it at NudgeHost. Once the record resolves, your links use your address. If the words CNAME and registrar are unfamiliar, {{glossary-dns}} explains how the domain name system turns a name you typed into the server that answers, which is the whole mechanism a custom domain relies on.",
      "The part people expect to be painful is the security certificate, and there is nothing to do. NudgeHost issues and renews one for your domain automatically, so the connection is encrypted from the first request and the padlock shows in the browser without you buying or uploading anything. For what that certificate actually is and why the browser checks it, {{glossary-ssl-certificate}} covers it.",
      "A custom domain also tidies up how links look when shared, since the {{features-link-previews}} that unfurl in Slack and LinkedIn now carry your address in the URL line. Custom domains live on the Pro and Team tiers, so {{pricing}} is where the feature starts. For a single personal share the default link is fine. For anything client-facing, your own domain is the difference between looking like a vendor and looking like yourself.",
    ],
    faqs: [
      {
        q: "How long does DNS propagation take?",
        a: "Usually minutes to a couple of hours, occasionally up to a day depending on your registrar and the record's TTL. Until it resolves, your default nudgehost.com link keeps working.",
      },
      {
        q: "Do I need to buy an SSL certificate separately?",
        a: "No. NudgeHost issues and renews one for your domain automatically at no cost, so your links are HTTPS without any work from you.",
      },
      {
        q: "Can I use a subdomain like files.mycompany.com?",
        a: "Yes. A subdomain is the most common setup and often the cleanest, since it leaves your main site untouched. Point the CNAME from the subdomain and you are done.",
      },
      {
        q: "Can I remove or repoint the domain later?",
        a: "Yes. Remove or repoint the domain from your dashboard at any time. Your links fall back to the default nudgehost.com address if you do.",
      },
    ],
    relatedToolSlugs: ["features-link-previews", "features-shareable-links", "host-portfolio", "use-case-recruiter", "host-html"],
    // No custom chips: every candidate here named a Pro feature the free
    // upload flow doesn't deliver, so the widget falls back to the generic
    // file-type defaults.
  },

  "full-screen-viewer": {
    slug: "full-screen-viewer",
    name: "Full-screen viewer",
    title: "Full-Screen Viewer | Clean, distraction-free file display | NudgeHost",
    description:
      "Open a NudgeHost link and the file fills the screen. No sidebar, no account prompt, no editor chrome. PDFs, HTML pages, and images each render cleanly.",
    h1: "Full-screen file viewer with no UI clutter.",
    lead: "Open a NudgeHost link and the file is the whole page. No sidebar, no sign-in prompt, no editor panels around it. Just the thing you sent.",
    keyPoints: [
      "A shared link opens the file full-screen, with no surrounding app interface.",
      "PDFs render in a clean viewer with zoom and download; HTML renders as a live page; images display centered at full resolution.",
      "There is no account prompt and no editor chrome between the recipient and the file.",
      "The viewer works on mobile browsers as well as desktop.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "Most tools wrap your file in their own product. Open a document in Google Drive and there is a toolbar, a sign-in nudge, and a sidebar of unrelated files. Open a pen on CodePen and the code editor takes half the screen before the result does. NudgeHost does the opposite. When someone opens a link, the file fills the page. A document you {{host-pdf}} renders in a clean viewer with zoom and a download button, and nothing else competes for the screen.",
      "Each file type gets the right treatment. When you {{host-html}}, the page renders live and full-bleed, the way it would on its own domain, with no frame around it. When you {{host-image}}, the picture sits centered at full resolution with a download option, not shrunk into a thumbnail grid. PDFs page through with keyboard arrows. The viewer adapts to the file instead of forcing every format into one cramped layout.",
      "The contrast with editor-first tools is the point. CodePen and similar sites are built for the author, so a viewer meets panels, tabs, and an account prompt before they reach the work. A NudgeHost link is built for the person receiving it. Combined with {{features-public-links}}, there is no login wall either, so the recipient lands on the file and nothing else. If you want the side-by-side, {{compare-tiiny}} lays out how the two approaches differ.",
      "The clean view holds up on a phone, where clutter hurts most. The file scales to the screen, the download control stays reachable, and there is no desktop-only chrome to wrestle with. The viewer is part of every link on every plan, so {{pricing}} only changes the limits around it, like custom domains and active link counts, not the viewing experience itself.",
    ],
    faqs: [
      {
        q: "Can I embed the viewer in an iframe?",
        a: "Yes. A hosted file can be embedded in an iframe on your own page, which is useful for showing a PDF or an image inside a site you already run. Password-protected links prompt for the password inside the frame.",
      },
      {
        q: "Is there a download button?",
        a: "Yes, by default. PDFs, images, and other files show a download control in the viewer. You can switch downloads off in the link settings if you want view-only access.",
      },
      {
        q: "Does the viewer work on mobile?",
        a: "Yes. The viewer is responsive, so files scale to a phone or tablet screen and the controls stay reachable. There is no app to install on either end.",
      },
      {
        q: "Will recipients see ads or a banner over the file?",
        a: "No. The free plan adds light NudgeHost branding to the page, not ads over the file, and the Pro plan removes the branding entirely.",
      },
    ],
    relatedToolSlugs: ["features-public-links", "host-pdf", "host-image", "viewer-pdf", "compare-tiiny"],
    filePillExamples: ["PDF", "HTML page", "Image", "Full-screen", "No clutter"],
  },

  "link-previews": {
    slug: "link-previews",
    name: "Link previews",
    title: "Link Previews | Rich unfurls for every shared file | NudgeHost",
    description:
      "Paste a NudgeHost link into Slack, iMessage, WhatsApp, or LinkedIn and the preview shows a real title, description, and thumbnail. PDFs show the first page.",
    h1: "Branded link previews in Slack, iMessage, and LinkedIn.",
    lead: "Paste a NudgeHost link anywhere and it unfurls properly. A real title, a description, and a thumbnail drawn from the file itself, not a blank grey box.",
    keyPoints: [
      "Shared links unfurl with a title, description, and a thumbnail generated from the file's own content.",
      "A PDF shows its first page; an image shows a scaled preview; an HTML page shows a generated screenshot.",
      "The preview regenerates when you replace the file behind the link.",
      "Previews work across Slack, iMessage, WhatsApp, LinkedIn, and other apps that read Open Graph tags.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "A link that unfurls into a blank grey rectangle looks broken, and people click it less. NudgeHost generates a proper preview for every hosted file. The thumbnail is built from the file's own content rather than a generic placeholder, so the card actually shows what is on the other end. The mechanism is the Open Graph image, and {{glossary-og-image}} explains how the tags in a page tell Slack or LinkedIn what to draw in the preview card.",
      "What each app shows depends on the app, not on extra work from you. Slack renders a full unfurl card with the title, a line of description, and the thumbnail. iMessage shows its rounded link preview with the image. WhatsApp and LinkedIn read the same tags and build their own version of the card. Because the preview comes from standard metadata, you set nothing per platform. You paste the link and the receiving app fills in the rest.",
      "The thumbnail matches the file. When you {{host-pdf}}, the preview shows the first page, so a proposal looks like a proposal in the chat. When you {{host-image}}, the card shows a scaled version of the picture. An HTML page gets a generated screenshot of the rendered result. And when you {{features-link-updating}}, the preview regenerates from the new file, so the card never shows a stale version of something you have already revised.",
      "One quirk is worth knowing. Chat apps cache previews hard, so after you swap a file the old card can linger in Slack or iMessage for a while until their cache expires, even though the link already serves the new file. The previews come with every plan, and {{pricing}} only governs the limits around your links rather than whether they unfurl. If a preview ever fails to show, it is usually the receiving app's cache rather than the link itself.",
    ],
    faqs: [
      {
        q: "Can I customize the preview image?",
        a: "On the Pro plan you can set a custom preview image for a link. Otherwise NudgeHost generates one from the file, which is the right default for most shares.",
      },
      {
        q: "How fast does the preview update after I swap the file?",
        a: "The link serves the new file immediately, but chat apps cache previews. Slack and iMessage can show the old card for minutes to hours until their cache refreshes.",
      },
      {
        q: "What if the preview does not show at all?",
        a: "Usually the receiving app has not fetched the link yet, or it cached an earlier failed attempt. Re-pasting the link, or pasting it in a fresh message, normally forces a new fetch.",
      },
      {
        q: "Do previews work in WhatsApp and LinkedIn too?",
        a: "Yes. Any app that reads Open Graph tags builds a preview, which covers Slack, iMessage, WhatsApp, LinkedIn, Discord, and most others.",
      },
    ],
    relatedToolSlugs: ["features-link-updating", "host-pdf", "host-image", "features-custom-domains", "features-shareable-links"],
    filePillExamples: ["Slack unfurl", "iMessage preview", "PDF first page", "Thumbnail", "Open Graph"],
  },

  "public-links": {
    slug: "public-links",
    name: "Public links",
    title: "Public Links | No login wall for recipients | NudgeHost",
    description:
      "NudgeHost links are public by default. The person you send it to clicks and sees the file instantly. No account creation, no sign-in, no request-access email chain.",
    h1: "Anyone can view the link, no account required.",
    lead: "Send the link, they see the file. No account to create, no sign-in screen, no request-access email thread. That is the default, not a setting you hunt for.",
    keyPoints: [
      "Links are public by default. Anyone with the URL opens the file with no account and no sign-in.",
      "There is no request-access step and no permissions screen between the recipient and the file.",
      "Public means NudgeHost counts views, not viewer identities. The recipient is not asked for an email.",
      "You can make a link private with a password when you need to, on the Pro plan.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "The most common failure in file sharing is the login wall. You send a Google Drive link and the recipient gets a permissions screen and a request-access button instead of the file. You send a Dropbox link and a non-user is asked to sign up first. NudgeHost made the opposite call. Links are public by default. When you {{host-pdf}} and send the URL, the person on the other end clicks once and reads it, with no account and no gate in the way.",
      "This is a deliberate product decision, not a missing feature. Drive optimizes for permissions, which is right inside a company and wrong when you are sending one file to one person who does not work with you. CodePen wants viewers to have an account before the work renders cleanly. NudgeHost treats the recipient as someone who should see the file immediately, because that is the entire point of sending it. {{compare-tiiny}} walks through how that choice plays out against another host in the same space.",
      "Public also means the recipient stays anonymous. NudgeHost counts how many times a link was opened and roughly when, but it does not ask the viewer for an email or make them identify themselves to see the file. They land straight on the content, shown in a {{features-full-screen-viewer}} with nothing around it. You get the open count; they get the file. Neither side fills in a form.",
      "Public by default does not mean public forever. When a link should be restricted, add a password or an expiry from its settings, both on {{pricing}} for the Pro tier. For everyday sharing, leave it open and you can {{home}} without anyone you send it to needing to sign up. The link works on any device and any browser, because there is no app and no account standing between the recipient and the file.",
    ],
    faqs: [
      {
        q: "Can I make a link private later?",
        a: "Yes. Add a password or set an expiry from the link's settings on the Pro plan, and the public link becomes gated without changing the URL.",
      },
      {
        q: "Are public links indexed by search engines?",
        a: "Not automatically. NudgeHost does not submit your links to search engines, and you can mark a link to discourage indexing. A password-protected link cannot be indexed, since the gate sits in front of it.",
      },
      {
        q: "Can I see how many people viewed my link?",
        a: "Yes. Every link reports a view count and roughly when it was opened. It counts views, not viewer identities, so you see the number without collecting anyone's details.",
      },
      {
        q: "Does the recipient ever need a NudgeHost account?",
        a: "No. Viewing is always account-free. Only the person creating and managing links needs an account.",
      },
    ],
    relatedToolSlugs: ["features-full-screen-viewer", "host-pdf", "compare-tiiny", "features-shareable-links", "features-password-protection"],
    filePillExamples: ["No login", "No sign-up", "Public by default", "View count", "Any device"],
  },

  "html-rendering": {
    slug: "html-rendering",
    name: "HTML rendering",
    title: "HTML Rendering | Your HTML runs live, not as a download | NudgeHost",
    description:
      "Upload or paste an HTML file and NudgeHost renders it as a live web page. JavaScript runs, CSS applies, CDN libraries load. The recipient sees a working app.",
    h1: "Live HTML rendering for hosted pages.",
    lead: "Your HTML runs, it does not download. Upload or paste a page and NudgeHost serves it live, with scripts running and styles applied, the way a browser loads any site.",
    keyPoints: [
      "Uploaded or pasted HTML is served as a live page, not handed over as a file to download.",
      "JavaScript executes, CSS applies, and libraries loaded from a CDN fetch normally.",
      "CSS frameworks like Tailwind work when loaded via a CDN link in the page.",
      "Server-side languages like PHP and Python do not run; the page is served as static files.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "There is a real difference between serving an HTML file and rendering it. Some hosts hand the recipient the raw markup or a download prompt, so a GitHub Gist of a page shows you the code, not the result. NudgeHost renders it. When you {{host-html}}, the browser loads the page the way it would load any website, the markup becomes a layout, and the recipient sees the working result rather than a wall of tags.",
      "Anything that runs in a browser runs here. Inline JavaScript executes on load, event handlers fire, and a script that fetches data and updates the page does so live. Libraries pulled from a CDN load the same way, so React or Vue brought in through a script tag works, and a CSS framework like Tailwind applies when it is linked from its CDN. If you are unsure what a CDN is doing in that sentence, {{glossary-cdn}} explains how those external libraries reach the page so quickly.",
      "This is what makes NudgeHost the right home for AI-generated HTML, which leans heavily on CDN-loaded libraries and inline scripts. When you {{host-claude-artifact}}, the dashboard or game it built runs for your recipient exactly as it ran in the chat. The quickest way in is to {{features-paste-html}} straight from the conversation. What you get is a {{glossary-static-site}}, served as files with no build step, which is why it loads fast and stays cheap to host.",
      "The boundary is the server side. NudgeHost serves static files, so there is no PHP, no Python, no Node process answering requests behind the page. Anything needing a backend, like a database write or a server-rendered template, has to live elsewhere and be called over HTTPS from the page. Client-side code has no such limit. Rendering is part of every plan, and {{pricing}} only governs file sizes and active link counts, not whether your HTML runs.",
    ],
    faqs: [
      {
        q: "Does JavaScript execute on a hosted page?",
        a: "Yes. Client-side JavaScript runs on load exactly as it would on any website, including scripts that fetch data and update the page.",
      },
      {
        q: "Can I use React or Vue through a CDN?",
        a: "Yes. A page that brings React, Vue, or any library in through a script tag works, since the browser fetches those files normally when the page loads.",
      },
      {
        q: "What about server-side code like PHP or Python?",
        a: "It does not run. NudgeHost serves static files, so there is no server process behind the page. A backend has to be hosted elsewhere and called over HTTPS from your client-side code.",
      },
      {
        q: "Will a CSS framework like Tailwind work?",
        a: "Yes, when it is loaded from a CDN link in the page. A locally built stylesheet works too, as long as it is included in your upload or ZIP.",
      },
    ],
    relatedToolSlugs: ["host-html", "host-claude-artifact", "features-paste-html", "features-zip-upload", "host-chatgpt-html"],
    filePillExamples: ["HTML", "JavaScript", "Tailwind via CDN", "Claude artifact", "Live render"],
  },

  "shareable-links": {
    slug: "shareable-links",
    name: "Shareable links",
    title: "Shareable Links | Short nudgehost.com URLs for any file | NudgeHost",
    description:
      "Every uploaded file gets a short nudgehost.com link. The slug is readable, the link is permanent until you delete it, and it works on any device with no app.",
    h1: "Get a short, shareable link for any file.",
    lead: "Every file you upload gets a short, readable nudgehost.com link. It works on any device, in any browser, with nothing to install on either end.",
    keyPoints: [
      "Every uploaded file gets a short nudgehost.com/f/[slug] link with a readable slug.",
      "Links are permanent until you delete them. There is no monthly check-in rule that expires them.",
      "Copy the link or use the built-in QR code to share it. The QR code is free on every plan.",
      "The same link format works for a PDF, an HTML page, a ZIP, or any other file.",
    ],
    author: "Mark Boreland",
    datePublished: "2026-05-26",
    dateModified: "2026-05-26",
    body: [
      "Every file you upload comes back as a short link in the form nudgehost.com/f/ followed by a readable slug. It is short enough to paste into a message without wrapping, and the slug is legible rather than a random string of forty characters. The same format applies no matter what you uploaded, so a PDF, an HTML page, and a ZIP archive all produce a link of the same clean shape.",
      "The link is permanent until you choose to delete it. There is no rule that your link dies if you do not log in each month, which some hosts impose on their free tier and which quietly breaks links people were relying on. {{compare-tiiny}} covers that difference in detail. On NudgeHost a link you made a year ago and forgot about still resolves, unless you set an expiry on it yourself.",
      "Sharing the link takes one of two forms. Copy it to the clipboard from the dashboard, or use the built-in QR code, which is handy for print, a slide, or anything someone scans with a phone instead of typing. {{glossary-qr-code}} covers how the code encodes your URL, and it is free on every plan rather than gated behind an upgrade. Because the links are {{features-public-links}}, whoever you send it to opens the file without an account in the way.",
      "A good link does more than resolve. NudgeHost generates {{features-link-previews}} for it, so the URL unfurls into a proper card with a title and thumbnail when pasted into Slack or a message, rather than a bare string. You can {{home}} and have your first link in a few seconds, on any device, in any browser, with no app to install for you or for the person receiving it.",
    ],
    faqs: [
      {
        q: "Can I customize the link slug?",
        a: "On the Pro plan you can set a custom slug, so a link reads the way you want rather than using the auto-generated one. The free plan assigns a short readable slug for you.",
      },
      {
        q: "How long are the links?",
        a: "Short. They follow the nudgehost.com/f/[slug] format, with a slug that stays legible rather than a long random string, so the whole URL fits on one line in a message.",
      },
      {
        q: "Do links ever expire on the free plan?",
        a: "Not on their own. A link stays live until you delete it or set an expiry yourself. There is no log-in-monthly rule that retires it behind your back.",
      },
      {
        q: "Is the QR code free?",
        a: "Yes. Every link has a built-in QR code on every plan, including the free one. Copy the URL or grab the QR code, whichever suits where you are sharing it.",
      },
    ],
    relatedToolSlugs: ["features-public-links", "features-link-previews", "features-link-updating", "compare-tiiny", "host-pdf"],
    filePillExamples: ["Short URL", "Readable slug", "QR code", "Permanent", "Any device"],
  },
};
