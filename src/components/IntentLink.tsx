"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentProps } from "react";

// A Link that prefetches its page only once the visitor shows intent (hover, focus or touch) instead
// of when it scrolls into view. A prefetched page brings preloads for its photos, so a grid of service
// cards would otherwise download every service photo up front (Next.js docs: guides/prefetching.md,
// "Hover-triggered prefetch").
export function IntentLink(props: Omit<ComponentProps<typeof Link>, "prefetch">) {
  const [intent, setIntent] = useState(false);
  const show = () => setIntent(true);
  return <Link {...props} prefetch={intent ? null : false} onMouseEnter={show} onFocus={show} onTouchStart={show} />;
}

// The header logo: opens the home page, or scrolls back to its top when it is already open (a link to the
// current page doesn't scroll by itself)
export function HomeLink(props: Omit<ComponentProps<typeof IntentLink>, "href" | "onClick"> & { href: string }) {
  const pathname = usePathname();
  const trim = (path: string) => path.replace(/\/+$/, "");
  return (
    <IntentLink
      {...props}
      onClick={(e) => {
        if (trim(pathname) !== trim(props.href)) return;
        e.preventDefault();
        window.scrollTo({ top: 0 });
      }}
    />
  );
}
