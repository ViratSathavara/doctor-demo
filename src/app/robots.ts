import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@site/lib/constants/site";
import { getGlobal } from "@site/lib/content";

export const revalidate = 300;

// Standalone site only (not synced with the demo, which has one robots.txt for the whole domain).
// Follows the WordPress "Hide the whole site from Google" switch.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getGlobal();
  const base = publicSiteUrl(seo);
  if (seo.siteNoindex) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
