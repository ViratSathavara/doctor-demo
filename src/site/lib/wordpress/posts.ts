import "server-only";
import { withBasePath } from "@site/lib/utils/base-path";
import type { Post, PostSummary } from "@site/types/content";
import { cta, icon, list, plain, text, tone } from "./acf";
import { articleHtml, jsonLd, yoastSeo } from "./blocks";
import { wpCollection, wpFetch } from "./client";
import type { WpPost } from "./types";

export const POSTS_ROUTE = "/wp/v2/posts";

/** Frontend URL of a post (articles live at /blog/[slug]; the listing is /blogs). */
export const postHref = (slug: string) => `/blog/${slug}`;

/** Fields of one article (`acf_format=standard` expands images and pickers). */
const POST_PARAMS = {
  _fields: "id,slug,date_gmt,modified_gmt,title,excerpt,content,categories,acf,doctor,schema,yoast_head_json,seo_noindex,_links,_embedded",
  _embed: "wp:featuredmedia,wp:term",
  acf_format: "standard",
};


/** WordPress dates are UTC without a zone ("2026-09-12T10:00:00"). */
const utc = (value: string | undefined) => (value ? (/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value}Z`) : "");

export function mapPostSummary(post: WpPost): PostSummary {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.flat().find((term) => term.taxonomy === "category");
  const acf = post.acf || {};

  return {
    slug: post.slug,
    title: plain(post.title?.rendered),
    excerpt: plain(post.excerpt?.rendered),
    date: utc(post.date_gmt) || text(post.date),
    href: postHref(post.slug),
    category: category ? plain(category.name) : "",
    categorySlug: category ? category.slug : "",
    readTime: text(acf.read_time),
    featured: acf.featured === true,
    image: media?.source_url
      ? {
          src: withBasePath(media.source_url),
          alt: text(media.alt_text, plain(post.title?.rendered)),
          width: media.media_details?.width,
          height: media.media_details?.height,
        }
      : undefined,
    thumb: { tone: tone(acf.card_tone), icon: icon(acf.card_icon, "heart") },
  };
}

/** Map only the published WordPress article fields. */
export function mapPost(post: WpPost): Post {
  const summary = mapPostSummary(post);
  const acf = post.acf || {};
  const inline = acf.inline_cta || {};
  const sidebar = acf.sidebar_cta || {};
  const { html, toc } = articleHtml(text(post.content?.rendered));
  const doctor = post.doctor || {};
  const doctorPath = text(doctor.path);

  return {
    ...summary,
    modified: utc(post.modified_gmt) || text(post.modified) || summary.date,
    lead: text(acf.subtitle) || summary.excerpt,
    content: html,
    toc,
    reviewed: acf.reviewed === true,
    faqs: list(acf.faqs)
      .map((faq) => ({ question: text(faq.question), answer: text(faq.answer) }))
      .filter((faq) => faq.question),
    inlineCta: text(inline.title)
      ? { title: text(inline.title), text: text(inline.text), cta: cta(inline.button_text, inline.button_link) }
      : undefined,
    sidebarCta: { title: text(sidebar.title), text: text(sidebar.text) },
    relatedTreatments: list(acf.related_treatments)
      .filter((row) => text(row.label))
      .map((row) => cta(row.label, row.link)),
    seo: yoastSeo(post.yoast_head_json, post.seo_noindex),
    schema: jsonLd(post.schema),
    doctor: text(doctor.name)
      ? { name: text(doctor.name), slug: doctorPath.split("/").filter(Boolean).pop() ?? "", href: doctorPath || "#" }
      : undefined,
  };
}

/** Slugs of every published post (static generation, sitemap). */
export async function fetchPostSlugs(indexableOnly = false): Promise<string[]> {
  const posts = await wpCollection<Pick<WpPost, "slug" | "seo_noindex">>(POSTS_ROUTE, { _fields: "slug,modified_gmt,seo_noindex", acf_format: "standard" }, ["posts"]);
  return list(posts).filter((post) => !indexableOnly || post.seo_noindex === false).map((post) => text(post.slug)).filter(Boolean);
}

/** One post with its content, or `null` if no post has this slug. */
export async function fetchPost(slug: string): Promise<Post | null> {
  const posts = await wpFetch<WpPost[]>(POSTS_ROUTE, { slug, ...POST_PARAMS }, ["posts", `post-${slug}`]);
  const post = list(posts)[0];
  return post ? mapPost(post) : null;
}
