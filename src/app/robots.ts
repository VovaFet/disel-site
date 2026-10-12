import type { MetadataRoute } from "next";
import { getConfig } from "@/config";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const c = await getConfig();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${c.url}/sitemap.xml`,
  };
}
