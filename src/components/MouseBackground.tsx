"use client";

import { useEffect, useRef } from "react";

// Fixed decorative layer behind the page: a dot grid that lights up and a soft glow
// that trail the pointer. Position goes into CSS variables, so React never re-renders.
// With reduced motion the glow stays put; without JS it sits in the centre.
export function MouseBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const pos = { ...target };
    let frame = 0;

    const tick = () => {
      // ease towards the pointer for a smooth trailing effect
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      el.style.setProperty("--mx", `${pos.x}px`);
      el.style.setProperty("--my", `${pos.y}px`);
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const moveTo = (x: number, y: number) => {
      target.x = x;
      target.y = y;
      el.classList.add("is-active");
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onPointer = (e: PointerEvent) => moveTo(e.clientX, e.clientY);
    // while a finger scrolls the page the browser stops sending pointer events,
    // so follow touches separately
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) moveTo(t.clientX, t.clientY);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="mouse-bg" aria-hidden="true" />;
}
