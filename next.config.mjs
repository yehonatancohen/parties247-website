/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true
  },
  i18n: {
    locales: ["he"],
    defaultLocale: "he"
  }
};

export default nextConfig;
