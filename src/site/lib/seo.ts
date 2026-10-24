import type { Metadata } from "next";
import type { GlobalContent, Seo } from "@site/types/content";

/**
 * Page metadata from Yoast, used as WordPress sends it: title, description,
 * canonical (the frontend address, overridable per page), robots (the final
 * answer: whole-site switch or the page's own), Open Graph and Twitter.
 * Canonical and social URLs are never invented. The share image is the page's
 * own, else the site default (already resolved by WordPress).
 */
export function pageMetadata(
  seo: Seo,
  global: Pick<GlobalContent, "site" | "seo">,
  fallbackTitle?: string,
  openGraph: Partial<NonNullable<Metadata["openGraph"]>> = {},
): Metadata {
  const title = seo.title ?? fallbackTitle;
  const hidden = global.seo.siteNoindex !== false || seo.noindex !== false;
  const ogTitle = seo.ogTitle ?? title;
  const ogDescription = seo.ogDescription ?? seo.description;
  return {
    // `absolute` skips the "%s | Site" template: the Yoast title is complete.
    title: seo.title ? { absolute: seo.title } : fallbackTitle,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: { index: !hidden, follow: !hidden },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: seo.ogUrl ?? seo.canonical,
      siteName: seo.siteName ?? global.site.name,
      type: "website",
      locale: seo.ogLocale ?? "en_IN",
      ...(seo.ogImages?.length ? { images: seo.ogImages } : {}),
      ...openGraph,
    } as Metadata["openGraph"],
    twitter: {
      card: (seo.twitterCard as "summary_large_image" | "summary" | undefined) ?? "summary_large_image",
      title: seo.twitterTitle ?? ogTitle,
      description: seo.twitterDescription ?? ogDescription,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
  };
}
