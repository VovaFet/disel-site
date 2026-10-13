import { ArticleRoute, articleMetadata, articleParams } from "@/views/articles";

export const dynamicParams = false;

export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: PageProps<"/statti/[[...slug]]">) {
  return articleMetadata("uk", (await params).slug);
}

export default async function Page({ params }: PageProps<"/statti/[[...slug]]">) {
  return <ArticleRoute lang="uk" slug={(await params).slug} />;
}
