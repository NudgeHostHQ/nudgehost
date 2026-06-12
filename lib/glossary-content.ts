// Glossary silo content. Problem-focused term definitions, not a generic
// dictionary: every term explains what it means, why it matters for file
// sharing, and how NudgeHost handles it. Each body carries {{key}} contextual
// tokens (see lib/internal-links.ts and components/contextual-prose.tsx),
// including at least one money-page link and one cross-silo link, so every
// term page is a linking hub rather than a dead end.

export type GlossaryFaq = { question: string; answer: string };

export type GlossaryContent = {
  slug: string;
  term: string; // display name, e.g. "Static site"
  title: string; // <title>
  metaDescription: string;
  h1: string;
  tldr: string[]; // 3-4 short factual sentences shown near the top
  body: string[]; // paragraphs; may contain {{key}} contextual-link tokens
  faqs: GlossaryFaq[];
  relatedTerms: string[]; // other glossary slugs, for in-silo cross-linking
  relatedToolSlugs: string[]; // TOOL_REGISTRY keys for the Related tools grid
};

export const glossaryContentMap: Record<string, GlossaryContent> = {
  "static-site": {
    slug: "static-site",
    term: "Static site",
    title: "What is a static site? Plain-English definition",
    metaDescription:
      "A static site is a set of HTML, CSS, and JavaScript files served as-is, with no server rendering each page. Here is what that means for sharing your work.",
    h1: "What is a static site?",
    tldr: [
      "A static site is a bundle of HTML, CSS, and JavaScript files served exactly as they are, with no server building each page on request.",
      "Because there is nothing to compute, static sites load fast and almost never go down.",
      "Most portfolios, landing pages, and AI-generated pages are static, which is why they host so easily.",
    ],
    body: [
      "A static site is a website made of files that are sent to the browser unchanged. There is no database query and no server-side rendering step on each visit, just HTML, CSS, JavaScript, and images sitting in a folder. When someone opens the page, the host hands those files over and the browser does the rest. This is the opposite of a dynamic app like a forum or a dashboard, where a server builds a fresh page for every request.",
      "Static is the right shape for most things people actually need to publish. A single landing page, a design portfolio, a one-page event site, or a page an AI tool generated for you are all static by nature. NudgeHost serves them directly, so you can {{host-html}} and the page is live at a clean URL in seconds with no build server to configure. A multi-file project zips up and serves the same way, with the JavaScript running client-side exactly as it would locally.",
      "Speed and reliability are the practical payoff. With no server logic to execute, the file is delivered from a nearby edge server, the speed trick behind {{glossary-cdn}}, which is why static pages feel instant on repeat visits. Hosting one on NudgeHost is free, and {{pricing|a paid plan}} adds a custom domain when you want the page on your own address. If you have only ever heard the phrase next to framework builds, the short version is that the output of most site builders is static too.",
    ],
    faqs: [
      {
        question: "Is a static site the same as a plain HTML file?",
        answer:
          "A single HTML file is the simplest static site. Static just means the files are served as-is, whether that is one file or a folder of them.",
      },
      {
        question: "Can a static site have interactivity?",
        answer:
          "Yes. JavaScript runs in the browser, so forms, animations, and calculators all work. What it lacks is server-side logic running on each request.",
      },
      {
        question: "Why do static sites load so fast?",
        answer:
          "There is nothing to compute per visit. The host sends the cached file straight to the browser, which is far quicker than building a page on demand.",
      },
    ],
    relatedTerms: ["cdn", "cache", "drag-and-drop"],
    relatedToolSlugs: ["host-html", "host-zip", "host-react-app", "host-claude-artifact"],
  },

  cdn: {
    slug: "cdn",
    term: "CDN",
    title: "What is a CDN? Content delivery networks explained",
    metaDescription:
      "A CDN is a network of servers spread around the world that caches your files close to each visitor. Here is why that makes shared files load fast.",
    h1: "What is a CDN?",
    tldr: [
      "A CDN, or content delivery network, is a set of servers around the world that each keep a cached copy of your files.",
      "A visitor is served from the nearest server, so the file travels a short distance instead of crossing the planet.",
      "The result is faster loads and steadier performance when a link gets a lot of traffic at once.",
    ],
    body: [
      "A CDN is a network of servers in many locations that each hold a copy of your file. When someone opens your link, they are served from the server closest to them rather than from one machine in a single city. Distance is latency, so shaving thousands of miles off the trip is the difference between a page that appears at once and one that hangs for a beat. The same copies also absorb sudden spikes, so a link that gets shared widely does not buckle.",
      "NudgeHost serves files through a CDN in front of its storage, which is why a hosted page feels quick whether the visitor is next door or on another continent. This pairs naturally with {{glossary-cache}}, since the CDN holds the cached copy that makes repeat visits instant. For image-heavy pages the effect is most obvious, so when you {{host-image}} the picture loads from the edge rather than the origin every time.",
      "On the free plan your files already ride this network, and that stays true at the higher limits on {{pricing|the Pro plan}}. You never configure any of it. There is no region to pick and no cache to warm by hand. The point of a CDN for someone sharing a file is simply that they never have to think about it.",
    ],
    faqs: [
      {
        question: "Do I have to set up the CDN myself?",
        answer:
          "No. Files hosted on NudgeHost are served through the CDN automatically. There is nothing to configure.",
      },
      {
        question: "Does a CDN help small files too?",
        answer:
          "Yes. Even a small HTML page benefits, because the visitor connects to a nearby server instead of a distant one, which cuts the round-trip time.",
      },
      {
        question: "Is a CDN the same as caching?",
        answer:
          "They work together. The CDN is the network of servers; the cache is the stored copy each server keeps so it does not have to fetch the file again.",
      },
    ],
    relatedTerms: ["cache", "bandwidth", "static-site"],
    relatedToolSlugs: ["host-image", "host-html", "host-mp4", "host-pdf"],
  },

  "404-error": {
    slug: "404-error",
    term: "404 error",
    title: "What is a 404 error? Causes and how to avoid broken links",
    metaDescription:
      "A 404 error means the page at a URL does not exist. Here is what causes them when you share files and how NudgeHost keeps your links from breaking.",
    h1: "What is a 404 error?",
    tldr: [
      "A 404 error is the browser saying the page at this address does not exist.",
      "Shared files most often 404 because the file moved, was renamed, or the host expired the link.",
      "A broken link in a job application or a client email costs you at the worst moment.",
    ],
    body: [
      "A 404 is the status code a server returns when there is nothing at the address requested. The link looks fine, the visitor clicks, and they land on a dead page. For most browsing this is a minor annoyance. For a shared file it is expensive, because the people clicking your link are usually the people you most want to reach: a recruiter opening a portfolio, a client opening a proposal, a guest opening directions to a venue.",
      "Most broken share links come from the file moving. You re-upload a portfolio to a new folder, the old URL stops resolving, and every place you pasted the previous link now 404s. This is exactly the failure NudgeHost is built to avoid. When you update a file the URL stays the same, so someone who wants to {{use-case-recruiter}} can swap in a new version without invalidating the link already on their CV. The only deliberate way a NudgeHost link stops working is if you set it to expire, which is a feature rather than an accident.",
      "If you do need a link to stop resolving on a schedule, that is what {{glossary-link-expiry}} is for, and a deleted file returns a clean message rather than a confusing dead end. Hosting is free to start, and {{pricing|the paid tier}} covers the higher limits. The short version is that a 404 should be a choice you made, never a surprise your recipient finds.",
    ],
    faqs: [
      {
        question: "Why did my shared link suddenly 404?",
        answer:
          "Usually the file moved or was renamed on the host, so the old URL no longer points at anything. On NudgeHost, updating a file keeps the same URL to prevent this.",
      },
      {
        question: "Does a 404 hurt my SEO?",
        answer:
          "A few are normal. Many broken links on a site you control waste crawl budget and frustrate visitors, so they are worth fixing.",
      },
      {
        question: "What does a NudgeHost link show when a file is gone?",
        answer:
          "If you delete a file or it expires, the link shows a clear message explaining the file is no longer available, not a raw error page.",
      },
    ],
    relatedTerms: ["link-expiry", "https", "dns"],
    relatedToolSlugs: ["use-case-recruiter", "host-pdf", "host-portfolio", "host-html"],
  },

  https: {
    slug: "https",
    term: "HTTPS",
    title: "What is HTTPS? Why secure links matter when sharing files",
    metaDescription:
      "HTTPS encrypts the connection between a browser and a website. Here is why every NudgeHost link is HTTPS by default and what that protects.",
    h1: "What is HTTPS?",
    tldr: [
      "HTTPS is the encrypted version of the connection between a browser and a website.",
      "It stops anyone on the network from reading or tampering with the file in transit.",
      "Browsers now flag plain HTTP pages as not secure, which looks alarming on a link you sent.",
    ],
    body: [
      "HTTPS is HTTP with encryption layered on top. When a browser loads a page over HTTPS, the data between the visitor and the server is scrambled so that nobody sitting on the same coffee-shop network can read it or quietly alter it. The padlock in the address bar is the browser confirming that encryption is in place and that the certificate matches the domain.",
      "Every NudgeHost link is HTTPS by default, with no setting to toggle and nothing to install. This matters more than it sounds, because modern browsers actively label plain HTTP pages as not secure, and a recruiter or client who sees that warning on a link you sent will hesitate before clicking. Serving a shared document over a secure connection removes that friction. An {{glossary-ssl-certificate|SSL certificate}} handles the encryption, and the host provisions and renews it for you.",
      "Security is also why you can share genuinely sensitive material as a link. A contract travels encrypted when you {{host-pdf|host it as a PDF}}, and you can layer password protection on top when the contents warrant it. Hosting is free to begin with, and {{pricing|a paid plan}} adds custom domains that keep the same automatic HTTPS on your own address. The takeaway is that secure delivery is the default here, not an upgrade.",
    ],
    faqs: [
      {
        question: "Do I need to buy an SSL certificate?",
        answer:
          "No. NudgeHost provisions and renews the certificate automatically, including on custom domains, so every link is HTTPS without any work from you.",
      },
      {
        question: "Is HTTPS enough to keep a file private?",
        answer:
          "HTTPS protects the file in transit. To control who can open it, add password protection or set the link to expire.",
      },
      {
        question: "Why does my browser say a link is not secure?",
        answer:
          "That warning appears on plain HTTP pages. A NudgeHost link is always HTTPS, so it will not trigger the warning.",
      },
    ],
    relatedTerms: ["ssl-certificate", "password-protection", "custom-domain"],
    relatedToolSlugs: ["host-pdf", "use-case-deck", "host-html", "viewer-pdf"],
  },

  cors: {
    slug: "cors",
    term: "CORS",
    title: "What is CORS? Cross-origin requests, in plain English",
    metaDescription:
      "CORS is the browser rule that controls when a page on one domain can load data from another. Here is why it matters for hosted apps and AI outputs.",
    h1: "What is CORS?",
    tldr: [
      "CORS, or cross-origin resource sharing, is the browser rule that decides when code on one domain may fetch data from another.",
      "When it blocks a request you see a console error and the data never loads.",
      "It mostly bites when a hosted app calls an external API that has not allowed your origin.",
    ],
    body: [
      "CORS is a safety rule built into every browser. By default, JavaScript running on one domain cannot read a response from a different domain unless that other server explicitly allows it with the right header. The rule exists so a random page cannot quietly read your email or your bank account in another tab. The side effect is that a perfectly innocent app can hit a wall when it tries to fetch data from an API that has not opted in.",
      "This is the error people meet most often after they {{host-react-app}} or paste in something an AI tool built. The page loads, but a fetch to an external service fails with a cross-origin message in the console. The fix is on the API side. The service has to send a header naming your origin as allowed. NudgeHost serves your files with sensible headers so the files themselves load cleanly, but it cannot grant permission on an API it does not control.",
      "When you {{host-chatgpt-html}} and the page only uses CDN scripts and inline code, CORS never comes up, because nothing is making a cross-origin data request. It surfaces only when your code talks to a separate backend. Hosting is free to start and {{pricing|the Pro plan}} covers higher limits. The practical rule is simple. If a hosted app cannot reach an API, check whether that API allows your origin before assuming the host is at fault.",
    ],
    faqs: [
      {
        question: "Why does my hosted app get a CORS error?",
        answer:
          "Your code is calling an API on another domain that has not listed your origin as allowed. The API has to send the right header; the host cannot add it for a service it does not own.",
      },
      {
        question: "Does CORS affect a plain HTML page?",
        answer:
          "Only if that page makes cross-origin data requests. A self-contained page using inline code or CDN scripts is unaffected.",
      },
      {
        question: "Can NudgeHost fix a CORS error for me?",
        answer:
          "NudgeHost serves your files with correct headers. The blocked request is between your code and a third-party API, which you or the API provider must configure.",
      },
    ],
    relatedTerms: ["mime-type", "static-site", "presigned-url"],
    relatedToolSlugs: ["host-react-app", "host-chatgpt-html", "host-claude-artifact", "host-vue-app"],
  },

  dns: {
    slug: "dns",
    term: "DNS",
    title: "What is DNS? The domain name system, explained simply",
    metaDescription:
      "DNS is the system that turns a domain name into a server address. Here is what it does and why it matters when you put a share link on your own domain.",
    h1: "What is DNS?",
    tldr: [
      "DNS, the domain name system, is the address book of the internet, translating a domain name into the server address behind it.",
      "When you point a custom domain at a host, you are editing DNS records.",
      "Changes can take a little while to spread, which is the propagation delay people run into.",
    ],
    body: [
      "DNS is the lookup that happens before any page loads. You type a name, and DNS returns the numeric address of the server that answers for it, the way a contacts app turns a person's name into a phone number. Every domain has a set of records that say where its traffic should go. The most relevant ones for sharing are the records that point a domain, or a subdomain like links.yoursite.com, at a host.",
      "This is the machinery behind {{glossary-custom-domain}}. When you want your own address on a share link instead of the default, you add a DNS record at your registrar pointing to NudgeHost, and from then on the domain resolves to your hosted files. The feature itself, using your own domain, lives on a paid tier, so {{pricing|the pricing page}} is where that starts. The hosting underneath is the same as any other page you would {{host-html}}.",
      "The one quirk worth knowing is propagation. A DNS change is not always instant, because the answer is cached at many points along the way, so a new record can take anywhere from minutes to a day to be seen everywhere. That is normal and not a sign anything is broken. Once it settles, the domain points where you told it, and the certificate that secures it is issued automatically.",
    ],
    faqs: [
      {
        question: "Why is my new custom domain not working yet?",
        answer:
          "DNS changes propagate gradually because the old answer is cached in many places. Give it from a few minutes up to a day to settle everywhere.",
      },
      {
        question: "Do I need to understand DNS to use NudgeHost?",
        answer:
          "Not for a standard link. DNS only matters if you add a custom domain, and then it is a single record you copy from the dashboard to your registrar.",
      },
      {
        question: "What record do I add for a custom domain?",
        answer:
          "Usually a CNAME pointing your domain or subdomain at NudgeHost. The exact value is shown in your dashboard when you add the domain.",
      },
    ],
    relatedTerms: ["custom-domain", "https", "cdn"],
    relatedToolSlugs: ["host-html", "use-case-recruiter", "host-portfolio", "host-pdf"],
  },

  ftp: {
    slug: "ftp",
    term: "FTP",
    title: "What is FTP? The old way to upload files to a server",
    metaDescription:
      "FTP is a decades-old protocol for moving files to a web server. Here is why it is painful for sharing and what drag-and-drop hosting replaces it with.",
    h1: "What is FTP?",
    tldr: [
      "FTP, the file transfer protocol, is an old way of copying files onto a web server.",
      "It needs a client app, a host address, and credentials, which is a lot of setup just to put one file online.",
      "Drag-and-drop hosting does the same job without the client, the credentials, or the folder paths.",
    ],
    body: [
      "FTP dates to the early internet and still lingers in traditional web hosting. To use it you install an FTP client, enter a server address, a username, and a password, then drag files into the correct directory on the remote machine. It works, but it is a workflow built for administering a server, not for the simple act of sharing a single document with one person. Every step is a chance to put the file in the wrong folder or fumble a credential.",
      "Most people reaching for FTP only want a file to be openable at a URL. That does not need a protocol from 1971. NudgeHost replaces the entire dance with {{glossary-drag-and-drop}}. You {{home}} by dropping the file onto the page, and a link comes back. There is no host string to remember and no directory tree to click through. If your project is several files, you zip it and the bundle serves as a small site, which is the case FTP was traditionally used for.",
      "The practical difference is time. FTP is minutes of setup per server; dropping a file is seconds, and the result is a clean shareable link rather than a path buried on a server you now have to maintain. Hosting is free to start and {{pricing|a paid plan}} raises the limits. FTP still has a place in old-school server administration, but for getting a file in front of someone it is the long way round.",
    ],
    faqs: [
      {
        question: "Do I need an FTP client to use NudgeHost?",
        answer:
          "No. You drag a file onto the page or click to browse, and a link comes back. There is no client, server address, or credential to manage.",
      },
      {
        question: "Can I upload a whole folder the way I would over FTP?",
        answer:
          "Zip the folder and upload the archive. NudgeHost can serve the contents as a small site, which covers the usual reason people used FTP.",
      },
      {
        question: "Is FTP less secure than a hosted link?",
        answer:
          "Plain FTP is unencrypted. A NudgeHost link is served over HTTPS by default, so the file travels encrypted.",
      },
    ],
    relatedTerms: ["drag-and-drop", "static-site", "https"],
    relatedToolSlugs: ["host-html", "host-zip", "host-react-app", "host-pdf"],
  },

  cache: {
    slug: "cache",
    term: "Cache",
    title: "What is a cache? Why shared files load fast on repeat visits",
    metaDescription:
      "A cache is a stored copy of a file kept close to where it is needed, so it does not have to be fetched again. Here is how caching speeds up shared links.",
    h1: "What is a cache?",
    tldr: [
      "A cache is a saved copy of a file kept somewhere fast, so the next request can be answered without fetching it again.",
      "Browsers cache locally, and a CDN caches at servers near the visitor.",
      "Caching is the main reason a shared link feels instant the second time someone opens it.",
    ],
    body: [
      "A cache is a stored copy kept close to where it will be needed next. Your browser caches images and scripts on your own machine so a page you revisit does not re-download everything. A CDN caches files on servers near visitors so the file does not travel from the origin every time. In both cases the idea is the same, which is to do the work once and reuse the result instead of repeating it.",
      "For shared files this is why the second open is quicker than the first. The first visitor pulls the file to a nearby edge server, and everyone after them is served that cached copy at once. NudgeHost leans on this through the network that powers how a CDN works, so a page you {{host-html}} stays fast even under a burst of traffic. Heavy assets benefit most, which is why it pays to {{converter-png-to-webp|convert PNG to WebP}} before uploading; the optimized image caches small and serves quickly.",
      "Caching has one wrinkle worth knowing. When you replace a file, a previously cached copy can linger briefly until it refreshes, so a change is not always visible to everyone in the same instant. This usually clears in moments. Hosting is free to start and {{pricing|the paid tier}} covers the higher limits. For the person sharing a file, the cache is invisible and entirely upside, meaning faster loads with nothing to manage.",
    ],
    faqs: [
      {
        question: "Why does my updated file still show the old version?",
        answer:
          "A cached copy can linger for a short time after you replace a file. It refreshes on its own, usually within moments, and then everyone sees the new version.",
      },
      {
        question: "Do I control the caching myself?",
        answer:
          "No configuration is needed. NudgeHost sets sensible caching so files load fast on repeat visits without any input from you.",
      },
      {
        question: "Does caching affect a file only I open?",
        answer:
          "Your browser still caches it locally, so your own repeat visits are quicker. The bigger gains show up when many people open the same link.",
      },
    ],
    relatedTerms: ["cdn", "bandwidth", "static-site"],
    relatedToolSlugs: ["host-html", "converter-png-to-webp", "host-image", "host-mp4"],
  },

  seo: {
    slug: "seo",
    term: "SEO",
    title: "What is SEO? Search basics for hosted pages and portfolios",
    metaDescription:
      "SEO is the practice of helping search engines find and rank your pages. Here is what matters when the page you are hosting is a portfolio or an HTML site.",
    h1: "What is SEO?",
    tldr: [
      "SEO, search engine optimization, is the work of making a page easy for search engines to find, understand, and rank.",
      "It comes down to clear content, a fast and crawlable page, and links from relevant places.",
      "It matters whenever you want a hosted page to be found, rather than only opened from a link you sent.",
    ],
    body: [
      "SEO is everything that helps a search engine discover a page, work out what it is about, and decide where to rank it. At its core it is unglamorous: write content that answers a real question, make the page load fast and render without tricks, and earn links from places that are themselves relevant. There is no secret setting. A page that genuinely helps the person who lands on it is the thing search engines are trying to reward.",
      "Most files you share are private links that do not need SEO at all. It starts to matter when the hosted page is meant to be found. If you {{host-html}} for a portfolio or a small site, search visibility becomes part of the job. A clean URL, a real title, fast loading, and a good link preview all help. Search engines also read the words on the page, so a portfolio with actual project descriptions does better than one that is only images. If you want to be discoverable, the page that anchors it should describe your work in plain language.",
      "A useful related lever is {{glossary-og-image}}, since a strong preview makes the page more clickable wherever it is shared, and clicks are a signal. Hosting a page is free, and {{home}} is where you start by dropping the file in. Good SEO for a hosted page is the same as SEO anywhere, which comes down to a fast, clear, and genuinely useful page.",
    ],
    faqs: [
      {
        question: "Do my private share links need SEO?",
        answer:
          "No. A link you send directly to someone does not need to rank. SEO matters only for pages you want people to discover through search.",
      },
      {
        question: "Does hosting a page on NudgeHost help it rank?",
        answer:
          "It gives you a fast, HTTPS page with a clean URL and a good link preview, which are healthy foundations. Ranking still depends on content and external links.",
      },
      {
        question: "What is the single biggest SEO factor for a portfolio?",
        answer:
          "Real, readable content. A portfolio that describes each project in words gives search engines something to understand and rank.",
      },
    ],
    relatedTerms: ["og-image", "static-site", "custom-domain"],
    relatedToolSlugs: ["host-html", "use-case-recruiter", "host-portfolio", "host-pdf"],
  },

  "og-image": {
    slug: "og-image",
    term: "og:image",
    title: "What is an og:image? Why link previews look good or bad",
    metaDescription:
      "An og:image is the preview picture that appears when a link is shared in Slack, iMessage, or LinkedIn. Here is how it works and why NudgeHost previews look sharp.",
    h1: "What is an og:image?",
    tldr: [
      "An og:image is the preview picture a chat app or social platform shows when your link is pasted in.",
      "It comes from an Open Graph tag in the page, a small piece of metadata browsers and apps read.",
      "A good preview makes a shared link far more likely to be clicked.",
    ],
    body: [
      "An og:image is part of the Open Graph protocol, a set of metadata tags that tell other apps how to present your link. When you paste a URL into Slack, iMessage, WhatsApp, or LinkedIn, the app fetches the page, reads its Open Graph tags, and builds the little card you see with a title, a description, and an image. The og:image is that picture. Without it, your link unfurls as a bare, forgettable line of text.",
      "This is quietly decisive for sharing, because the preview is the first thing the recipient sees before deciding whether to click. NudgeHost generates a sensible preview for hosted files so a link looks intentional rather than broken. When you {{host-pdf}} the preview reflects the document, and a designed page you share for something like the flow to {{use-case-deck}} carries a clean card into the client's inbox. A strong preview is the difference between a link that gets opened and one that gets ignored.",
      "If you control the page, you set the og:image with a single meta tag pointing at an image roughly 1200 by 630 pixels. For files hosted on NudgeHost the preview is handled for you. Hosting is free to start, and {{home}} is where you drop the file in. The practical point is that the preview is part of the message, not an afterthought.",
    ],
    faqs: [
      {
        question: "Why does my shared link have no preview image?",
        answer:
          "The page is missing an og:image tag, or the app has not refreshed its cached preview. Pages hosted on NudgeHost include a sensible preview by default.",
      },
      {
        question: "What size should an og:image be?",
        answer:
          "Around 1200 by 630 pixels works across Slack, iMessage, LinkedIn, and most platforms, which crop or scale to that ratio.",
      },
      {
        question: "Can I set a custom preview image?",
        answer:
          "On a page you build, yes, with a meta tag pointing at your image. Hosted files get an automatic preview based on the file.",
      },
    ],
    relatedTerms: ["seo", "qr-code", "mime-type"],
    relatedToolSlugs: ["host-pdf", "use-case-deck", "host-image", "host-html"],
  },

  "qr-code": {
    slug: "qr-code",
    term: "QR code",
    title: "What is a QR code? Turning a share link into a scan",
    metaDescription:
      "A QR code is a square barcode that encodes a URL so a phone camera can open it. Here is why NudgeHost puts one on every link for free.",
    h1: "What is a QR code?",
    tldr: [
      "A QR code is a square barcode that holds a URL, so pointing a phone camera at it opens the link.",
      "It bridges the physical and digital, so a code on a poster, a slide, or a printed handout opens your hosted file.",
      "NudgeHost generates one on every link, on the free plan, with nothing to set up.",
    ],
    body: [
      "A QR code is a two-dimensional barcode that encodes text, almost always a URL. A phone camera reads the pattern and offers to open the link, which removes the need to type an address by hand. That small convenience is why QR codes turn up on restaurant tables, conference badges, product packaging, and the last slide of a talk. Anywhere a link needs to jump from something physical to someone's phone, a QR code is the bridge.",
      "For shared files this matters more than it first appears. A printed wedding invitation can carry a code that opens the details page you set up when you {{use-case-wedding}}, and when you {{host-pdf|host a PDF}} for a poster, the code points straight at it without anyone squinting at a long URL. NudgeHost generates a QR code for every link automatically, and it does so on the free plan, where competitors typically gate this behind a paid tier. There is nothing to generate separately and no third-party tool to trust with your URL.",
      "Because the code simply points at your link, it inherits everything the link does. Update the file and the code keeps working, since the URL has not changed. Set the link to expire and the code expires with it. Hosting and the QR code are free, and {{pricing|a paid plan}} only enters the picture for things like custom domains. A QR code is the most direct way to hand someone a file without handing them a keyboard.",
    ],
    faqs: [
      {
        question: "Do I have to pay for the QR code?",
        answer:
          "No. NudgeHost includes a QR code on every link on the free plan. Many competitors only offer this on paid tiers.",
      },
      {
        question: "Does the QR code still work if I update the file?",
        answer:
          "Yes. The code points at your link, and the link does not change when you swap the file, so the code keeps resolving to the latest version.",
      },
      {
        question: "Can I print the QR code on a poster or invitation?",
        answer:
          "Yes. That is a common use. Download the code and place it anywhere physical, and a phone camera will open your hosted file.",
      },
    ],
    relatedTerms: ["og-image", "link-expiry", "custom-domain"],
    relatedToolSlugs: ["use-case-wedding", "host-pdf", "host-image", "use-case-deck"],
  },

  "file-compression": {
    slug: "file-compression",
    term: "File compression",
    title: "What is file compression? Why smaller files share faster",
    metaDescription:
      "File compression shrinks a file so it transfers faster and takes less space. Here is the difference between zipping, image formats, and gzip when you share.",
    h1: "What is file compression?",
    tldr: [
      "File compression shrinks a file by encoding it more efficiently, so it transfers faster and uses less storage.",
      "Some compression is lossless, like a ZIP, and some is lossy, like a JPEG, which trades a little quality for a lot of size.",
      "Smaller files upload faster, load faster for the recipient, and fit under size limits.",
    ],
    body: [
      "Compression rewrites a file so the same content takes fewer bytes. Lossless methods, like a ZIP archive or the gzip a server applies on the fly, pack the data so it can be restored exactly. Lossy methods, like JPEG for photos or H.264 for video, throw away detail the eye barely notices in exchange for a dramatic size cut. The right kind depends on the file. Text and code must stay lossless, while a photo can usually lose a little and look identical.",
      "For sharing, smaller is almost always better. A bundle of files packs into one compact archive that shares as a single download, and you can {{host-zip}} so a zipped site folder comes back out as a live site. A screenshot that is needlessly large shrinks hard when you {{converter-png-to-webp}}, often to a fraction of the original with no visible change, which means the page loads faster for everyone who opens it. The free plan covers files up to 25MB, so compressing first is sometimes the difference between fitting and not.",
      "Servers add another layer for free. Text-based files are typically gzip-compressed in transit, so an HTML page or a JSON file arrives smaller than it sits on disk without you doing anything. Where you have a say is the source file. Pick an efficient format, and the upload and every download afterwards is quicker. Hosting is free to start, and {{pricing|the Pro plan}} raises the ceiling when your files are genuinely large.",
    ],
    faqs: [
      {
        question: "Should I zip a file before uploading it?",
        answer:
          "Zip when you have several files to keep together, or to shrink something large. A bundle shares as one download, and a site folder serves as a live site. A single PDF or image usually does not need it.",
      },
      {
        question: "Will compressing an image ruin its quality?",
        answer:
          "Modern formats like WebP cut size with no visible loss at sensible settings. For pixel-exact needs, use a lossless option instead.",
      },
      {
        question: "Does NudgeHost compress my files automatically?",
        answer:
          "Text-based files are gzip-compressed in transit. For images and video, choosing an efficient format before upload gives the biggest gain.",
      },
    ],
    relatedTerms: ["bandwidth", "mime-type", "cache"],
    relatedToolSlugs: ["host-zip", "converter-png-to-webp", "host-image", "host-mp4"],
  },

  "mime-type": {
    slug: "mime-type",
    term: "MIME type",
    title: "What is a MIME type? Why a file opens or downloads",
    metaDescription:
      "A MIME type tells the browser what kind of file it is receiving, so it knows whether to display it or download it. Here is why that matters for shared links.",
    h1: "What is a MIME type?",
    tldr: [
      "A MIME type is a short label, like application/pdf or image/png, that tells the browser what kind of file it is getting.",
      "It decides whether the browser shows the file inline or downloads it.",
      "A wrong MIME type is why a file sometimes downloads when you expected it to open.",
    ],
    body: [
      "A MIME type, also called a content type, is the label a server attaches to a file so the browser knows how to handle it. application/pdf tells the browser to render a document, image/png tells it to show a picture, and text/html tells it to display a page. The browser does not guess from the file extension alone; it trusts this header. Get it right and the file behaves as expected. Get it wrong and a PDF might download as a mystery blob instead of opening.",
      "This is the mechanism behind whether a shared file opens in the browser or lands in the downloads folder. NudgeHost sets the correct MIME type for what you upload, so when you {{host-pdf|host a PDF}} the document opens inline and a recipient can {{viewer-pdf|read it in their browser}} without a download step. A page served as text/html renders, while a file the browser cannot display inline is offered as a download instead. The behaviour follows from the type, not from luck.",
      "Most people never touch this, which is the point. It should just work. It becomes visible only when a file misbehaves, and the usual cause is a host serving the wrong type. Hosting on NudgeHost is free to start and {{home}} is where you drop the file in. The short version is that the MIME type is the difference between view and download, and it is handled for you.",
    ],
    faqs: [
      {
        question: "Why does my file download instead of opening?",
        answer:
          "Either the browser cannot display that type inline, or the host served the wrong MIME type. NudgeHost sets the correct type so files that can open inline do.",
      },
      {
        question: "Can I force a file to download rather than open?",
        answer:
          "Yes. A download option is offered alongside inline viewing, and the link can present the file as a download when that is what you want.",
      },
      {
        question: "Is a MIME type the same as a file extension?",
        answer:
          "They are related but separate. The extension is part of the filename; the MIME type is the header the server sends, and the browser trusts the header.",
      },
    ],
    relatedTerms: ["file-compression", "cors", "static-site"],
    relatedToolSlugs: ["host-pdf", "viewer-pdf", "host-image", "viewer-docx"],
  },

  "ssl-certificate": {
    slug: "ssl-certificate",
    term: "SSL certificate",
    title: "What is an SSL certificate? The padlock behind secure links",
    metaDescription:
      "An SSL certificate proves a site owns its domain and enables the encryption behind HTTPS. Here is why NudgeHost provisions one for every link automatically.",
    h1: "What is an SSL certificate?",
    tldr: [
      "An SSL certificate is a small credential that proves a site controls its domain and enables HTTPS encryption.",
      "It is what lets the browser show a padlock instead of a not-secure warning.",
      "On NudgeHost it is issued and renewed for you, including on custom domains.",
    ],
    body: [
      "An SSL certificate, more precisely a TLS certificate, does two jobs. It vouches that the server really controls the domain it claims, and it carries the keys that let the browser and server set up an encrypted connection. Together those enable {{glossary-https|HTTPS}}, the secure version of the web. When a browser shows a padlock, it has checked a valid certificate for that exact domain and negotiated encryption with it. A missing or mismatched certificate is what triggers the alarming warning pages people learn to fear.",
      "Historically, getting a certificate meant buying one, proving ownership by hand, and remembering to renew it before it lapsed, which it always seemed to do at the worst moment. NudgeHost removes all of that. Every link is served with a valid certificate, so when you {{host-pdf|host a PDF}} the transfer is encrypted end to end with no setup, and the same is true the moment you add a custom domain. The certificate is the quiet thing that makes HTTPS possible in the first place.",
      "Renewal is automatic, which matters because an expired certificate breaks a link as surely as a deleted file would. Hosting is free to start, and {{pricing|a paid plan}} adds custom domains that carry the same automatic certificate onto your own address. For someone sharing a file, the certificate is invisible, and that is the goal. It is secure by default, with nothing to buy or babysit.",
    ],
    faqs: [
      {
        question: "Do I need to buy or renew an SSL certificate?",
        answer:
          "No. NudgeHost issues and renews certificates automatically for every link, including custom domains, so they never lapse.",
      },
      {
        question: "What is the difference between SSL and TLS?",
        answer:
          "TLS is the modern version of the protocol, but the term SSL stuck in common use. When people say SSL certificate today they almost always mean a TLS certificate.",
      },
      {
        question: "Why did a link show a certificate warning elsewhere?",
        answer:
          "That happens when a certificate is missing, expired, or does not match the domain. NudgeHost links are served with a valid, current certificate to avoid this.",
      },
    ],
    relatedTerms: ["https", "custom-domain", "dns"],
    relatedToolSlugs: ["host-pdf", "host-html", "use-case-deck", "viewer-pdf"],
  },

  bandwidth: {
    slug: "bandwidth",
    term: "Bandwidth",
    title: "What is bandwidth? Why visitor caps punish a popular link",
    metaDescription:
      "Bandwidth is the amount of data transferred when people open your files. Here is why visitor caps hurt and why NudgeHost does not impose them.",
    h1: "What is bandwidth?",
    tldr: [
      "Bandwidth is the total data transferred as people download or view your hosted files.",
      "A big file opened by many people uses more bandwidth than a small file opened by a few.",
      "Some hosts cap visitors or bandwidth, which cuts off a link exactly when it gets popular.",
    ],
    body: [
      "Bandwidth is the volume of data that moves when people open your files. Every view or download sends the file across the network, and the sum of all those transfers is your bandwidth use. A one-page PDF opened a handful of times is trivial. A video opened thousands of times is not, because each play streams the bytes again. Bandwidth is simply the running total of all that traffic.",
      "This is where some hosts quietly punish success. They set a visitor cap or a bandwidth limit, and a link that gets shared widely hits the ceiling and stops serving, often at the precise moment it is working. NudgeHost does not impose visitor caps, so a link that takes off keeps resolving for everyone who clicks it. The cost of serving is kept low by {{glossary-cdn|a content delivery network}}, which spreads the load across many servers rather than hammering one.",
      "Large media is where to be thoughtful. When you {{host-mp4}}, each view uses far more bandwidth than a document does. Choosing an efficient format keeps each view light. Hosting is free to start, and {{pricing|the Pro plan}} raises the file-size ceiling for genuinely big files, without bolting on the visitor caps that make a viral share backfire. The principle is that getting opened a lot should be a good day, not a billing surprise.",
    ],
    faqs: [
      {
        question: "Does NudgeHost cap how many people can open my link?",
        answer:
          "No. There are no visitor caps, so a link that gets shared widely keeps working for everyone who clicks it.",
      },
      {
        question: "What uses the most bandwidth?",
        answer:
          "Large media opened many times. A video streams its bytes on every play, so it uses far more than a small document viewed occasionally.",
      },
      {
        question: "How do I keep bandwidth use down?",
        answer:
          "Use efficient formats and compress large files before uploading. A smaller file transfers less data on every single view.",
      },
    ],
    relatedTerms: ["cdn", "file-compression", "cache"],
    relatedToolSlugs: ["host-mp4", "host-image", "host-zip", "host-pdf"],
  },

  "drag-and-drop": {
    slug: "drag-and-drop",
    term: "Drag and drop",
    title: "What is drag and drop? The upload pattern that replaced FTP",
    metaDescription:
      "Drag and drop lets you upload a file by dragging it onto the page. Here is why it replaced FTP for sharing and how NudgeHost uses it.",
    h1: "What is drag and drop?",
    tldr: [
      "Drag and drop is the pattern where you upload a file by dragging it from your desktop onto a web page.",
      "It removes the setup that older methods like FTP required: no client, no server address, no credentials.",
      "It is the fastest path from a file on your machine to a shareable link.",
    ],
    body: [
      "Drag and drop is the interaction where you pick up a file in your file manager and drop it onto a browser window, which uploads it. The browser exposes the file to the page, the page sends it to storage, and you get a result back. It feels obvious now, but it replaced a genuinely tedious era of uploading through dedicated apps and remembering where files had to go on a remote server.",
      "NudgeHost is built around it. You {{home}} by dropping a file onto the uploader, and a clean link comes back in seconds, which is the whole point of the product compared to the old {{glossary-ftp|FTP}} workflow it stands in for. There is no client to install and nothing to configure. On a phone the same control falls back to tap-to-browse, so the pattern works whether you are at a desk or sharing something from the train.",
      "The reason this matters beyond convenience is that it removes the failure points. There is no wrong directory to drop a file into and no credential to fumble, so the path from file to link is short and hard to get wrong. Hosting is free to start, and {{pricing|a paid plan}} raises the limits when you need them. Drag and drop is not a flourish here; it is the entire upload model.",
    ],
    faqs: [
      {
        question: "Does drag and drop work on a phone?",
        answer:
          "Yes. On touch devices the uploader falls back to tap-to-browse, so you can pick a file from your phone just as easily.",
      },
      {
        question: "Can I drop more than one file at once?",
        answer:
          "For a multi-file project, zip the files and drop the archive. NudgeHost can serve the contents as a small site.",
      },
      {
        question: "Is there a size limit on a dropped file?",
        answer:
          "The free plan handles files up to 25MB. Paid plans raise that ceiling for larger uploads.",
      },
    ],
    relatedTerms: ["ftp", "presigned-url", "static-site"],
    relatedToolSlugs: ["host-pdf", "host-html", "host-zip", "host-image"],
  },

  "presigned-url": {
    slug: "presigned-url",
    term: "Presigned URL",
    title: "What is a presigned URL? How cloud file sharing works",
    metaDescription:
      "A presigned URL is a temporary, signed link that grants limited access to a file in cloud storage. Here is how it keeps shared files secure under the hood.",
    h1: "What is a presigned URL?",
    tldr: [
      "A presigned URL is a temporary link, cryptographically signed, that grants access to a specific file in cloud storage for a limited time.",
      "It lets a private bucket serve a file without being made public.",
      "It is part of how a modern host shares files securely without exposing your whole storage.",
    ],
    body: [
      "A presigned URL is a link that carries its own permission. Cloud storage like Cloudflare R2 or Amazon S3 keeps files in private buckets that are not openable by default. To let someone access one file, the system generates a URL signed with a secret key and stamped with an expiry. Anyone holding that URL can fetch that one file until it expires, and nothing else. It is a way to grant narrow, temporary access without ever making the bucket public.",
      "This is the quiet plumbing behind secure sharing. When you {{host-pdf}}, the file sits in private storage, and access is handed out through signed URLs rather than by leaving the whole bucket open to the world. The signature means the link cannot be forged, and the expiry means a leaked link does not grant access forever. It is the same mechanism large platforms use to serve private uploads safely.",
      "For you none of this is visible, which is the goal. You get a clean, friendly link, while the signing and expiry happen underneath. The concept connects directly to {{glossary-link-expiry}}, where you choose how long access lasts. Hosting is free to start and {{pricing|the paid tier}} covers higher limits. The takeaway is that a good host shares files without ever exposing the storage they live in.",
    ],
    faqs: [
      {
        question: "Is the share link I get a presigned URL?",
        answer:
          "Your friendly nudgehost.com link sits in front of the storage. Access to the underlying file is granted through signed, expiring URLs so the storage stays private.",
      },
      {
        question: "Why not just make the storage public?",
        answer:
          "A public bucket exposes everything in it. Signed URLs grant access to one file at a time for a limited window, which is far safer.",
      },
      {
        question: "Does the signature stop someone guessing my link?",
        answer:
          "The cryptographic signature cannot be forged, so a URL cannot be fabricated. Combined with expiry, that keeps access tightly scoped.",
      },
    ],
    relatedTerms: ["link-expiry", "https", "cors"],
    relatedToolSlugs: ["host-pdf", "host-zip", "host-image", "viewer-pdf"],
  },

  "link-expiry": {
    slug: "link-expiry",
    term: "Link expiry",
    title: "What is link expiry? Self-destructing links for sensitive files",
    metaDescription:
      "Link expiry makes a share link stop working after a date you choose. Here is why self-destructing links matter for contracts, NDAs, and private documents.",
    h1: "What is link expiry?",
    tldr: [
      "Link expiry sets a share link to stop working after a date or time you choose.",
      "After it expires, the file is no longer reachable through that link.",
      "It is the clean way to share something sensitive without it living online forever.",
    ],
    body: [
      "Link expiry is a setting that gives a share link a lifespan. You pick a date, and after it passes the link stops serving the file and shows a clear expired message instead. It turns a permanent share into a temporary one, which is exactly what you want for anything that should not linger online. A link that works forever is convenient for a portfolio and a liability for a contract.",
      "The sensitive-document case is where this earns its place. A sales agreement, an NDA, a medical form, or a financial statement should be openable for as long as the deal is live and not a day longer. Set an expiry and the link closes itself, so you do not have to remember to delete it. This pairs naturally with {{glossary-password-protection}} when you want both a lock and a deadline, and it is useful even for everyday sharing like the flow to {{use-case-large-pdf}}, where you may want a big file to stop being reachable after the recipient has it.",
      "Under the hood this builds on signed, time-limited access, so expiry is enforced rather than cosmetic. You can also just delete a link at any time, which revokes access immediately. Hosting is free to start, and {{pricing|the paid tier}} carries the controls you need across more files. The point of expiry is control after sending. The share ends on your schedule, not whenever you happen to remember it.",
    ],
    faqs: [
      {
        question: "What does a recipient see after a link expires?",
        answer:
          "A clear message that the file is no longer available, not a confusing error. The file itself is no longer reachable through that link.",
      },
      {
        question: "Can I combine expiry with a password?",
        answer:
          "Yes. You can set both, so a link needs the password to open and also stops working after the date you choose.",
      },
      {
        question: "Can I end access before the expiry date?",
        answer:
          "Yes. Delete the link at any time and access is revoked immediately, regardless of the expiry you set.",
      },
    ],
    relatedTerms: ["password-protection", "presigned-url", "404-error"],
    relatedToolSlugs: ["use-case-large-pdf", "host-pdf", "use-case-deck", "viewer-pdf"],
  },

  "password-protection": {
    slug: "password-protection",
    term: "Password protection",
    title: "What is password protection? Access control for shared files",
    metaDescription:
      "Password protection requires a password before a shared file will open. Here is when to use it and how NudgeHost adds it to any link.",
    h1: "What is password protection?",
    tldr: [
      "Password protection puts a password in front of a shared link, so only people who know it can open the file.",
      "The link looks normal; the file stays hidden until the right password is entered.",
      "It is the simplest way to keep a shared document from being opened by whoever finds the URL.",
    ],
    body: [
      "Password protection adds a gate to a share link. Anyone who opens the URL sees a prompt rather than the file, and only the correct password lets them through. The link itself can be pasted anywhere safely, because the contents stay sealed until someone proves they are meant to see them. It is access control reduced to its simplest useful form, one secret shared with the people who should have it.",
      "This is the right tool when a link might travel further than you intend. A pricing proposal, a draft you {{use-case-deck}}, or a document with personal details should not be openable by anyone who happens to receive a forwarded message. A password means the URL leaking does not mean the file leaking. It pairs well with {{glossary-link-expiry}} when you want both a lock and a deadline, so access is limited to the right people and the right window.",
      "On NudgeHost you can {{features-password-protection}}, and the password is stored only as a secure hash, never as plain text, so entering the right one quietly opens the file for that visitor. Hosting is free to start, and {{pricing|the Pro plan}} carries the access controls across your files. The honest framing is that password protection is not heavy security for state secrets; it is the practical lock that stops an ordinary shared link from being opened by the wrong person.",
    ],
    faqs: [
      {
        question: "Where is my password stored?",
        answer:
          "Only as a secure hash, never as readable text. The file opens when a visitor enters a password that matches the hash.",
      },
      {
        question: "Can I protect any file type?",
        answer:
          "Yes. Password protection sits in front of the link, so it works the same for a PDF, an image, an HTML page, or any other file.",
      },
      {
        question: "What if I forget the password I set?",
        answer:
          "You can change or remove it from your dashboard at any time, which updates what visitors need to enter.",
      },
    ],
    relatedTerms: ["link-expiry", "https", "presigned-url"],
    relatedToolSlugs: ["use-case-deck", "host-pdf", "viewer-pdf", "use-case-large-pdf"],
  },

  "custom-domain": {
    slug: "custom-domain",
    term: "Custom domain",
    title: "What is a custom domain? Branded share links explained",
    metaDescription:
      "A custom domain lets share links use your own address instead of the default. Here is what it takes to set one up and why it matters for client-facing links.",
    h1: "What is a custom domain?",
    tldr: [
      "A custom domain means your share links use your own address, like files.yoursite.com, instead of the default nudgehost.com.",
      "You set it up by pointing a DNS record at the host.",
      "It matters most when the link is client-facing and you want it to look like you.",
    ],
    body: [
      "A custom domain replaces the host's address in your links with one you own. Instead of a nudgehost.com URL, the file lives at something like files.yourstudio.com, which reads as part of your brand rather than a third party's. The file and everything around it are identical; only the address changes. For a personal share this is cosmetic, but for anything client-facing the address is part of the impression you make.",
      "Setting one up is a DNS task, not a technical ordeal. You add a record at your registrar pointing your domain or a subdomain at NudgeHost, and once it resolves your links use your address, with the securing certificate issued automatically. You can {{features-custom-domains}} on a paid tier, so {{pricing|the pricing page}} is where it starts, and the hosting underneath is the same as any page you would {{host-html}}. The work is one record and a short wait for it to propagate.",
      "The payoff is trust and consistency. A recruiter or client who sees your own domain on a link to {{use-case-recruiter}} reads it as more established than a generic URL, and your links stop advertising someone else's brand. The certificate keeps the connection secure on your domain just as it does on the default. A custom domain is the step from sharing files to sharing them under your own name.",
    ],
    faqs: [
      {
        question: "Is a custom domain free?",
        answer:
          "It is part of a paid plan. The standard nudgehost.com link is free; using your own address is an upgrade.",
      },
      {
        question: "How do I connect my domain?",
        answer:
          "Add the DNS record shown in your dashboard at your registrar, pointing your domain or subdomain at NudgeHost, then wait for it to propagate.",
      },
      {
        question: "Will my custom domain links still be secure?",
        answer:
          "Yes. A certificate is issued automatically for your domain, so links stay HTTPS without any setup from you.",
      },
    ],
    relatedTerms: ["dns", "ssl-certificate", "https"],
    relatedToolSlugs: ["use-case-recruiter", "host-html", "host-portfolio", "host-pdf"],
  },
};
