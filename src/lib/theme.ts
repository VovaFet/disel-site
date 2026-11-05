// Light/dark theme picked with the header toggle. Without a saved choice the system theme applies
// (prefers-color-scheme in globals.css).
export const themeKey = "theme";
export const isTheme = (v: unknown): v is "light" | "dark" => v === "light" || v === "dark";

// Runs in <head> before the first paint, so a saved choice never flashes in the other theme
// (Next.js docs: guides/preventing-flash-before-hydration.md, "Themes").
export const themeScript = `(function(){try{var t=localStorage.getItem("${themeKey}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
