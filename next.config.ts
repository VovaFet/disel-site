import type { NextConfig } from "next";

// Static export: `next build` produces plain HTML in ./out for any static host
// (Cloudflare Pages, Netlify, Vercel, regular hosting).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
