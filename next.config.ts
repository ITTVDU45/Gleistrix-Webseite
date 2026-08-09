import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Modulbilder gehen als Server Action hoch; der Standard von 1 MB wäre für
    // ein Screenshot-PNG zu knapp. Die Prüfung auf 4 MB steckt in assets.ts.
    serverActions: { bodySizeLimit: "5mb" },
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
