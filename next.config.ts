import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["14.225.205.26", "static01.nyt.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
