import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  images: { qualities: [75] },
};

export default nextConfig;
