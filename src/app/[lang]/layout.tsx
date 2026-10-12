import { notFound } from "next/navigation";
import { isLocale } from "@/i18n";
import { RootShell, rootMetadata } from "@/views/RootShell";

// Non-default languages: /ru/..., /en/...
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "ru" }, { lang: "en" }];
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  return isLocale(lang) ? rootMetadata(lang) : {};
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <RootShell lang={lang}>{children}</RootShell>;
}
