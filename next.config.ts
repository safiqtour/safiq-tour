import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Locally uploaded files served by the app itself (e.g. /uploads/...).
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Image/file uploads via Server Actions exceed the default 1 MB body limit.
      bodySizeLimit: "10mb",
    },
  },
  serverExternalPackages: ["@react-pdf/renderer", "@react-pdf/reconciler"],
  transpilePackages: ["@react-pdf/font", "@react-pdf/layout", "@react-pdf/pdfkit", "@react-pdf/primitives", "@react-pdf/render", "@react-pdf/stylesheet"],
};

export default nextConfig;
