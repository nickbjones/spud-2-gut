import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/recipes',
        permanent: true, // Use false for a temporary redirect (307)
      },
    ];
  },
};

export default nextConfig;
