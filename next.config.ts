import type { NextConfig } from "next";

// Static export: `next build` produces plain HTML in ./out for any static host
// (Cloudflare Pages, Netlify, Vercel, regular hosting).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Each language has its own root layout, so the 404 page (out/404.html) comes from
  // app/global-not-found.tsx instead of a not-found.tsx inside a layout.
  experimental: { globalNotFound: true },
};

export default nextConfig;
