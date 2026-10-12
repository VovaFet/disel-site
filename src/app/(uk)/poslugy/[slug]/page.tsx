import { ServicePage, serviceMetadata, serviceSlugs } from "@/views/pages";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await serviceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/poslugy/[slug]">) {
  return serviceMetadata("uk", (await params).slug);
}

export default async function Page({ params }: PageProps<"/poslugy/[slug]">) {
  return <ServicePage lang="uk" slug={(await params).slug} />;
}
