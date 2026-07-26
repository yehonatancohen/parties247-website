/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Configure Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net', // The wildcard * allows any subdomain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // You were using Unsplash in your examples too
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com', // Common if you use Vercel Blob
      },
      // Add other domains here if needed (e.g., pngimg.com from your HTML dump)
      {
        protocol: 'https',
        hostname: 'pngimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'images.go-out.co',
      }
    ],
    qualities: [25, 40, 50, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920]
  },

  // 2. Redirect legacy duplicate club pages to the canonical /club/[slug] pages
  async redirects() {
    return [
      {
        source: '/jimmy-who',
        destination: '/club/jimmy-who',
        permanent: true,
      },
      {
        source: '/moon-child',
        destination: '/club/moon-child',
        permanent: true,
      },
      // The admin dashboard moved to its own app/subdomain so it stops
      // polluting this site's analytics (GTM/GA/Clarity).
      {
        source: '/admin',
        destination: 'https://admin.parties247.co.il/',
        permanent: true,
      },
      {
        source: '/admin/analytics',
        destination: 'https://admin.parties247.co.il/analytics',
        permanent: true,
      },
      {
        source: '/admin/audit-log',
        destination: 'https://admin.parties247.co.il/audit-log',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: 'https://admin.parties247.co.il/',
        permanent: true,
      },
    ];
  },

  // 3. Configure Hebrew URL Rewrites
  async rewrites() {
    return [
      {
        source: '/כתבות',
        destination: '/articles',
      },
      {
        source: '/כתבות/:slug',
        destination: '/articles/:slug',
      },
    ];
  },
};

export default nextConfig;