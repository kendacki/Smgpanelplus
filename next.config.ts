import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db", "./prisma/schema.prisma"],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
