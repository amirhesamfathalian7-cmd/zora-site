import type { NextConfig } from "next";

// CF_EXPORT=1 -> static export for Cloudflare Pages (no Node server, no API routes).
// Default     -> standalone Node server (sandbox/dev mode with live API).
const isCfExport = process.env.CF_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isCfExport
    ? { output: "export" as const, images: { unoptimized: true } }
    : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
