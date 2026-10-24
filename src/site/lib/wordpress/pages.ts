import "server-only";
import type { PageContent, SiteSettings } from "@site/types/content";
import { list, plain, text } from "./acf";
import { wpCollection, wpFetch } from "./client";
import { jsonLd, yoastSeo } from "./blocks";
import { HOME_PAGE_ROUTE } from "./home";
import { mapSections } from "./sections";
import type { WpPage, WpPageSection } from "./types";

/**
 * WordPress pages built from sections (`acf.home_sections`): About,
 * Success Stories, Blogs, Contact Us and any page added later. Served at
 * /<slug> by app/…/(site)/[slug]/page.tsx. Treatment pages are children of
 * the "Treatments" page and are served at /treatments/<slug>.
 */
export const PAGES_ROUTE = "/wp/v2/pages";

/** The Home page (id 132) has its own route ("/"); it is never served by slug. */
const HOME_PAGE_ID = Number(HOME_PAGE_ROUTE.split("/").pop());

/** Slug of the top-level page whose children are the treatment pages. */
export const TREATMENTS_SLUG = "treatments";

/** `acf_format=standard` returns full image / doctor objects instead of IDs. */
const PAGE_FIELDS = { _fields: "id,slug,title,acf,yoast_head_json,seo_noindex,schema", acf_format: "standard" };

function mapPage(page: WpPage, slug: string, site: SiteSettings): PageContent {
  const title = plain(page.title && page.title.rendered);
  return {
    id: page.id,
    slug: text(page.slug) || slug,
    title,
    seo: yoastSeo(page.yoast_head_json, page.seo_noindex),
    schema: jsonLd(page.schema),
    sections: mapSections(list(page.acf && page.acf.home_sections) as WpPageSection[], { site, pageTitle: title }),
  };
}

/** One page by slug, or null when it doesn't exist or isn't published. `site` supplies phone, WhatsApp and hours. */
export async function fetchPage(slug: string, site: SiteSettings): Promise<PageContent | null> {
  const pages = await wpFetch<WpPage[]>(PAGES_ROUTE, { slug, ...PAGE_FIELDS }, ["pages", `page-${slug}`]);
  const page = list(pages)[0];
  if (!page || page.id === HOME_PAGE_ID) return null;
  return mapPage(page, slug, site);
}

/** ID of the Treatments page (parent of every treatment page), or null when it isn't published. */
async function fetchTreatmentsParentId(): Promise<number | null> {
  const pages = await wpFetch<Pick<WpPage, "id">[]>(PAGES_ROUTE, { slug: TREATMENTS_SLUG, parent: 0, _fields: "id" }, ["pages", `page-${TREATMENTS_SLUG}`]);
  return list(pages)[0]?.id ?? null;
}

/** One treatment page (a child of Treatments) by slug, or null when it doesn't exist or isn't published. */
export async function fetchTreatmentPage(slug: string, site: SiteSettings): Promise<PageContent | null> {
  const parent = await fetchTreatmentsParentId();
  if (!parent) return null;
  const pages = await wpFetch<WpPage[]>(PAGES_ROUTE, { slug, parent, ...PAGE_FIELDS }, ["pages", `page-${TREATMENTS_SLUG}-${slug}`]);
  const page = list(pages)[0];
  return page ? mapPage(page, slug, site) : null;
}

/** Slugs of every published treatment page, for static generation and the sitemap (`indexableOnly` skips pages hidden from Google). */
export async function fetchTreatmentSlugs(indexableOnly = false): Promise<string[]> {
  const parent = await fetchTreatmentsParentId();
  if (!parent) return [];
  const pages = await wpCollection<Pick<WpPage, "slug" | "seo_noindex">>(PAGES_ROUTE, { parent, _fields: "id,slug,modified,seo_noindex" }, ["pages"]);
  return list(pages).filter((page) => !indexableOnly || page.seo_noindex === false).map((page) => text(page.slug)).filter(Boolean);
}

/** Slugs of every published top-level page except Home, for static generation and the sitemap (`indexableOnly` skips pages hidden from Google). */
export async function fetchPageSlugs(indexableOnly = false): Promise<string[]> {
  const pages = await wpCollection<Pick<WpPage, "id" | "slug" | "seo_noindex">>(PAGES_ROUTE, { parent: 0, _fields: "id,slug,modified,seo_noindex", acf_format: "standard" }, ["pages"]);
  return list(pages)
    .filter((page) => page.id !== HOME_PAGE_ID)
    .filter((page) => !indexableOnly || page.seo_noindex === false)
    .map((page) => text(page.slug))
    .filter(Boolean);
}
