import { defaultConfig } from "./default";
import { loadSiteConfig } from "./sheet";
import type { SiteConfig } from "./types";

export const sheetId = process.env.NEXT_PUBLIC_SHEET_ID ?? "";

let cached: Promise<SiteConfig> | undefined;

// Build-time config: from the Google Sheet when NEXT_PUBLIC_SHEET_ID is set, otherwise from the
// bundled defaults. If the sheet is set but can't be read, a build fails rather than publish pages
// with placeholder data (the host keeps the previous version online); `next dev` falls back.
export function getConfig(): Promise<SiteConfig> {
  cached ??= sheetId
    ? loadSiteConfig(sheetId).then(
        (c) => {
          console.info("[config] Loaded from the Google Sheet");
          return c;
        },
        (e: unknown) => {
          if (process.env.NODE_ENV === "production") throw new Error(`[config] Google Sheet unavailable: ${String(e)}`);
          console.warn(`[config] Google Sheet unavailable, using defaults: ${String(e)}`);
          return defaultConfig;
        },
      )
    : Promise.resolve(defaultConfig);
  return cached;
}
