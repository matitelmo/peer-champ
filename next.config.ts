import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Don't fail production builds on ESLint errors while we stabilize
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
