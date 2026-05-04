import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostgreSQL pg モジュールの Vercel バンドリング設定
  serverExternalPackages: ['pg'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
