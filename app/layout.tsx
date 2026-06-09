import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nudgehost.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Share any file as a link in seconds | NudgeHost",
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
    siteName: "NudgeHost",
    title: "Share any file as a link in seconds | NudgeHost",
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
    title: "Share any file as a link in seconds | NudgeHost",
    description: "Drop a file, get a shareable link.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "NudgeHost: give your files a nudge",
      },
    ],
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
  verification: {
    google: "-UTVuppyqJ14tFkIqvNbxZfC6XO57gf2tAYx1k_qlbQ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
        <body className="font-sans">
          {/* Google Analytics (GA4). afterInteractive keeps it off the
              critical path so it doesn't hurt Core Web Vitals. */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-1KQB3G2M0"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-1KQB3G2M0');
  `}
          </Script>
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
    </ClerkProvider>
  );
}
