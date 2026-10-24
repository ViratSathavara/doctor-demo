import "server-only";
import type {
  AboutSection,
  BlogSection,
  BookingSection,
  DoctorSection,
  FacilitiesSection,
  FaqSection,
  GynecologySection,
  HeroSection,
  HomePageContent,
  HomeSectionKey,
  IconName,
  JourneySection,
  PostSummary,
  ReviewsSection,
  SiteSettings,
  StatItem,
  SuccessStoriesSection,
  Tone,
  TreatmentsSection,
  WhyChooseUsSection,
} from "@site/types/content";
import { cta, highlight, icon, image, initials, list, num, plain, requiredImage, text, texts, tone, toSiteHref } from "./acf";
import { jsonLd, yoastSeo } from "./blocks";
import { rich } from "./rich";
import { mapCf7Form } from "./cf7";
import { mapSections } from "./sections";
import { wpFetch } from "./client";
import { postHref } from "./posts";
import { formatDate } from "@site/lib/utils/format";
import type {
  Maybe,
  WpAboutSection,
  WpContactSection,
  WpDoctorSection,
  WpFacilitiesSection,
  WpFaqSection,
  WpGynecologySection,
  WpHeroSection,
  WpHomePage,
  WpHomeSection,
  WpJourneySection,
  WpLatestBlogSection,
  WpNewsSection,
  WpPostCard,
  WpPageSection,
  WpReviewsSection,
  WpTreatmentsSection,
  WpWhyChooseSection,
} from "./types";

/**
 * WordPress Home page: `acf.home_sections` (flexible content) + Yoast SEO.
 * The section mappers are exported: other pages may use the same layouts (see sections.ts).
 */
export const HOME_PAGE_ROUTE = "/wp/v2/pages/132";

/** `acf_format=standard` returns full image objects instead of IDs. */
const HOME_PAGE_PARAMS = { _fields: "acf,yoast_head_json,seo_noindex,schema", acf_format: "standard" };

/*
 * Design-only details the CMS doesn't carry (per the WP guide): icons of the
 * about / gynecology / why-choose cards by position, and the highlighted
 * why-choose card.
 */
const ABOUT_CARDS: { icon: IconName; tone: Tone }[] = [
  { icon: "target", tone: "primary" },
  { icon: "shield-check", tone: "accent" },
];
const GYNECOLOGY_ICONS: IconName[] = ["stethoscope", "sun", "calendar", "heart", "shield", "user"];
const WHY_ICONS: IconName[] = ["doctor", "drop", "receipt", "building", "lock", "map-pin"];
const WHY_HIGHLIGHT = 1;
/** Blog card thumbnail (used while a post has no featured image), by category slug. */
const POST_ICONS: Record<string, IconName> = {
  ivf: "drop",
  pcos: "sun",
  "male-fertility": "user",
  "egg-freezing": "snowflake",
  "fertility-tests": "flask",
  pregnancy: "heart",
};
const POST_TONES: Tone[] = ["primary", "accent", "amber"];

const byPosition = <T>(values: T[], i: number) => values[i % values.length];
const heading = (badge: Maybe<string>, title: Maybe<string>, lead?: Maybe<string>) => ({
  eyebrow: text(badge),
  title: highlight(title),
  lead: rich(lead) || undefined,
});
const valueLabels = (rows: Maybe<{ value?: Maybe<string>; label?: Maybe<string> }[]>): StatItem[] =>
  list(rows).map((row) => ({ value: text(row.value), label: text(row.label) }));

/** YouTube ID from a watch / youtu.be / embed URL. */
export const videoId = (url: Maybe<string>) => text(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1] ?? "";

export function mapHero(hero: WpHeroSection): { hero: HeroSection; marquee: string[] } {
  const featureCard = hero.feature_card || {};
  const ratingCard = hero.rating_card || {};
  const doctor = hero.doctor || {};
  const doctorName = text(doctor.name);

  return {
    hero: {
      badge: text(hero.badge),
      title: highlight(hero.title),
      lead: rich(hero.description),
      primaryCta: cta(hero.primary_text, hero.primary_link),
      videoCta: cta(hero.video_text, hero.video_link),
      stats: list(hero.stats).map((stat) => ({
        icon: icon(stat.icon, "star"),
        value: text(stat.value),
        label: text(stat.label),
      })),
      image: requiredImage(hero.image, doctorName),
      featureCard: {
        icon: icon(featureCard.icon, "drop"),
        title: text(featureCard.title),
        text: text(featureCard.text),
      },
      ratingCard: { rating: num(ratingCard.stars), label: text(ratingCard.label) },
      // Doctor chip links to the doctor section on this page.
      doctorCard: { initials: initials(doctorName), name: doctorName, role: text(doctor.role), href: "/#doctor" },
      quickActions: list(hero.quick_actions).map((action) => ({
        icon: icon(action.icon, "calendar"),
        tone: tone(action.colour),
        title: text(action.title),
        text: text(action.text),
        link: cta(action.title, action.link),
      })),
    },
    marquee: texts(hero.marquee_items),
  };
}

