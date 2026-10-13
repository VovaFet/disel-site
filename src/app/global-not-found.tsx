import type { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { t } from "@/i18n";
import { RootShell } from "@/views/RootShell";

// 404 for any unmatched URL in every language (see next.config.ts)
export const metadata: Metadata = { title: t("uk").notFound };

export default function GlobalNotFound() {
  return (
    <RootShell lang="uk" notFound>
      <NotFoundContent />
    </RootShell>
  );
}
