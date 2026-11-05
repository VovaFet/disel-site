// The visitor's answer to the cookie banner, kept in localStorage. Analytics may set cookies only
// after "granted"; the banner shows while there is no answer. Every change is announced with a
// window event, so the banner and analytics follow it without a reload.
export type Consent = "granted" | "denied";

export const consentKey = "cookie-consent";
export const consentEvent = "cookie-consent";

const isConsent = (v: unknown): v is Consent => v === "granted" || v === "denied";

// The answer when storage is blocked: it lasts until the next page load
let unsaved: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(consentKey);
    return isConsent(v) ? v : null;
  } catch {
    return unsaved;
  }
}

// null clears the answer, so the banner asks again (the "Cookie settings" link in the footer)
export function saveConsent(v: Consent | null) {
  unsaved = v;
  try {
    if (v) localStorage.setItem(consentKey, v);
    else localStorage.removeItem(consentKey);
  } catch {
    // storage blocked: readConsent falls back to `unsaved`
  }
  window.dispatchEvent(new CustomEvent<Consent | null>(consentEvent, { detail: v }));
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(consentEvent, onChange);
  // another tab answered
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(consentEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}
