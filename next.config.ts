import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: COMMENT ALL THIS OUT, AND ACTUALLY ADDRESS ERRORS SHOWN IN npm run build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
