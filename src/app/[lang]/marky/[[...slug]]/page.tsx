import type { Locale } from "@/config/types";
import { LandingRoute, landingMetadata, landingParams } from "@/views/landings";

export const dynamicParams = false;

export const generateStaticParams = () => landingParams("marky");

export async function generateMetadata({ params }: PageProps<"/[lang]/marky/[[...slug]]">) {
  const { lang, slug } = await params;
  return landingMetadata(lang as Locale, "marky", slug);
}

export default async function Page({ params }: PageProps<"/[lang]/marky/[[...slug]]">) {
  const { lang, slug } = await params;
  return <LandingRoute lang={lang as Locale} section="marky" slug={slug} />;
}
