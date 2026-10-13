// Next.js build adapter (adapterPath in next.config.ts). It runs inside `next build` after out/
// is written, so it works whatever the host's build command is. It copies each language's 404
// page (out/ru/404/index.html, out/en/404/index.html) to out/<lang>/404.html: Cloudflare serves
// the nearest 404.html, so a missing /ru/... page gets the Russian 404 with the Russian header.
// The root 404.html (app/global-not-found.tsx) stays the Ukrainian one.
import fs from "node:fs";
import path from "node:path";

const adapter = {
  name: "localized-404",
  onBuildComplete({ projectDir }) {
    const out = path.join(projectDir, "out");
    if (!fs.existsSync(out)) return;
    for (const dir of fs.readdirSync(out, { withFileTypes: true })) {
      const page = path.join(out, dir.name, "404", "index.html");
      if (dir.isDirectory() && fs.existsSync(page)) fs.copyFileSync(page, path.join(out, dir.name, "404.html"));
    }
  },
};

export default adapter;
