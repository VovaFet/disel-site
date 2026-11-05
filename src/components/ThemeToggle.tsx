"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { t } from "@/i18n";
import { isTheme, themeKey } from "@/lib/theme";
import { useLive } from "./LiveConfig";

const darkQuery = "(prefers-color-scheme: dark)";

function savedTheme() {
  try {
    const v = localStorage.getItem(themeKey);
    return isTheme(v) ? v : null;
  } catch {
    return null; // storage blocked: the theme just isn't remembered
  }
}

// The theme in effect: the saved choice, otherwise the system one
const isDark = () => (document.documentElement.dataset.theme ?? (matchMedia(darkQuery).matches ? "dark" : "light")) === "dark";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  const system = matchMedia(darkQuery);
  system.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    system.removeEventListener("change", onChange);
  };
}

// A switch: on = dark theme. CSS places the knob and picks its sun or moon icon, so the static
// HTML doesn't need to know the theme; aria-checked follows once the page has hydrated.
// The choice is saved and applied before paint by themeScript.
export function ThemeToggle() {
  const { lang } = useLive();
  const dark = useSyncExternalStore(subscribe, isDark, () => null);

  // Re-apply after React's dev Strict Mode remount clears the attribute; a no-op in production
  useLayoutEffect(() => {
    const saved = savedTheme();
    if (saved) document.documentElement.dataset.theme = saved;
  }, []);

  const toggle = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(themeKey, next);
    } catch {
      // storage blocked: the choice lasts until the next page load
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark ?? undefined}
      className="theme-toggle"
      aria-label={t(lang).themeToggle}
      title={t(lang).themeToggle}
      onClick={toggle}
    >
      <span className="theme-knob" aria-hidden>
        <svg className="icon-sun" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.5" stroke="none" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" fill="none" />
        </svg>
        <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
