"use client";

import { useState } from "react";
import { t } from "@/i18n";
import { useLive } from "./LiveConfig";

// Nova Poshta recipient details, each with a copy button: customers paste them
// into the Nova Poshta app field by field when sending parts in for repair.
export function ShippingDetails() {
  const { live, lang } = useLive();
  const d = t(lang);
  const rows = [
    { label: d.npRecipient, value: live.novaPoshta.recipient },
    { label: d.phone, value: live.novaPoshta.phone },
    { label: d.npBranch, value: live.novaPoshta.branch },
  ];
  return (
    <div className="np-card">
      <h3>{d.npHeading}</h3>
      <dl>
        {rows.map((r) => (
          <div key={r.label} className="np-row">
            <dt>{r.label}</dt>
            <dd>
              <span>{r.value}</span>
              <CopyButton value={r.value} label={r.label} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="muted small">{d.npNote}</p>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const d = t(useLive().lang);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (old browser, insecure origin): the value stays on screen to copy by hand
    }
  };
  return (
    <button
      type="button"
      className={`copy-btn ${copied ? "is-copied" : ""}`}
      aria-label={`${copied ? d.copied : d.copy}: ${label}`}
      onClick={copy}
    >
      {copied ? `✓ ${d.copied}` : d.copy}
    </button>
  );
}
