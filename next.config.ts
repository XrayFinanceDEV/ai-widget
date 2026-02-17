import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Allow iframe embedding of /widget from brix-ia.com and kpsfinanciallab.w3pro.it
      {
        source: '/widget',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://brix-ia.com https://*.brix-ia.com https://kpsfinanciallab.w3pro.it" },
        ],
      },
      // CORS for API routes - allow both domains
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://brix-ia.com, https://kpsfinanciallab.w3pro.it' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Cookie' },
        ],
      },
      // embed.js accessible from anywhere
      {
        source: '/embed.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
    ]
  },
};

export default nextConfig;
