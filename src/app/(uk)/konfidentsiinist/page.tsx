import { InfoPageView, infoMetadata } from "@/views/pages";

export const generateMetadata = () => infoMetadata("uk", "konfidentsiinist");

export default function Page() {
  return <InfoPageView lang="uk" slug="konfidentsiinist" />;
}
