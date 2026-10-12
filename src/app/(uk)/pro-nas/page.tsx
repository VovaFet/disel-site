import { InfoPageView, infoMetadata } from "@/views/pages";

export const generateMetadata = () => infoMetadata("uk", "pro-nas");

export default function Page() {
  return <InfoPageView lang="uk" slug="pro-nas" />;
}
