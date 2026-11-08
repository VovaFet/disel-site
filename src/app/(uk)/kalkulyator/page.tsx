import { CalculatorPage, calculatorMetadata } from "@/views/pages";

export const generateMetadata = () => calculatorMetadata("uk");

export default function Page() {
  return <CalculatorPage lang="uk" />;
}
