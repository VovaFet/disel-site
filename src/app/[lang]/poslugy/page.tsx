import type { Locale } from "@/config/types";
import { ServicesPage, servicesMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/poslugy">) {
  return servicesMetadata((await params).lang as Locale);
}

export default async function Page({ params }: PageProps<"/[lang]/poslugy">) {
  return <ServicesPage lang={(await params).lang as Locale} />;
}
