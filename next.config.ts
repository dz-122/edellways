import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "z3r21j6j-3000.asse.devtunnels.ms",
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  
   async redirects() {
    return [
      { source: "/koleksi/:slug", destination: "/koleksi?koleksi=:slug", permanent: true },
      { source: "/acara/:slug", destination: "/koleksi?acara=:slug", permanent: true },
    ];
  },

  serverExternalPackages: ["exceljs"],

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;