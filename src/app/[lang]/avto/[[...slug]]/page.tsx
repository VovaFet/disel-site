import type { Locale } from "@/config/types";
import { LandingRoute, landingMetadata, landingParams } from "@/views/landings";

export const dynamicParams = false;

export const generateStaticParams = () => landingParams("avto");

export async function generateMetadata({ params }: PageProps<"/[lang]/avto/[[...slug]]">) {
  const { lang, slug } = await params;
  return landingMetadata(lang as Locale, "avto", slug);
}

export default async function Page({ params }: PageProps<"/[lang]/avto/[[...slug]]">) {
  const { lang, slug } = await params;
  return <LandingRoute lang={lang as Locale} section="avto" slug={slug} />;
}
