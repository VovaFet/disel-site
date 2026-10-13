import type { Locale } from "@/config/types";
import { ArticleRoute, articleMetadata, articleParams } from "@/views/articles";

export const dynamicParams = false;

export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: PageProps<"/[lang]/statti/[[...slug]]">) {
  const { lang, slug } = await params;
  return articleMetadata(lang as Locale, slug);
}

export default async function Page({ params }: PageProps<"/[lang]/statti/[[...slug]]">) {
  const { lang, slug } = await params;
  return <ArticleRoute lang={lang as Locale} slug={slug} />;
}
