// The DieselMedic mark (design "B · Манометр і пульс") on a 64×64 grid: a pressure-gauge arc and a
// pulse line. Shared by the site logo, the link preview images and scripts/make-icons.ts.
export const logoArc = "M13.6 50.4A26 26 0 1 1 50.4 50.4";
export const logoPulse = "M8 36H21L26 23L32.5 46L37.5 29L41.5 36H56";
export const logoColors = { accent: "#e8590c", light: "#eceff3", tile: "#121417" };

// Stroke widths [arc, pulse] for a mark drawn at `size` px: thicker when small so it stays legible
export const logoStrokes = (size: number): [number, number] => (size <= 20 ? [8, 7] : size <= 40 ? [6, 5.5] : [5, 4.5]);

// "DieselMedic" -> ["Diesel", "Medic"] for the two-colour wordmark; other names stay whole
export function splitLogoName(name: string): [string, string] {
  const m = /^([A-Z][a-z]+)([A-Z].*)$/.exec(name);
  return m ? [m[1], m[2]] : [name, ""];
}
