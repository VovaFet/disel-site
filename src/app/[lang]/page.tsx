import type { Locale } from "@/config/types";
import { HomePage, homeMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  return homeMetadata((await params).lang as Locale);
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  return <HomePage lang={(await params).lang as Locale} />;
}
