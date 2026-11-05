"use client";

import { useEffect, useSyncExternalStore } from "react";
import { readConsent, subscribeConsent } from "@/lib/consent";

// Google Analytics 4 and Google Ads (settings → gaId, adsId) in one Google tag. It loads only after the
// visitor accepts cookies in the banner, so without consent nothing is sent to Google and the page loads
// no extra script; declining later turns the tags off and deletes their cookies. Only on the site's own
// domain: previews and local builds show the banner but never add to the real statistics.
//
// Analytics counts page views itself, client-side navigation included (enhanced measurement). Clicks on
// the phone and messenger links are sent as the "contact" event (method: phone | telegram | viber); in
// Analytics it is a key event, imported into Ads as the conversion.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const consent = (v: "granted" | "denied") => ({
  ad_storage: v,
  ad_user_data: v,
  ad_personalization: v,
  analytics_storage: v,
});

function grant(ids: string[]) {
  // "ga-disable-<id>" is Google's own off switch for a tag, set when the visitor declines
  for (const id of ids) Reflect.deleteProperty(window, `ga-disable-${id}`);
  if (window.gtag) {
    window.gtag("consent", "update", consent("granted"));
    return;
  }
  const dataLayer = (window.dataLayer ??= []);
  window.gtag = function () {
    // gtag.js reads the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag("consent", "default", consent("granted"));
  window.gtag("js", new Date());
  for (const id of ids) window.gtag("config", id);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;
  document.head.append(script);
}

function revoke(ids: string[]) {
  if (!window.gtag) return;
  window.gtag("consent", "update", consent("denied"));
  for (const id of ids) Reflect.set(window, `ga-disable-${id}`, true);
  // Google's cookies (_ga, _ga_<id>, _gcl_au…) sit on the widest domain the browser allows, so every
  // parent domain is tried
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^_g(a|cl)(_|$)/.test(n));
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, i) => `; domain=.${parts.slice(i).join(".")}`)];
  for (const name of names) for (const domain of domains) document.cookie = `${name}=; max-age=0; path=/${domain}`;
}

// Which contact a link opens, if any
function contactMethod(href: string) {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("viber:")) return "viber";
  if (/^(tg:|https?:\/\/(t|telegram)\.me\/)/.test(href)) return "telegram";
  return null;
}

export function GoogleTags({ gaId, adsId, host }: { gaId: string; adsId: string; host: string }) {
  const granted = useSyncExternalStore(subscribeConsent, () => readConsent() === "granted", () => false);

  useEffect(() => {
    if (location.hostname !== host) return;
    const ids = [gaId, adsId].filter(Boolean);
    if (granted) grant(ids);
    else revoke(ids);
  }, [granted, gaId, adsId, host]);

  useEffect(() => {
    if (!granted || location.hostname !== host) return;
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const method = link && contactMethod(link.getAttribute("href") ?? "");
      if (method) window.gtag?.("event", "contact", { method });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [granted, host]);

  return null;
}
