import type { Locale } from "@/config/types";
import { InfoPageView, infoMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/dostavka">) {
  return infoMetadata((await params).lang as Locale, "dostavka");
}

export default async function Page({ params }: PageProps<"/[lang]/dostavka">) {
  return <InfoPageView lang={(await params).lang as Locale} slug="dostavka" />;
}
