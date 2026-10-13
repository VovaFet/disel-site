import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import type { Locale } from "@/config/types";
import { t } from "@/i18n";

// The 404 page for /ru and /en, with the header and footer in that language. The build copies it
// to ru/404.html and en/404.html (scripts/localized-404-adapter.js), which the host serves for
// missing pages in that folder.
export async function generateMetadata({ params }: PageProps<"/[lang]/404">): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  return { title: t(lang).notFound, robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/[lang]/404">) {
  return <NotFoundContent lang={(await params).lang as Locale} />;
}
