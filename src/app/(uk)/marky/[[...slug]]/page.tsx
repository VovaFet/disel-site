import { LandingRoute, landingMetadata, landingParams } from "@/views/landings";

export const dynamicParams = false;

export const generateStaticParams = () => landingParams("marky");

export async function generateMetadata({ params }: PageProps<"/marky/[[...slug]]">) {
  return landingMetadata("uk", "marky", (await params).slug);
}

export default async function Page({ params }: PageProps<"/marky/[[...slug]]">) {
  return <LandingRoute lang="uk" section="marky" slug={(await params).slug} />;
}
