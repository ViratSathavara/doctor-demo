import { withBasePath } from "@site/lib/utils/base-path";
import type {
  CtaBand,
  LocationSection,
  PhotoItem,
  SectionHeading,
  JsonLdData,
  Seo,
  StatItem,
  TimelineItem,
} from "@site/types/content";
import { highlight, icon, image, link, list, text, texts, toSiteHref } from "./acf";
import type { Maybe, WpCtaBand, WpHeading, WpLocation, WpPhoto, WpSchema, WpSeo, WpYoast } from "./types";

/**
 * Mappers for blocks shared by several pages (headings, CTA bands, the
 * location card…). Like acf.ts, empty CMS fields stay empty.
 */

/** Eyebrow + title (accent words in *stars*) + optional lead. */
export function heading(raw: Maybe<WpHeading>): SectionHeading {
  const value = raw || {};
  return { eyebrow: text(value.eyebrow), title: highlight(value.title), lead: text(value.lead) || undefined };
}

export function seo(raw: Maybe<WpSeo>): Seo {
  const value = raw || {};
  return { title: text(value.title) || undefined, description: text(value.description) || undefined };
}

/**
 * Yoast SEO → page metadata. Canonical and robots are the final answers from
 * WordPress: `seo_noindex` (whole-site switch or the page's own) wins over
 * `robots.index`. Missing data stays hidden.
 */
export function yoastSeo(raw: Maybe<WpYoast>, seoNoindex?: Maybe<boolean>): Seo {
  const value = raw || {};
  const robots = value.robots || {};
  const hidden = seoNoindex ?? robots.index !== "index";
  return {
    title: text(value.title) || undefined,
    description: text(value.description) || undefined,
    canonical: text(value.canonical) || undefined,
    noindex: hidden,
    nofollow: hidden,
    ogUrl: text(value.og_url) || undefined,
    ogLocale: text(value.og_locale) || undefined,
    siteName: text(value.og_site_name) || undefined,
    twitterCard: text(value.twitter_card) || undefined,
    twitterTitle: text(value.twitter_title) || undefined,
    twitterDescription: text(value.twitter_description) || undefined,
    twitterImage: text(value.twitter_image) || undefined,
    ogTitle: text(value.og_title) || undefined,
    ogDescription: text(value.og_description) || undefined,
    ogImages: list(value.og_image).flatMap((og) =>
      text(og.url) ? [{ url: text(og.url), width: og.width || undefined, height: og.height || undefined }] : [],
    ),
  };
}

/** WordPress Schema box → JSON-LD printed as is; anything but an object or a list is no schema. */
export function jsonLd(raw: WpSchema): JsonLdData {
  return raw && typeof raw === "object" ? raw : null;
}

export function ctaBand(raw: Maybe<WpCtaBand>): CtaBand {
  const value = raw || {};
  return {
    title: highlight(value.title),
    text: text(value.text),
    primaryCta: link(value.primary_cta),
    callLabel: text(value.call_label),
    whatsappLabel: text(value.whatsapp_label),
  };
}

export function location(raw: Maybe<WpLocation>): LocationSection {
  const value = raw || {};
  return {
    eyebrow: text(value.eyebrow),
    title: highlight(value.title),
    features: list(value.features)
      .map((row) => ({ icon: icon(row.icon, "check"), title: text(row.title), text: text(row.text) }))
      .filter((row) => row.title),
    image: image(value.image, text(value.title)),
    areasTitle: text(value.areas_title),
    areas: texts(value.areas),
    notes: texts(value.notes),
    directionsLabel: text(value.directions_label),
  };
}

export function photo(raw: WpPhoto): PhotoItem {
  return { image: image(raw.image, text(raw.title)), title: text(raw.title), text: text(raw.text) };
}

export function pairs(raw: Maybe<{ label?: Maybe<string>; value?: Maybe<string> }[]>) {
  return list(raw)
    .map((row) => ({ label: text(row.label), value: text(row.value) }))
    .filter((row) => row.label || row.value);
}

export function stats(raw: Maybe<{ label?: Maybe<string>; value?: Maybe<string> }[]>): StatItem[] {
  return pairs(raw).filter((row) => row.value);
}

export function timeline(
  raw: Maybe<{ title?: Maybe<string>; items?: Maybe<{ period?: Maybe<string>; title?: Maybe<string>; place?: Maybe<string> }[]> }>,
): { title: string; items: TimelineItem[] } {
  const value = raw || {};
  return {
    title: text(value.title),
    items: list(value.items).map((row) => ({ period: text(row.period), title: text(row.title), place: text(row.place) })),
  };
}

/** "Patient Stories" → "patient-stories"; used for heading ids and filter keys. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");
}

/**
 * Prepares WordPress post HTML for this site: internal links and local images
 * use the current deployment path, and every <h2> gets an id (kept if
 * the editor set one) so the table of contents can link to it.
 */
export function articleHtml(rendered: Maybe<string>) {
  const toc: { id: string; label: string }[] = [];
  const used = new Set<string>();
  const html = text(rendered)
    .replace(/\s(href|src)=(["'])(.*?)\2/gi, (_, attr: string, quote: string, url: string) => {
      const href = attr.toLowerCase() === "href" ? toSiteHref(url) : url;
      return ` ${attr}=${quote}${withBasePath(href)}${quote}`;
    })
    .replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (match, attrs: string, inner: string) => {
      const label = inner.replace(/<[^>]*>/g, "").trim();
      const existing = attrs.match(/\sid="([^"]+)"/)?.[1];
      let id = existing || slugify(label) || `section-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      toc.push({ id, label });
      return existing ? match : `<h2${attrs} id="${id}">${inner}</h2>`;
    });
  return { html, toc };
}
