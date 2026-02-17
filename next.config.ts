import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', 
  typescript: {
    // @ts-ignore
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
