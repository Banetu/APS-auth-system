import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostgreSQL pg モジュールの Vercel バンドリング設定
  serverExternalPackages: ['pg'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  turbopack: {},
};

export default nextConfig;
