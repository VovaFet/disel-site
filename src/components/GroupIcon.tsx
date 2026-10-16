import type { ReactNode } from "react";
import type { ServiceGroup } from "@/config/types";

// Line icons for the service groups. Decorative: the card title names the service.
const shapes: Record<ServiceGroup, ReactNode> = {
  // injector: connector, tapered body, nozzle and spray
  injectors: (
    <>
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 6h8v7l-2.5 3h-3L8 13z" />
      <path d="M12 16v3" />
      <path d="M10 21l-1.5 1.5M12 21.5v1M14 21l1.5 1.5" />
    </>
  ),
  // in-line pump: housing, drive pulley on the side, outlet fittings on top
  pumps: (
    <>
      <rect x="8.5" y="10" width="12.5" height="9" rx="1.5" />
      <circle cx="5" cy="14.5" r="3" />
      <path d="M11.5 10V6.5M14.75 10V6.5M18 10V6.5" />
      <path d="M10.5 6.5h2M13.75 6.5h2M17 6.5h2" />
    </>
  ),
  // turbocharger: volute housing with the outlet, compressor wheel in the middle
  turbo: (
    <>
      <path d="M20 12a8 8 0 1 1-8-8h9v4.5h-1.8" />
      <circle cx="12" cy="12" r="1.2" />
      <path d="M12 10.8C12 8.5 13.5 7.5 15 7.5M13.2 12C15.5 12 16.5 13.5 16.5 15M12 13.2C12 15.5 10.5 16.5 9 16.5M10.8 12C8.5 12 7.5 10.5 7.5 9" />
    </>
  ),
  // test bench: pressure gauge
  testing: (
    <>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M12 17l3.5-4.5" />
      <circle cx="12" cy="17" r="1.2" />
      <path d="M3 20.5h18" />
    </>
  ),
};

export function GroupIcon({ group }: { group: ServiceGroup }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[group]}
    </svg>
  );
}
