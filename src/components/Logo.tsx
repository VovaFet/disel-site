import { logoArc, logoPulse, logoStrokes, splitLogoName } from "@/lib/logo";

// The arc is in the brand colour; the pulse follows the text colour, so it works in both themes
export function LogoMark({ size = 32 }: { size?: number }) {
  const [arc, pulse] = logoStrokes(size);
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="logo-mark">
      <path d={logoArc} fill="none" style={{ stroke: "var(--brand)" }} strokeWidth={arc} strokeLinecap="round" />
      <path
        d={logoPulse}
        fill="none"
        stroke="currentColor"
        strokeWidth={pulse}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Mark plus the name in condensed caps, its second word in the brand colour
export function Logo({ name, size }: { name: string; size?: number }) {
  const [first, second] = splitLogoName(name);
  return (
    <>
      <LogoMark size={size} />
      <span className="logo-word">
        {first}
        {second && <span>{second}</span>}
      </span>
    </>
  );
}
