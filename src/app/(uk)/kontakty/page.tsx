import { ContactsPage, contactsMetadata } from "@/views/pages";

export const generateMetadata = () => contactsMetadata("uk");

export default function Page() {
  return <ContactsPage lang="uk" />;
}
