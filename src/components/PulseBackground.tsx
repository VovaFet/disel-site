"use client";

import { useEffect, useRef } from "react";
import { logoPulse } from "@/lib/logo";
import { useLive } from "./LiveConfig";

// Now and then the logo's pulse runs across the background dot grid like a heart monitor trace:
// left to right along a random row (at any height), lighting the dots it passes, which then fade. The average pause
// between runs comes from the sheet (settings → pulseInterval, seconds; 0 = off). Off with reduced
// motion; nothing is drawn between runs.

// The dot grid of .mouse-bg (globals.css): a dot in the middle of every 24px tile
const GRID = 24;
// Size of the logo's 64-unit grid on the page, in px per unit: the spike is ~4 dot rows tall
const UNIT = 7;
// Distance between beats along a run
const BEAT_GAP = 340;
// How long a lit dot takes to fade, s
const FADE = 1.1;

// The beat of the logo pulse as [x, y] offsets from its start, in logo units:
// "M8 36H21L26 23…L41.5 36H56" → the points between the flat ends
const beat = (() => {
  const tokens = logoPulse.match(/[MHL]|-?\d+(?:\.\d+)?/g) ?? [];
  const points: [number, number][] = [];
  for (let i = 0, y = 0; i < tokens.length; ) {
    const cmd = tokens[i++];
    if (cmd === "H") points.push([Number(tokens[i++]), y]);
    else {
      const x = Number(tokens[i++]);
      y = Number(tokens[i++]);
      points.push([x, y]);
    }
  }
  const inner = points.slice(1, -1);
  const [x0, y0] = inner[0];
  return inner.map(([x, y]) => [x - x0, y - y0] as [number, number]);
})();

type Dot = { x: number; y: number; t: number; w: number };
type Run = { start: number; dots: Dot[]; end: number };

// One run: the trace as a polyline across the screen, sampled into the grid dots it passes.
// Each dot lights up when the sweep reaches it (t, s) and is brighter the closer the trace runs (w).
function makeRun(width: number, height: number, start: number): Run {
  // any row of the screen; near the top or bottom the spikes may run off the edge
  const y0 = GRID / 2 + Math.floor(Math.random() * Math.max(1, Math.floor(height / GRID))) * GRID;
  const speed = Math.min(600, Math.max(220, width / 2.4));

  const trace: [number, number][] = [[-GRID, y0]];
  for (let x = 60 + Math.random() * BEAT_GAP; x < width; x += BEAT_GAP) {
    for (const [bx, by] of beat) trace.push([x + bx * UNIT, y0 + by * UNIT]);
  }
  trace.push([width + GRID, y0]);

  const dots = new Map<string, Dot>();
  for (let s = 1; s < trace.length; s++) {
    const [ax, ay] = trace[s - 1];
    const [bx, by] = trace[s];
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) / 3);
    for (let k = 0; k <= steps; k++) {
      const px = ax + ((bx - ax) * k) / steps;
      const py = ay + ((by - ay) * k) / steps;
      const x = GRID / 2 + Math.round((px - GRID / 2) / GRID) * GRID;
      const y = GRID / 2 + Math.round((py - GRID / 2) / GRID) * GRID;
      const w = 1 - Math.hypot(px - x, py - y) / (GRID * 0.75);
      const key = `${x},${y}`;
      const prev = dots.get(key);
      if (!prev) dots.set(key, { x, y, t: Math.max(0, px) / speed, w });
      else prev.w = Math.max(prev.w, w);
    }
  }
  return { start, dots: [...dots.values()], end: (width + GRID) / speed + FADE };
}

export function PulseBackground() {
  const { live } = useLive();
  const interval = live.pulseInterval;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !(interval > 0) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let runs: Run[] = [];
    let frame = 0;
    let timer = 0;
    let color = "";

    const draw = (now: number) => {
      const width = canvas.clientWidth;
      ctx.clearRect(0, 0, width, canvas.clientHeight);
      runs = runs.filter((r) => (now - r.start) / 1000 < r.end);
      ctx.fillStyle = color;
      for (const run of runs) {
        const elapsed = (now - run.start) / 1000;
        for (const d of run.dots) {
          const age = elapsed - d.t;
          if (age < 0 || age > FADE) continue;
          const life = 1 - age / FADE;
          ctx.globalAlpha = Math.max(0, d.w) * life;
          ctx.beginPath();
          ctx.arc(d.x, d.y, 1.4 + 1.6 * life * life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      frame = runs.length ? requestAnimationFrame(draw) : 0;
    };

    const launch = () => {
      if (document.hidden) return;
      // match the canvas to the screen (this also clears it)
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      // the accent of the current theme
      color = getComputedStyle(canvas).getPropertyValue("--accent").trim();
      runs.push(makeRun(width, height, performance.now()));
      if (!frame) frame = requestAnimationFrame(draw);
    };

    // "Random" timing: each pause is 60–140% of the configured one; the first run comes soon after load
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        launch();
        schedule(interval * 1000 * (0.6 + 0.8 * Math.random()));
      }, delay);
    };
    schedule(2000 + Math.random() * 2000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [interval]);

  return <canvas ref={ref} className="pulse-bg" aria-hidden="true" />;
}
