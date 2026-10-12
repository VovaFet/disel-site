import { RootShell, rootMetadata } from "@/views/RootShell";

// Ukrainian (default language) lives at the site root
export const generateMetadata = () => rootMetadata("uk");

export default function UkLayout({ children }: LayoutProps<"/">) {
  return <RootShell lang="uk">{children}</RootShell>;
}
