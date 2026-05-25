const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Trailing slash off — cleaner canonical URLs
  trailingSlash: false,
};

// Source map upload is skipped (no SENTRY_AUTH_TOKEN). silent + disableLogger
// keep the build output and client bundle quiet.
module.exports = withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
});
