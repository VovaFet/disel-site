"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { localePath, t } from "@/i18n";
import { readConsent, saveConsent, subscribeConsent } from "@/lib/consent";
import { useLive } from "./LiveConfig";

// Asks for consent to analytics and ads cookies until the visitor answers. Rendered only when a Google
// tag is configured (settings → gaId or adsId; see GoogleTags). Not in the static HTML: the answer is
// known only in the browser, so a visitor who already answered never sees it flash.
export function CookieBanner() {
  const { lang } = useLive();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => undefined);
  const banner = useRef<HTMLElement>(null);

  // While the banner is up, the chat button (ChatWidget) moves up above it by --cookie-banner-space
  useEffect(() => {
    const el = banner.current;
    if (!el) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty("--cookie-banner-space", `${el.offsetHeight + 12}px`));
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cookie-banner-space");
    };
  }, [consent]);

  if (consent !== null) return null;
  const d = t(lang).cookies;
  return (
    <section ref={banner} className="cookie-banner" aria-label={d.label}>
      <p>
        {d.text} <Link href={localePath(lang, "/konfidentsiinist/")}>{d.policy}</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="btn btn-small" onClick={() => saveConsent("granted")}>
          {d.accept}
        </button>
        <button type="button" className="btn btn-small btn-outline" onClick={() => saveConsent("denied")}>
          {d.reject}
        </button>
      </div>
    </section>
  );
}

// Footer link that clears the answer, so the banner asks again
export function CookieSettingsLink() {
  const { lang } = useLive();
  return (
    <button type="button" className="link-button" onClick={() => saveConsent(null)}>
      {t(lang).cookies.settings}
    </button>
  );
}
