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

module.exports = nextConfig;
