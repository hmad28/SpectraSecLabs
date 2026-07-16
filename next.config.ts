import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  images: {
    qualities: [75],
    remotePatterns: [
      { protocol: "https", hostname: "blvuo7dgop.ufs.sh" },
    ],
  },
};

export default nextConfig;

