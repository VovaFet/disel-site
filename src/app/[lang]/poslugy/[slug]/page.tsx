import type { Locale } from "@/config/types";
import { ServicePage, serviceMetadata, serviceSlugs } from "@/views/pages";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await serviceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/poslugy/[slug]">) {
  const { lang, slug } = await params;
  return serviceMetadata(lang as Locale, slug);
}

export default async function Page({ params }: PageProps<"/[lang]/poslugy/[slug]">) {
  const { lang, slug } = await params;
  return <ServicePage lang={lang as Locale} slug={slug} />;
}