export function mapTreatments(section: WpTreatmentsSection): TreatmentsSection {
  return {
    ...heading(section.badge, section.title, section.description),
    tabs: list(section.tabs).map((tab) => {
      const feature = tab.feature || {};
      return {
        label: text(tab.label),
        services: list(tab.services).map((service) => ({
          title: text(service.title),
          // The whole card is a link: a link inside its text would nest <a> in <a>.
          description: plain(service.description),
          href: toSiteHref(service.link) || "#",
        })),
        feature: {
          icon: icon(feature.icon, "flask"),
          eyebrow: text(feature.eyebrow),
          title: text(feature.title),
          text: rich(feature.text),
          primaryCta: cta(feature.primary_text, feature.primary_link),
          secondaryCta: cta(feature.secondary_text, feature.secondary_link),
        },
      };
    }),
  };
}

export function mapAbout(section: WpAboutSection): AboutSection {
  const [primary, secondary] = list(section.images);
  const captioned = (row: typeof primary | undefined) => ({
    image: requiredImage(row && row.image, text(row && row.caption)),
    caption: text(row && row.caption),
  });
  return {
    ...heading(section.badge, section.title, section.description),
    primaryImage: captioned(primary),
    secondaryImage: captioned(secondary),
    stat: { value: text(section.highlight_value), label: text(section.highlight_label) },
    cards: list(section.points).map((point, i) => ({
      ...byPosition(ABOUT_CARDS, i),
      title: text(point.title),
      text: rich(point.text),
    })),
    cta: cta(section.button_text, section.button_link),
  };
}

export function mapDoctor(section: WpDoctorSection, site: SiteSettings): DoctorSection {
  const doctor = section.doctor || {};
  const name = text(doctor.name);
  return {
    eyebrow: text(section.badge),
    name,
    role: text(doctor.role),
    qualifications: text(doctor.qualifications),
    bio: rich(doctor.short_intro),
    image: requiredImage(doctor.photo, name),
    stats: valueLabels(section.stats),
    chips: texts(section.specialties),
    primaryCta: cta(section.primary_text, section.primary_link),
    secondaryCta: cta(section.secondary_text, section.secondary_link),
    opd: { label: text(section.opd_label), value: site.hours },
  };
}

export function mapJourney(section: WpJourneySection): JourneySection {
  const file = section.guide_file || {};
  return {
    ...heading(section.badge, section.title, section.description),
    // No PDF uploaded yet → "#" (the button stays, as on the live site).
    download: { label: text(section.guide_text), href: text(file.url) || "#", target: text(file.url) ? "_blank" : undefined },
    note: rich(section.note),
    steps: list(section.steps).map((step) => ({
      title: text(step.title),
      description: rich(step.description),
      tag: text(step.tag),
    })),
  };
}

export function mapGynecology(section: WpGynecologySection): GynecologySection {
  return {
    ...heading(section.badge, section.title),
    link: cta(section.all_text, section.all_link),
    items: list(section.cards).map((card, i) => ({
      icon: byPosition(GYNECOLOGY_ICONS, i),
      title: text(card.title),
      // The whole card is a link (see the treatments cards above).
      description: plain(card.description),
      href: toSiteHref(card.link) || "#",
    })),
    band: {
      title: text(section.note_title),
      text: rich(section.note_text),
      cta: cta(section.note_button_text, section.note_button_link),
    },
  };
}

export function mapWhyChoose(section: WpWhyChooseSection): WhyChooseUsSection {
  return {
    ...heading(section.badge, section.title),
    cta: cta(section.button_text, section.button_link),
    items: list(section.reasons).map((reason, i) => ({
      icon: byPosition(WHY_ICONS, i),
      title: text(reason.title),
      description: rich(reason.description),
      highlight: i === WHY_HIGHLIGHT,
    })),
  };
}

