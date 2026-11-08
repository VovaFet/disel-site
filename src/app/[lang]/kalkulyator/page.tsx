import type { Locale } from "@/config/types";
import { CalculatorPage, calculatorMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/kalkulyator">) {
  return calculatorMetadata((await params).lang as Locale);
}

export default async function Page({ params }: PageProps<"/[lang]/kalkulyator">) {
  return <CalculatorPage lang={(await params).lang as Locale} />;
}
