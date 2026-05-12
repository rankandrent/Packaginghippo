import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'oxopackaging.com',
      },
      {
        protocol: 'https',
        hostname: 'postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.myboxprinting.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      }
    ],
  },
  async redirects() {
    return [
      // www → non-www (301 permanent) — handles both http and https
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.packaginghippo.com' }],
        destination: 'https://packaginghippo.com/:path*',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'https://res.cloudinary.com/da9culaxt/image/upload/:path*',
      },
      {
        source: '/assets/:path*',
        destination: 'https://res.cloudinary.com/da9culaxt/image/upload/:path*',
      },
    ]
  },
};

export default nextConfig;
