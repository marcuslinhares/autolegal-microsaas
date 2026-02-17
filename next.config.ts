import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desativa explicitamente o modo standalone que está quebrando o CI
  output: undefined, 
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
  // @ts-ignore
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
