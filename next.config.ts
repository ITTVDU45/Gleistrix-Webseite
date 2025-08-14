import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
  eslint: {
    // Don't block production builds on lint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't block production builds on type errors
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
