import type { GlobalSeo } from "@site/types/content";

/** WordPress supplies the public address; a deployment may explicitly configure a fallback. */
export function publicSiteUrl(seo: GlobalSeo): string | undefined {
  return (seo.publicBase || process.env.NEXT_PUBLIC_SITE_URL)?.trim().replace(/\/+$/, "") || undefined;
}
