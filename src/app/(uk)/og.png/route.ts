import { homeOgImage } from "@/views/ogImage";

// Link preview image for the Ukrainian pages, rendered once at build time
export const dynamic = "force-static";

export function GET() {
  return homeOgImage("uk");
}
