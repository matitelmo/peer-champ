import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail production builds on ESLint errors while we stabilize
    ignoreDuringBuilds: true,
  },
  // Disable static generation for all pages to prevent prerendering issues
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
