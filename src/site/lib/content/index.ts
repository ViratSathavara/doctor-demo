import "server-only";
import { cache } from "react";
import type { PostSummary } from "@site/types/content";
import { fetchArticleSettings } from "@site/lib/wordpress/blog";
import { fetchDoctor, fetchDoctorSlugs } from "@site/lib/wordpress/doctors";
import { fetchGlobal } from "@site/lib/wordpress/global";
import { fetchHome } from "@site/lib/wordpress/home";
import { fetchPage, fetchPageSlugs, fetchTreatmentPage, fetchTreatmentSlugs } from "@site/lib/wordpress/pages";
import { fetchPost, fetchPostSlugs } from "@site/lib/wordpress/posts";

/**
 * Content access layer. Pages and layouts call these functions only — never
 * lib/wordpress directly. Everything reads the live WordPress API
 * (CMS_API_BASE). API fields never use static substitutes.
 * Only interface copy without CMS fields is local. Cached reads refresh every five minutes.
 *
 *   getGlobal()          → GET /ivf/v1/global      site info, header, footer
 *   getHomePage()        → GET /wp/v2/pages/132    every home section + SEO + schema
 *   getReviews()         → Google reviews block    (the home page's reviews section)
 *   getPage(slug)        → GET /wp/v2/pages&slug   pages built from sections: About, Success Stories, Blogs, Contact Us…
 *   getPageSlugs()       → GET /wp/v2/pages        slugs of those pages
 *   getTreatmentPage(slug) → GET /wp/v2/pages&parent  a child of Treatments (IVF, ICSI, …)
 *   getTreatmentSlugs()  → GET /wp/v2/pages&parent  their slugs
 *   getBlogPosts()       → the Blogs page's post cards (featured + list), for "related articles"
 *   getPost(slug)        → GET /wp/v2/posts&slug   one article
 *   getPostSlugs()       → GET /wp/v2/posts        every published post
 *   getDoctor(slug)      → GET /wp/v2/doctors&slug a doctor
 *   getDoctorSlugs()     → GET /wp/v2/doctors      every published doctor
 *   getArticleSettings() → lib/constants/article-settings.json + the post's doctor (article labels, author box)
 *
 * cache() dedupes calls within one request (layout + page + metadata).
 */

/** WordPress page holding the blog listing (`blog_list` section). */
export const BLOG_PAGE_SLUG = "blogs";

export const getGlobal = cache(fetchGlobal);

export const getHomePage = cache(async () => fetchHome((await getGlobal()).site));

/** Same Google profile on every page: the home page's reviews section. */
export const getReviews = cache(async () => (await getHomePage()).reviews);

export const getPage = cache(async (slug: string) => fetchPage(slug, (await getGlobal()).site));

export const getPageSlugs = cache(fetchPageSlugs);

/** A treatment page: a child of the Treatments page, served at /treatments/<slug>. */
export const getTreatmentPage = cache(async (slug: string) => fetchTreatmentPage(slug, (await getGlobal()).site));

export const getTreatmentSlugs = cache(fetchTreatmentSlugs);

export const getBlogPosts = cache(async (): Promise<PostSummary[]> => {
  const page = await getPage(BLOG_PAGE_SLUG);
  const list = page?.sections.find((section) => section.layout === "blog_list");
  if (!list || list.layout !== "blog_list") return [];
  const { featured, posts } = list.data;
  return featured ? [featured, ...posts.filter((post) => post.slug !== featured.slug)] : posts;
});

export const getPost = cache(fetchPost);

export const getPostSlugs = cache(fetchPostSlugs);

export const getDoctorSlugs = cache(fetchDoctorSlugs);

export const getDoctor = cache(async (slug: string) => fetchDoctor(slug, (await getGlobal()).site));

export const getArticleSettings = cache(fetchArticleSettings);
