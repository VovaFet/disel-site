"use client";

import { useEffect } from "react";
import { readConsent, subscribeConsent } from "@/lib/consent";

// Google Analytics 4 and Google Ads (settings → gaId, adsId) in one Google tag, in "advanced" consent mode:
// the tag loads for every visitor, but until they accept cookies in the banner it stores no cookies and sends
// Google only cookieless pings, with ad click IDs redacted, which Google uses for modelled statistics.
// Declining later returns to that state and deletes the tags' cookies. Only on the site's own domain:
// previews and local builds show the banner but never add to the real statistics.
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

function load(ids: string[], granted: boolean) {
  const dataLayer = (window.dataLayer ??= []);
  window.gtag = function () {
    // gtag.js reads the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag("consent", "default", consent(granted ? "granted" : "denied"));
  // Without consent the pings don't carry the ad click ID either
  window.gtag("set", "ads_data_redaction", true);
  window.gtag("js", new Date());
  for (const id of ids) window.gtag("config", id);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`;
  document.head.append(script);
}

// Google's cookies (_ga, _ga_<id>, _gcl_au…) sit on the widest domain the browser allows, so every parent
// domain is tried
function deleteCookies() {
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
  useEffect(() => {
    if (location.hostname !== host) return;
    const ids = [gaId, adsId].filter(Boolean);
    // The stored answer, read here rather than through a hook: while the page hydrates a hook still holds
    // the server's "no answer", which would load the tag as denied for a visitor who has accepted
    const apply = () => {
      const granted = readConsent() === "granted";
      if (window.gtag) window.gtag("consent", "update", consent(granted ? "granted" : "denied"));
      else load(ids, granted);
      if (!granted) deleteCookies();
    };
    apply();
    const onClick = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const method = link && contactMethod(link.getAttribute("href") ?? "");
      if (method) window.gtag?.("event", "contact", { method });
    };
    document.addEventListener("click", onClick);
    const unsubscribe = subscribeConsent(apply);
    return () => {
      unsubscribe();
      document.removeEventListener("click", onClick);
    };
  }, [gaId, adsId, host]);

  return null;
}
