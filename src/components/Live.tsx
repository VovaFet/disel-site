"use client";

// Small client pieces that render values which can change in the Google Sheet at runtime.
import type { ReactNode } from "react";
import { formatPrice, t } from "@/i18n";
import { openingHoursDisplay } from "@/lib/hours";
import { useLive } from "./LiveConfig";

export function Price({ slug, prefix = true }: { slug: string; prefix?: boolean }) {
  const { live, lang } = useLive();
  const price = live.prices[slug] ?? 0;
  return <>{`${prefix ? `${t(lang).from} ` : ""}${formatPrice(lang, price)}`}</>;
}

// "From" price for several items of a service, e.g. the set of 6 injectors on one engine
export function SetPrice({ slug, units }: { slug: string; units: number }) {
  const { live, lang } = useLive();
  const d = t(lang);
  return <>{`${d.from} ${formatPrice(lang, (live.prices[slug] ?? 0) * units)} ${d.forUnits(units)}`}</>;
}

export function PhoneLink({ className, children }: { className?: string; children?: ReactNode }) {
  const { live } = useLive();
  return (
    <a href={`tel:${live.phone}`} className={className}>
      {children ?? live.phoneDisplay}
    </a>
  );
}

export function PhoneText() {
  return <>{useLive().live.phoneDisplay}</>;
}

export function MessengerLink({ kind, className, children }: { kind: "telegram" | "viber"; className?: string; children: ReactNode }) {
  const { live } = useLive();
  return (
    <a href={live[kind]} className={className}>
      {children}
    </a>
  );
}

// Call button with the number spelled out (tel: links do nothing on most desktops)
// plus messengers, so every visitor has a way to get in touch.
export function ContactActions({ label, className = "actions" }: { label: string; className?: string }) {
  return (
    <div className={className}>
      <PhoneLink className="btn">
        {label}:{" "}
        <span className="nowrap">
          <PhoneText />
        </span>
      </PhoneLink>
      <MessengerLink kind="viber" className="btn btn-outline">
        Viber
      </MessengerLink>
      <MessengerLink kind="telegram" className="btn btn-outline">
        Telegram
      </MessengerLink>
    </div>
  );
}

export function HoursList() {
  const { live, lang } = useLive();
  return (
    <ul>
      {openingHoursDisplay(live.schedule, lang).map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
  );
}
