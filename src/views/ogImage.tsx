// Link preview images (Open Graph) for Telegram, Viber, Facebook etc. Rendered at build time.
// The bundled next/og font has no Cyrillic, so Inter (OFL, src/assets/fonts) is loaded from disk.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getConfig } from "@/config";
import type { Locale } from "@/config/types";
import { formatPrice, t } from "@/i18n";

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));
const fonts = Promise.all([font("Inter-Regular.ttf"), font("Inter-ExtraBold.ttf")]);

const colors = { bg: "#121417", fg: "#eceff3", muted: "#a2aab5", accent: "#e8590c" };

async function render(lang: Locale, title: string, price?: string) {
  const c = await getConfig();
  const [regular, extraBold] = await fonts;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          color: colors.fg,
          backgroundColor: colors.bg,
          // orange glow like the site's pointer background
          backgroundImage: "radial-gradient(circle at 85% 15%, rgba(232, 89, 12, 0.35), transparent 55%)",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 800 }}>
          <div style={{ width: 14, height: 44, borderRadius: 4, backgroundColor: colors.accent }} />
          {c.texts.name[lang]}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 32 }}>
          <div style={{ fontSize: title.length > 45 ? 64 : 76, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          {price && (
            <div
              style={{
                padding: "10px 30px",
                borderRadius: 999,
                fontSize: 44,
                fontWeight: 800,
                color: "#ffffff",
                backgroundColor: colors.accent,
              }}
            >
              {price}
            </div>
          )}
        </div>
        <div style={{ fontSize: 30, color: colors.muted }}>{c.texts.shipping[lang]}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}

export async function homeOgImage(lang: Locale) {
  const c = await getConfig();
  return render(lang, `${t(lang).homeH1} ${c.texts.cityIn[lang]}`);
}

export async function serviceOgImage(lang: Locale, slug: string) {
  const c = await getConfig();
  const s = c.services.find((x) => x.slug === slug);
  if (!s) return homeOgImage(lang);
  return render(lang, `${s.title[lang]} ${c.texts.cityIn[lang]}`, `${t(lang).from} ${formatPrice(lang, s.priceFrom)}`);
}
