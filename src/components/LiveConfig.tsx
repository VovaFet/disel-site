"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadLiveConfig } from "@/config/sheet";
import type { Locale, LiveConfig } from "@/config/types";

type Ctx = { live: LiveConfig; lang: Locale };
const LiveContext = createContext<Ctx | null>(null);

// Starts from the build-time values (already in the HTML), then refreshes prices,
// contacts and hours from the Google Sheet so edits show up without a rebuild.
export function LiveConfigProvider({
  initial,
  lang,
  sheetId,
  children,
}: {
  initial: LiveConfig;
  lang: Locale;
  sheetId: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(initial);

  useEffect(() => {
    if (!sheetId) return;
    let cancelled = false;
    loadLiveConfig(sheetId, initial)
      .then((fresh) => !cancelled && setLive(fresh))
      .catch(() => {}); // keep build-time values on network errors
    return () => {
      cancelled = true;
    };
  }, [sheetId, initial]);

  return <LiveContext.Provider value={{ live, lang }}>{children}</LiveContext.Provider>;
}

export function useLive() {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside LiveConfigProvider");
  return ctx;
}
