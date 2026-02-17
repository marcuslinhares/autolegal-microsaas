import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desativa explicitamente o modo standalone que está quebrando o CI
  output: undefined, 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
