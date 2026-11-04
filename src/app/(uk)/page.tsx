import { HomePage, homeMetadata } from "@/views/pages";

export const generateMetadata = () => homeMetadata("uk");

export default function Page() {
  return <HomePage lang="uk" />;
}
