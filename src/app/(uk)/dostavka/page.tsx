import { InfoPageView, infoMetadata } from "@/views/pages";

export const generateMetadata = () => infoMetadata("uk", "dostavka");

export default function Page() {
  return <InfoPageView lang="uk" slug="dostavka" />;
}
