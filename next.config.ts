import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cacheComponents: true,
  serverExternalPackages: ["@prisma/client", "pg"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
