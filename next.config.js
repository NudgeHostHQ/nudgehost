const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Native/heavy modules used only at runtime by thumbnail generation. Keeping
  // them external means their binaries load from node_modules instead of being
  // bundled (which would break the prebuilt .node files and font data).
  serverExternalPackages: ["sharp", "@napi-rs/canvas", "pdfjs-dist"],
  // Trailing slash off — cleaner canonical URLs
  trailingSlash: false,
};

// Source map upload is skipped (no SENTRY_AUTH_TOKEN). silent + disableLogger
// keep the build output and client bundle quiet.
module.exports = withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
});
