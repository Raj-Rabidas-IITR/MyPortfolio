import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
   images: {
    domains: ['res.cloudinary.com'], // ✅ allow Cloudinary
  },
};

export default nextConfig;
