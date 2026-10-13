import type { NextConfig } from "next";

// Static export: `next build` produces plain HTML in ./out for any static host
// (Cloudflare Pages, Netlify, Vercel, regular hosting).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // After the build: out/ru/404/index.html → out/ru/404.html (and en), see the adapter
  adapterPath: require.resolve("./scripts/localized-404-adapter.mjs"),
  // New on every build: the build-time sheet requests carry it, so `next build` never reuses
  // sheet data that a previous build left in .next/cache (CI may keep that folder)
  env: { SHEET_BUILD_STAMP: String(Date.now()) },
  // Each language has its own root layout, so the 404 page (out/404.html) comes from
  // app/global-not-found.tsx instead of a not-found.tsx inside a layout.
  experimental: {
    globalNotFound: true,
    // Fewer build workers: each one reads every sheet tab, and with ~15 of them at once Google
    // answers many requests with 429 (they are retried, but there is no need to provoke it)
    cpus: 4,
  },
};

export default nextConfig;
