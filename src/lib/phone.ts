// The chat form's phone mask: +38 (0XX) XXX-XX-XX. Whatever is typed, pasted or autofilled (050…, +380…,
// 050 123 45 67) comes down to the 9 digits after "+38 (0" and is shown in that format.

export const phoneMask = "+38 (0__) ___-__-__";

// The mask filled in to the end
export const isFullPhone = (value: string) => /^380\d{9}$/.test(value.replace(/\D/g, ""));

// Separators appear only between digits, so the last character is always a digit and Backspace never gets
// stuck on a bracket or a dash
const format = (d: string) =>
  `+38 (0${d.slice(0, 2)}${d.length > 2 ? `) ${d.slice(2, 5)}` : ""}${d.length > 5 ? `-${d.slice(5, 7)}` : ""}${d.length > 7 ? `-${d.slice(7, 9)}` : ""}`;

// The field's value after an edit. A shown "+38 (0…" reads back as 380…, so formatting is stable.
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, "");
  if (!d) return value.includes("+") ? "+" : "";
  // the country code being typed (+3, +38)
  if (d === "3" || d === "38") return `+${d}`;
  const national = d.startsWith("380") ? d.slice(3) : d.startsWith("0") ? d.slice(1) : d;
  return format(national.slice(0, 9));
}
