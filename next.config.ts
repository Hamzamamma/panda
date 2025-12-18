import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@medusajs/medusa-js", "retry-axios"],
};

export default nextConfig;