export function mapFacilities(section: WpFacilitiesSection): FacilitiesSection {
  const [featured, ...items] = list(section.items);
  return {
    ...heading(section.badge, section.title, section.description),
    link: cta(section.tour_text, section.tour_link),
    featured: {
      image: requiredImage(featured && featured.image, text(featured && featured.title)),
      title: text(featured && featured.title),
      text: rich(featured && featured.description),
      href: toSiteHref(section.tour_link) || "#",
    },
    items: items.map((item) => ({
      image: requiredImage(item.image, text(item.title)),
      caption: text(item.title),
    })),
  };
}

export function mapNews(section: WpNewsSection): SuccessStoriesSection {
  return {
    ...heading(section.badge, section.title, section.description),
    channel: { ...cta(section.youtube_text, section.youtube_link), target: "_blank" },
    videos: list(section.videos).map((video, i) => ({
      position: i + 1,
      youtubeId: videoId(video.video_url),
      name: text(video.title),
      location: [text(video.channel), text(video.type)].filter(Boolean).join(" · "),
      tag: text(video.category),
    })),
    note: rich(section.note),
  };
}

/** Reviewer photo URL: only https on Google's CDN, the host next.config.mjs allows for next/image. */
function googleAvatar(value: Maybe<string>) {
  try {
    const url = new URL(text(value));
    return url.protocol === "https:" && /(^|\.)googleusercontent\.com$/.test(url.hostname) ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function mapReviews(section: WpReviewsSection): ReviewsSection {
  return {
    ...heading(section.badge, section.title, section.description),
    rating: num(section.rating_value),
    ratingCount: num(section.rating_count),
    ratingLabel: text(section.rating_text),
    readLink: cta(section.read_text, section.read_link),
    writeLink: cta(section.write_text, section.write_link),
    items: list(section.reviews).map((review, i) => {
      const name = text(review.name);
      return {
        id: text(review.review_id) || String(i),
        name,
        initial: name.replace(/[^\p{L}]/gu, "").charAt(0).toUpperCase(),
        text: text(review.text),
        rating: Math.min(5, Math.max(0, num(review.rating))),
        // Google's own wording ("4 days ago"); the date only when that is missing.
        time: text(review.time) || formatDate(text(review.date)),
        source: "Google review",
        avatar: googleAvatar(review.avatar),
      };
    }),
  };
}

export function mapPostCard(post: WpPostCard, i: number): PostSummary {
  const slug = text(post.slug);
  const category = post.category || {};
  const categorySlug = text(category.slug);
  const title = plain(post.title);
  return {
    slug,
    title,
    excerpt: plain(post.excerpt),
    date: text(post.date),
    href: postHref(slug),
    category: plain(category.name),
    categorySlug,
    readTime: text(post.read_time),
    featured: false,
    image: image(post.image, title),
    thumb: { tone: byPosition(POST_TONES, i), icon: POST_ICONS[categorySlug] ?? "heart" },
  };
}

export function mapBlog(section: WpLatestBlogSection): BlogSection {
  return {
    ...heading(section.badge, section.title),
    cta: cta(section.view_all_text, section.view_all_link),
    posts: list(section.posts)
      .filter((post) => text(post.slug))
      .map(mapPostCard),
  };
}

export function mapFaq(section: WpFaqSection, site: SiteSettings): FaqSection {
  return {
    ...heading(section.badge, section.title, section.description),
    help: {
      title: text(section.help_title),
      text: rich(section.help_text),
      call: { label: text(section.call_text), href: site.phoneHref || "#" },
      whatsapp: { label: text(section.whatsapp_text), href: site.whatsappHref || "#", target: "_blank" },
    },
    items: list(section.items)
      .map((item) => ({ question: text(item.question), answer: rich(item.answer) }))
      .filter((item) => item.question),
  };
}

export function mapContact(section: WpContactSection): BookingSection {
  return {
    ...heading(section.badge, section.title, section.description),
    labels: {
      address: text(section.address_label),
      phone: text(section.phone_label),
      email: text(section.email_label),
      hours: text(section.hours_label),
    },
    form: {
      title: text(section.form_title),
      subtitle: text(section.form_subtitle),
      cf7: mapCf7Form(section.form) ?? { fields: [], submitLabel: "", submitUrl: "", hidden: {} },
    },
  };
}

/** Empty sections, used when WordPress has no such layout (it then isn't rendered). */
const EMPTY = {
  treatments: { eyebrow: "", title: "", tabs: [] },
  about: {
    eyebrow: "",
    title: "",
    primaryImage: { image: { src: "", alt: "" }, caption: "" },
    secondaryImage: { image: { src: "", alt: "" }, caption: "" },
    stat: { value: "", label: "" },
    cards: [],
    cta: { label: "", href: "#" },
  },
  journey: { eyebrow: "", title: "", download: { label: "", href: "#" }, note: "", steps: [] },
  gynecology: { eyebrow: "", title: "", link: { label: "", href: "#" }, items: [], band: { title: "", text: "", cta: { label: "", href: "#" } } },
  whyChooseUs: { eyebrow: "", title: "", cta: { label: "", href: "#" }, items: [] },
  facilities: {
    eyebrow: "",
    title: "",
    link: { label: "", href: "#" },
    featured: { image: { src: "", alt: "" }, title: "", text: "", href: "#" },
    items: [],
  },
  successStories: { eyebrow: "", title: "", channel: { label: "", href: "#" }, videos: [], note: "" },
  reviews: { eyebrow: "", title: "", rating: 0, ratingCount: 0, ratingLabel: "", readLink: { label: "", href: "#" }, writeLink: { label: "", href: "#" }, items: [] },
  blog: { eyebrow: "", title: "", cta: { label: "", href: "#" }, posts: [] },
  faqs: {
    eyebrow: "",
    title: "",
    help: { title: "", text: "", call: { label: "", href: "#" }, whatsapp: { label: "", href: "#" } },
    items: [],
  },
  booking: {
    eyebrow: "",
    title: "",
    labels: { address: "", phone: "", email: "", hours: "" },
    form: { title: "", subtitle: "", cf7: { fields: [], submitLabel: "", submitUrl: "", hidden: {} } },
  },
} satisfies Partial<HomePageContent>;

const KEYS: HomeSectionKey[] = [
  "hero",
  "treatments",
  "about",
  "doctor",
  "stats",
  "journey",
  "gynecology",
  "why_choose",
  "facilities",
  "news",
  "reviews",
  "latest_blog",
  "faq",
  "contact",
];

/** The first section of a layout (WordPress may hold several; the page shows one of each). */
function find<L extends WpHomeSection["acf_fc_layout"]>(sections: WpHomeSection[], layout: L) {
  return sections.find((section): section is Extract<WpHomeSection, { acf_fc_layout: L }> => section.acf_fc_layout === layout);
}

/** Every home section from GET /wp/v2/pages/132. `site` supplies phone, WhatsApp and hours. */
export async function fetchHome(site: SiteSettings): Promise<HomePageContent> {
  const data = await wpFetch<WpHomePage>(HOME_PAGE_ROUTE, HOME_PAGE_PARAMS, ["home"]);
  const sections = list(data && data.acf && data.acf.home_sections) as WpHomeSection[];
  const hero = find(sections, "hero");


  const doctor = find(sections, "doctor");
  const stats = find(sections, "stats");
  const treatments = find(sections, "treatments");
  const about = find(sections, "about");
  const journey = find(sections, "journey");
  const gynecology = find(sections, "gynecology");
  const why = find(sections, "why_choose");
  const facilities = find(sections, "facilities");
  const news = find(sections, "news");
  const reviews = find(sections, "reviews");
  const blog = find(sections, "latest_blog");
  const faq = find(sections, "faq");
  const contact = find(sections, "contact");

  const order = sections
    .map((section) => section.acf_fc_layout)
    .filter((key, i, all): key is HomeSectionKey => KEYS.includes(key as HomeSectionKey) && all.indexOf(key) === i);

  return {
    order,
    sections: mapSections(sections as WpPageSection[], { site, pageTitle: "", home: true }),
    seo: yoastSeo(data.yoast_head_json, data.seo_noindex),
    schema: jsonLd(data.schema),
    ...mapHero(hero ?? { acf_fc_layout: "hero" }),
    treatments: treatments ? mapTreatments(treatments) : EMPTY.treatments,
    about: about ? mapAbout(about) : EMPTY.about,
    // An unpublished doctor comes back as `doctor: null`; the page hides the section (empty name).
    doctor: mapDoctor(doctor ?? { acf_fc_layout: "doctor" }, site),
    stats: stats ? valueLabels(stats.items) : [],
    journey: journey ? mapJourney(journey) : EMPTY.journey,
    gynecology: gynecology ? mapGynecology(gynecology) : EMPTY.gynecology,
    whyChooseUs: why ? mapWhyChoose(why) : EMPTY.whyChooseUs,
    facilities: facilities ? mapFacilities(facilities) : EMPTY.facilities,
    successStories: news ? mapNews(news) : EMPTY.successStories,
    reviews: reviews ? mapReviews(reviews) : EMPTY.reviews,
    blog: blog ? mapBlog(blog) : EMPTY.blog,
    faqs: faq ? mapFaq(faq, site) : EMPTY.faqs,
    booking: contact ? mapContact(contact) : EMPTY.booking,
  };
}
