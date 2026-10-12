import { ServicesPage, servicesMetadata } from "@/views/pages";

export const generateMetadata = () => servicesMetadata("uk");

export default function Page() {
  return <ServicesPage lang="uk" />;
}
