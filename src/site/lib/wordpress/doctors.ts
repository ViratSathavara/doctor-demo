import "server-only";
import type { DoctorProfile, IconName, SiteSettings } from "@site/types/content";
import { cta, image, list, plain, requiredImage, text, texts, toSiteHref } from "./acf";
import { articleHtml, jsonLd, pairs, yoastSeo } from "./blocks";
import { socialLinks } from "./global";
import { rich } from "./rich";
import { mapSections } from "./sections";
import { wpCollection, wpFetch } from "./client";
import type { WpDoctorPost } from "./types";

export const DOCTORS_ROUTE = "/wp/v2/doctors";

/** Frontend URL of a doctor profile — the same path the CMS doctor post reports. */
export const doctorHref = (slug: string) => `/doctors/${slug}`;

/* Icons for the "areas of expertise" cards, by position (the CMS has none). */
const EXPERTISE_ICONS: IconName[] = ["flask", "drop", "sun", "user", "heart", "stethoscope"];

const NO_SITE: SiteSettings = {
  name: "",
  logo: { src: "", alt: "" },
  phone: "",
  phoneHref: "",
  whatsappHref: "",
  email: "",
  emailHref: "",
  address: "",
  hours: "",
  mapEmbedUrl: "",
  mapLinkUrl: "",
};

/**
 * Doctor details come exclusively from the WordPress profile (Doctors → <name>).
 * Empty fields stay empty; button texts are shown as typed, their call and
 * WhatsApp links come from the site settings.
 */
export function mapDoctor(post: WpDoctorPost, site: SiteSettings = NO_SITE): DoctorProfile {
  const acf = post.acf || {};
  const slug = text(post.slug);
  const name = plain(post.title && post.title.rendered);
  const photo = requiredImage(acf.photo, name);
  const book = cta(acf.book_text, acf.book_link);

  return {
    slug,
    seo: yoastSeo(post.yoast_head_json, post.seo_noindex),
    schema: jsonLd(post.schema),
    name,
    role: text(acf.role),
    qualifications: text(acf.qualifications),
    intro: rich(acf.short_intro),
    phone: text(acf.phone) || undefined,
    email: text(acf.email) || undefined,
    social: socialLinks(acf.social_links),
    image: photo,
    pageImage: image(acf.page_photo, name) ?? photo,
    pageRole: text(acf.page_role) || text(acf.role),
    photoBadge: text(acf.photo_badge),
    chips: texts(acf.highlights),
    rating: { value: text(acf.rating_value), label: text(acf.rating_text) },
    registration: text(acf.registration),
    primaryCta: book,
    callLabel: text(acf.call_text),
    whatsappLabel: text(acf.whatsapp_text),
    facts: pairs(acf.facts),
    about: { title: name ? `About ${name}` : "", html: articleHtml(acf.about).html },
    expertise: {
      eyebrow: "",
      title: text(acf.expertise_title),
      lead: rich(acf.expertise_text) || undefined,
      items: list(acf.expertise)
        .map((row, i) => ({
          icon: EXPERTISE_ICONS[i % EXPERTISE_ICONS.length],
          title: text(row.title),
          // The entire expertise card is a link; keep its excerpt plain to
          // avoid literal HTML and nested anchors from the editor.
          text: plain(row.text),
          href: toSiteHref(row.link) || "#",
        }))
        .filter((row) => row.title),
    },
    education: {
      title: text(acf.education_title),
      items: list(acf.education)
        .map((row) => ({ period: text(row.year), title: text(row.title), place: text(row.place) }))
        .filter((row) => row.title),
    },
    experience: {
      title: text(acf.career_title),
      items: list(acf.career)
        .map((row) => ({ period: text(row.period), title: text(row.title), place: text(row.place) }))
        .filter((row) => row.title),
    },
    certificates: {
      title: text(acf.awards_title),
      items: list(acf.awards)
        .map((row) => {
          const tag = text(row.image_tag);
          return { image: image(row.image, text(row.title)), title: text(row.title), text: text(row.details), representative: Boolean(tag), tag };
        })
        .filter((row) => row.title || row.image),
    },
    booking: {
      title: text(acf.booking_title),
      subtitle: text(acf.booking_text),
      opd: list(acf.working_hours)
        .map((row) => ({ label: text(row.day), value: text(row.hours) }))
        .filter((row) => row.label || row.value),
      fee: { label: text(acf.fee_label), value: text(acf.fee) },
      primaryCta: book,
      callLabel: text(acf.booking_call_text),
      whatsappLabel: text(acf.booking_whatsapp_text),
      mapLabel: text(acf.map_link_text),
    },
    sections: mapSections(list(acf.home_sections), { site, pageTitle: name }),
  };
}

export async function fetchDoctorSlugs(indexableOnly = false): Promise<string[]> {
  const doctors = await wpCollection<Pick<WpDoctorPost, "slug" | "seo_noindex">>(DOCTORS_ROUTE, { _fields: "slug,seo_noindex", acf_format: "standard" }, ["doctors"]);
  return list(doctors).filter((doctor) => !indexableOnly || doctor.seo_noindex === false).map((doctor) => text(doctor.slug)).filter(Boolean);
}

/** `null` when no published doctor has this slug (the page then 404s). */
export async function fetchDoctor(slug: string, site?: SiteSettings): Promise<DoctorProfile | null> {
  const doctors = await wpFetch<WpDoctorPost[]>(
    DOCTORS_ROUTE,
    { slug, _fields: "id,slug,title,acf,schema,yoast_head_json,seo_noindex", acf_format: "standard" },
    ["doctors", `doctor-${slug}`],
  );
  const doctor = list(doctors)[0];
  return doctor ? mapDoctor(doctor, site) : null;
}
