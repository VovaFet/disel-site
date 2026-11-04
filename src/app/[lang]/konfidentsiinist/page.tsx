import type { Locale } from "@/config/types";
import { InfoPageView, infoMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/konfidentsiinist">) {
  return infoMetadata((await params).lang as Locale, "konfidentsiinist");
}

export default async function Page({ params }: PageProps<"/[lang]/konfidentsiinist">) {
  return <InfoPageView lang={(await params).lang as Locale} slug="konfidentsiinist" />;
}
