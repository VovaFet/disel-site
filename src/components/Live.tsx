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
