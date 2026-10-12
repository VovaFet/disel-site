import type { Locale } from "@/config/types";
import { InfoPageView, infoMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/pro-nas">) {
  return infoMetadata((await params).lang as Locale, "pro-nas");
}

export default async function Page({ params }: PageProps<"/[lang]/pro-nas">) {
  return <InfoPageView lang={(await params).lang as Locale} slug="pro-nas" />;
}
