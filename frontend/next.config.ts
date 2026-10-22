import type { NextConfig } from "next";

const isPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  ...(isPages ? {
    output: 'export',
    basePath: '/savour-delivery',
    trailingSlash: true,
    images: { unoptimized: true },
  } : { cacheComponents: true, partialPrefetching: true }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
