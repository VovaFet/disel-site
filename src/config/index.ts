import { defaultConfig } from "./default";
import { loadSiteConfig } from "./sheet";
import type { SiteConfig } from "./types";

export const sheetId = process.env.NEXT_PUBLIC_SHEET_ID ?? "";

let cached: Promise<SiteConfig> | undefined;

// Build-time config: from the Google Sheet when NEXT_PUBLIC_SHEET_ID is set,
// otherwise (or on error) from the bundled defaults, so the build never breaks.
export function getConfig(): Promise<SiteConfig> {
  cached ??= sheetId
    ? loadSiteConfig(sheetId).catch((e: unknown) => {
        console.warn(`[config] Google Sheet unavailable, using defaults: ${String(e)}`);
        return defaultConfig;
      })
    : Promise.resolve(defaultConfig);
  return cached;
}
