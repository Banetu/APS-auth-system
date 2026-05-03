import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // ホストマシンから WebSocket HMR にアクセスできるように許可
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  
  // PostgreSQL pg モジュールの Vercel バンドリング設定
  // Turbopack で pg ライブラリを外部モジュールとして扱う
  serverExternalPackages: ['pg'],
};

export default nextConfig;
