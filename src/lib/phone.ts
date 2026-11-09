// The chat form's phone mask: +38 (0XX) XXX-XX-XX. The field gets the "+38 (0" prefix on focus, with the caret
// after it; whatever is typed, pasted or autofilled after it or over it (50…, 050…, +380…, 050 123 45 67) comes
// down to the 9 digits after "+38 (0" and is shown in that format.

export const phoneMask = "+38 (0__) ___-__-__";
export const phonePrefix = "+38 (0";

// The number the form sends and the Worker accepts: +380 and 9 digits, the first of them 3–9 (no mobile or city
// code starts with 0, 1 or 2). Anything else gives null.
export function toUaPhone(value: string) {
  const d = value.replace(/\D/g, "");
  return /^380[3-9]\d{8}$/.test(d) ? `+${d}` : null;
}

// Separators appear only between digits, so the last character is always a digit and Backspace never gets
// stuck on a bracket or a dash
const format = (d: string) =>
  `${phonePrefix}${d.slice(0, 2)}${d.length > 2 ? `) ${d.slice(2, 5)}` : ""}${d.length > 5 ? `-${d.slice(5, 7)}` : ""}${d.length > 7 ? `-${d.slice(7, 9)}` : ""}`;

// The field's value after an edit; Backspace stops at the prefix
export function maskPhone(value: string) {
  if (phonePrefix.startsWith(value)) return phonePrefix;
  let d = value.replace(/\D/g, "");
  // the prefix itself, or a whole +380… number pasted over it
  if (d.startsWith("380")) d = d.slice(3);
  // +380… or 050… typed after the prefix
  if (d.startsWith("380")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return format(d.slice(0, 9));
}
