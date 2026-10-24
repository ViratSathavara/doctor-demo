import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@site/lib/constants/site";
import { getGlobal, getHomePage, getPostSlugs, getDoctorSlugs, getPageSlugs, getTreatmentSlugs } from "@site/lib/content";

export const revalidate = 300;

// Empty while the whole site is hidden from Google; otherwise pages hidden one by one are left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getGlobal();
  if (seo.siteNoindex) return [];
  const base = publicSiteUrl(seo);
  if (!base) return [];
  const [posts, doctors, pages, treatments, home] = await Promise.all([getPostSlugs(true), getDoctorSlugs(true), getPageSlugs(true), getTreatmentSlugs(true), getHomePage()]);
  const paths = new Set([...(home.seo.noindex === false ? ["/"] : []), ...pages.map(slug => "/" + slug), ...treatments.map(slug => "/treatments/" + slug),
    ...doctors.map(slug => "/doctors/" + slug), ...posts.map(slug => "/blog/" + slug)]);
  return [...paths].map(path => ({ url: base + path, priority: path === "/" ? 1 : 0.7 }));
}
