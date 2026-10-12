import type { Locale } from "@/config/types";
import { ContactsPage, contactsMetadata } from "@/views/pages";

export async function generateMetadata({ params }: PageProps<"/[lang]/kontakty">) {
  return contactsMetadata((await params).lang as Locale);
}

export default async function Page({ params }: PageProps<"/[lang]/kontakty">) {
  return <ContactsPage lang={(await params).lang as Locale} />;
}
