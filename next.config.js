/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,  // Disable Image Optimization for static exports
  },
};

module.exports = nextConfig;
