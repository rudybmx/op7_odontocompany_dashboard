import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Todas as env vars sao injetadas em runtime via Docker/pod — NAO bake em build
  serverExternalPackages: ['postgres'],
}

export default nextConfig;
