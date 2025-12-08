import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: process.env.NODE_ENV === 'production' ? 'dist' : '.next',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

