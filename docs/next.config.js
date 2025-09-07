/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true, // Smooth transitions without full reloads
  },
};

module.exports = nextConfig;