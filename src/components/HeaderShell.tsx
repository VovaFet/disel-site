"use client";

import { useEffect, useState, type ReactNode } from "react";

// Sticky header that gains a shadow once the page is scrolled.
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header className={`header ${scrolled ? "is-scrolled" : ""}`}>{children}</header>;
}
