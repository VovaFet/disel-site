import { useSyncExternalStore } from "react";
import { defaultLocale, type Locale } from "@/config/types";
import { isLocale } from "@/i18n";

const fromAddress = (): Locale => {
  const first = window.location.pathname.split("/")[1] ?? "";
  return isLocale(first) ? first : defaultLocale;
};

// Language from the address bar. Only for the 404 page: the host serves one static
// 404.html for every unknown URL, so its HTML is Ukrainian and the browser corrects it.
export const usePathLocale = () => useSyncExternalStore(() => () => {}, fromAddress, () => defaultLocale);
