"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "@/i18n";
import { useLive } from "./LiveConfig";
import { OpenStatus } from "./OpenStatus";

export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const { lang } = useLive();
  const [open, setOpen] = useState(false);

  // Links close the menu on click; Escape closes it too
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        className="burger"
        aria-label={open ? t(lang).menuClose : t(lang).menuOpen}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} hidden={!open}>
        {/* Phones don't show the open status in the hero; here it is one tap away */}
        <OpenStatus />
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
