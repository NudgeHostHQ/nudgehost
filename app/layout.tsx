import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nudgehost.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NudgeHost: share any file as a link in seconds",
    template: "%s | NudgeHost",
  },
  description:
    "Drop a file, get a shareable link. The friendliest way to host PDFs, HTML, ZIPs, images, AI-generated outputs. Free forever plan with 25MB uploads.",
  keywords: [
    "file sharing",
    "pdf to link",
    "host html file",
    "share files online",
    "shareable links",
    "free file hosting",
    "claude artifact hosting",
  ],
  authors: [{ name: "NudgeHost" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "NudgeHost",
    title: "NudgeHost: share any file as a link in seconds",
    description:
      "Drop a file, get a shareable link. The friendliest way to share PDFs, HTML, ZIPs and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NudgeHost: give your files a nudge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NudgeHost: share any file as a link in seconds",
    description: "Drop a file, get a shareable link.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-sans">
        {/* Organization JSON-LD — appears on every page, sitewide entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NudgeHost",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              sameAs: [],
              description:
                "Share any file as a link. PDFs, HTML, ZIPs, images and AI-generated outputs.",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
