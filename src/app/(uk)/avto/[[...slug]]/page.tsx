import { LandingRoute, landingMetadata, landingParams } from "@/views/landings";

export const dynamicParams = false;

export const generateStaticParams = () => landingParams("avto");

export async function generateMetadata({ params }: PageProps<"/avto/[[...slug]]">) {
  return landingMetadata("uk", "avto", (await params).slug);
}

export default async function Page({ params }: PageProps<"/avto/[[...slug]]">) {
  return <LandingRoute lang="uk" section="avto" slug={(await params).slug} />;
}
