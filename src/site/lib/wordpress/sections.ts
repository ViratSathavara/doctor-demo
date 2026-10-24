import "server-only";
import type {
  BlogHeroSection,
  BlogListSection,
  ContactHeroSection,
  ContactInfoSection,
  CtaBand,
  DirectionsSection,
  DoctorProfileSection,
  GalleryHeroSection,
  GallerySection,
  HighlightItem,
  IconName,
  ImageTextSection,
  InfrastructureSection,
  LocationSection,
  MedicalTeamSection,
  PageHeroSection,
  PageSection,
  RecognitionSection,
  SiteSettings,
  StorySection,
  ValuesSection,
} from "@site/types/content";
import { cta, highlight, icon, image, list, plain, text, texts, toSiteHref } from "./acf";
import { pairs, slugify, stats } from "./blocks";
import { mapCf7Form } from "./cf7";
import { socialLinks } from "./global";
import { rich } from "./rich";
import {
  mapAbout,
  mapBlog,
  mapContact,
  mapDoctor,
  mapFaq,
  mapFacilities,
  mapGynecology,
  mapHero,
  mapJourney,
  mapNews,
  mapPostCard,
  mapReviews,
  mapTreatments,
  mapWhyChoose,
  videoId,
} from "./home";
import type {
  Maybe,
  WpBlogListSection,
  WpContactInfoSection,
  WpContactSection,
  WpCtaSection,
  WpDirectionsSection,
  WpGallerySection,
  WpHighlightsSection,
  WpImageTextSection,
  WpPostCard,
  WpSocialLinksSection,
  WpDoctorProfileSection,
  WpFacilitiesSection,
  WpLocationSection,
  WpMedicalTeamSection,
  WpPageHeroSection,
  WpPageSection,
  WpRecognitionSection,
  WpStorySection,
  WpValuesSection,
} from "./types";

/**
 * Mappers for the `home_sections` flexible field of any WordPress page (all
 * 29 layouts). The Home layouts reuse the Home mappers; the inner-page
 * layouts (page_hero, story, gallery, blog_list, contact_info, …) are mapped
 * here. Empty CMS fields stay empty.
 */

/** What a section may need besides its own fields. */
export interface SectionContext {
  site: SiteSettings;
  /** WordPress page title: the breadcrumb when `page_hero.breadcrumb` is empty. */
  pageTitle: string;
  home?: boolean;
}

/* Design-only details the CMS doesn't carry: icons by position. */
const VALUE_CARD_ICONS: IconName[] = ["target", "sun"];
const VALUE_ICONS: IconName[] = ["heart", "message", "shield-check", "lock", "award"];
const LOCATION_ICONS: IconName[] = ["car", "lift", "parking"];

/** Recognition tab keys in display order, with the field holding each label. */
const RECOGNITION_TABS = [
  { key: "awards", field: "tab_awards" },
  { key: "registrations", field: "tab_registrations" },
  { key: "certificates", field: "tab_certificates" },
] as const;

const byPosition = <T>(values: T[], i: number) => values[i % values.length];

const heading = (badge: Maybe<string>, title: Maybe<string>, lead?: Maybe<string>) => ({
  eyebrow: text(badge),
  title: highlight(title),
  lead: rich(lead) || undefined,
});

function mapPageHero(section: WpPageHeroSection, { pageTitle }: SectionContext): PageHeroSection {
  return {
    breadcrumb: text(section.breadcrumb) || pageTitle,
    title: highlight(section.title),
    lead: rich(section.description),
    points: texts(section.points),
    primaryCta: cta(section.primary_text, section.primary_link),
    secondaryCta: cta(section.secondary_text, section.secondary_link),
    image: image(section.image),
    tag: { title: text(section.image_title), text: text(section.image_text) },
  };
}

function mapGalleryHero(section: WpPageHeroSection, { pageTitle }: SectionContext): GalleryHeroSection {
  return {
    breadcrumb: text(section.breadcrumb) || pageTitle,
    eyebrow: text(section.badge),
    title: highlight(section.title),
    lead: rich(section.description),
    primaryCta: cta(section.primary_text, section.primary_link),
    secondaryCta: cta(section.secondary_text, section.secondary_link),
    stats: stats(section.stats),
    // Collage: the banner photo, then the extra photos.
    images: [section.image, ...list(section.more_photos)].flatMap((photo) => image(photo) ?? []),
    badge: text(section.image_title),
  };
}

function mapBlogHero(section: WpPageHeroSection, { pageTitle }: SectionContext): BlogHeroSection {
  return {
    breadcrumb: text(section.breadcrumb) || pageTitle,
    title: highlight(section.title),
    lead: rich(section.description),
    searchPlaceholder: text(section.search_placeholder),
    searchButton: text(section.search_button_text),
    note: { text: text(section.note), image: image(section.note_image) },
  };
}

/** The Page Banner layout has three designs: blog (search box), gallery (collage + stats) or the default (photo). */
function mapAnyPageHero(section: WpPageHeroSection, context: SectionContext): PageSection {
  if (text(section.search_placeholder)) return { layout: "blog_hero", data: mapBlogHero(section, context) };
  if (text(section.badge) || list(section.stats).length || list(section.more_photos).length) {
    return { layout: "gallery_hero", data: mapGalleryHero(section, context) };
  }
  return { layout: "page_hero", data: mapPageHero(section, context) };
}

function mapStory(section: WpStorySection): StorySection {
  const url = text(section.video_url);
  return {
    ...heading("", section.title),
    highlight: rich(section.lead),
    text: rich(section.text),
    // No video → no video card.
    tour: url
      ? {
          youtubeId: videoId(url),
          duration: text(section.video_length),
          title: text(section.video_title),
          text: rich(section.video_text),
          points: texts(section.video_points),
          link: { label: text(section.video_button_text), href: url, target: "_blank" },
        }
      : null,
  };
}

function mapValues(section: WpValuesSection): ValuesSection {
  // Only the cards' text is rich text; the short value lines stay plain.
  const rows = (value: WpValuesSection["cards"], icons: IconName[], body: (value: Maybe<string>) => string) =>
    list(value)
      .map((row, i) => ({ icon: byPosition(icons, i), title: text(row.title), text: body(row.text) }))
      .filter((row) => row.title || row.text);
  return {
    ...heading("", section.title, section.description),
    cards: rows(section.cards, VALUE_CARD_ICONS, rich),
    items: rows(section.values, VALUE_ICONS, text),
  };
}

function mapDoctorProfile(section: WpDoctorProfileSection): DoctorProfileSection {
  const doctor = section.doctor || {};
  const name = text(doctor.name);
  return {
    name,
    role: text(section.role) || text(doctor.role),
    bio: rich(section.description),
    message: rich(section.message),
    image: image(section.photo, name) ?? image(doctor.photo, name),
    // `facts`, not doctor.qualifications: the About page shows different text on purpose.
    details: pairs(section.facts),
    cta: cta(section.button_text, section.button_link),
  };
}

function mapMedicalTeam(section: WpMedicalTeamSection): MedicalTeamSection {
  return {
    ...heading("", section.title, section.description),
    members: list(section.members).map((member) => ({
      role: text(member.role),
      name: text(member.name),
      qualifications: text(member.qualifications),
      text: rich(member.description),
      image: image(member.photo, text(member.name) || text(member.role)),
      representative: Boolean(member.representative),
      details: pairs(member.facts),
    })),
  };
}

/** Home's facilities layout, shown with the inner-page design: equal photo tiles, no large first card. */
function mapInfrastructure(section: WpFacilitiesSection): InfrastructureSection {
  return {
    ...heading(section.badge, section.title, section.description),
    // The tour button shows only when both label and link are filled (an empty link is "#").
    link: cta(section.tour_text, section.tour_link),
    items: list(section.items).map((item) => ({
      image: image(item.image, text(item.title)),
      title: text(item.title),
      // Photo tiles open a lightbox caption: plain text, no links.
      text: plain(item.description),
      representative: Boolean(item.representative),
    })),
  };
}

function mapRecognition(section: WpRecognitionSection): RecognitionSection {
  const items = list(section.items).map((item) => ({
    image: image(item.image, text(item.title)),
    title: text(item.title),
    text: text(item.details),
    representative: Boolean(item.representative),
    type: text(item.tab),
    label: text(item.tag),
  }));
  return {
    ...heading("", section.title, section.description),
    allLabel: text(section.tab_all),
    // Empty tabs (no items, or no label) are hidden.
    filters: RECOGNITION_TABS.map(({ key, field }) => ({ key, label: text(section[field]) })).filter(
      (tab) => tab.label && items.some((item) => item.type === tab.key),
    ),
    items,
  };
}

function mapLocation(section: WpLocationSection): LocationSection {
  return {
    eyebrow: text(section.badge),
    title: highlight(section.title),
    features: list(section.features)
      .map((row, i) => ({ icon: byPosition(LOCATION_ICONS, i), title: text(row.title), text: text(row.text) }))
      .filter((row) => row.title),
    image: image(section.image, text(section.title)),
    areasTitle: text(section.areas_title),
    areas: texts(section.areas),
    notes: texts(section.points),
    directionsLabel: text(section.directions_text),
  };
}

function mapCta(section: WpCtaSection): CtaBand {
  return {
    title: highlight(section.title),
    text: rich(section.description),
    primaryCta: cta(section.primary_text, section.primary_link),
    callLabel: text(section.call_text),
    whatsappLabel: text(section.whatsapp_text),
  };
}

function mapGallery(section: WpGallerySection): GallerySection {
  const albums = list(section.albums).map((album) => ({ key: slugify(text(album.name)), label: text(album.name), album }));
  const groups = list(section.video_groups).map((group) => ({ key: slugify(text(group.name)), label: text(group.name), group }));
  return {
    photos: {
      tabLabel: text(section.photos_tab_text),
      hint: text(section.photos_hint),
      allLabel: text(section.all_photos_text),
      albums: albums.filter((album) => album.key).map(({ key, label }) => ({ key, label })),
      items: albums.flatMap(({ key, album }) =>
        list(album.photos).flatMap((photo) => {
          const asset = image(photo.image, text(photo.title));
          return asset
            ? [{ album: key, image: asset, title: text(photo.title), note: text(photo.note), tag: text(photo.tag) }]
            : [];
        }),
      ),
      visit: {
        title: text(section.visit_title),
        text: rich(section.visit_text),
        directionsLabel: text(section.visit_directions_text),
        cta: cta(section.visit_button_text, section.visit_button_link),
      },
    },
    videos: {
      tabLabel: text(section.videos_tab_text),
      playlistLabel: text(section.playlist_text),
      allLabel: text(section.all_videos_text),
      filters: groups.filter((group) => group.key).map(({ key, label }) => ({ key, label })),
      items: groups.flatMap(({ key, group }) =>
        list(group.videos).map((video) => ({
          youtubeId: videoId(video.video_url),
          category: key,
          categoryLabel: text(group.tag) || text(group.name),
          title: text(video.title),
          description: rich(video.description),
          duration: text(video.duration),
        })),
      ),
      credit: text(section.videos_credit),
      channel: cta(section.channel_text, section.channel_link),
    },
  };
}

function mapHighlights(section: WpHighlightsSection): HighlightItem[] {
  return list(section.items)
    .map((item) => ({ icon: icon(item.icon, "heart"), title: text(item.title), text: text(item.text) }))
    .filter((item) => item.title);
}

/** Blog cards: the WordPress card mapper (thumbnail icon / tone by category while a post has no image). */
const postCards = (rows: Maybe<WpPostCard[]>) => list(rows).filter((post) => text(post.slug)).map(mapPostCard);

function mapBlogList(section: WpBlogListSection): BlogListSection {
  const doctor = section.doctor || {};
  const featured = section.featured_post && text(section.featured_post.slug) ? mapPostCard(section.featured_post, 0) : undefined;
  return {
    featuredLabel: text(section.featured_label),
    readLabel: text(section.read_article_text),
    allLabel: text(section.all_text),
    readMoreLabel: text(section.read_more_text),
    featured: featured && { ...featured, featured: true },
    posts: postCards(section.posts),
    mostRead: postCards(section.most_read),
    categories: list(section.categories)
      .map((category) => ({ slug: text(category.slug), name: text(category.name), count: category.count ?? 0 }))
      .filter((category) => category.slug && category.count > 0),
    author: { name: text(doctor.name), image: image(doctor.photo, text(doctor.name)), href: text(doctor.path) || "#" },
    sidebar: {
      doctor: {
        title: text(section.ask_title),
        text: text(section.ask_text),
        cta: cta(section.ask_primary_text, section.ask_primary_link),
        callLabel: text(section.ask_call_text),
      },
      categoriesTitle: text(section.categories_title),
      mostReadTitle: text(section.most_read_title),
      newsletter: { title: text(section.newsletter_title), text: text(section.newsletter_text) },
      topicsTitle: text(section.topics_title),
      topics: list(section.topics)
        .map((topic) => ({ label: text(topic.label), search: text(topic.search) || text(topic.label).replace(/^#/, "") }))
        .filter((topic) => topic.label),
    },
  };
}

function mapContactHero(section: WpContactSection, { pageTitle }: SectionContext): ContactHeroSection {
  return {
    breadcrumb: text(section.breadcrumb) || pageTitle,
    title: highlight(section.title),
    lead: rich(section.description),
    callLabel: text(section.phone_label),
    whatsappLabel: text(section.whatsapp_label),
    emailLabel: text(section.email_label),
    form: {
      title: text(section.form_title),
      subtitle: text(section.form_subtitle),
      cf7: mapCf7Form(section.form) ?? { fields: [], submitLabel: "", submitUrl: "", hidden: {} },
      whatsappButton: text(section.whatsapp_button_text),
      privacy: text(section.form_note),
    },
  };
}

function mapContactInfo(section: WpContactInfoSection, { site }: SectionContext): ContactInfoSection {
  return {
    address: {
      title: text(section.address_title),
      buttonLabel: text(section.directions_text),
      href: toSiteHref(section.directions_link) || site.mapLinkUrl || "#",
    },
    timings: {
      title: text(section.hours_title),
      rows: list(section.hours)
        .map((row) => ({ label: text(row.label), value: text(row.value) }))
        .filter((row) => row.label || row.value)
        // Design: the emergency row is shown in red.
        .map((row) => ({ ...row, highlight: /emergency/i.test(row.label) })),
    },
    emergency: { title: text(section.emergency_title), text: rich(section.emergency_text) },
  };
}

function mapDirections(section: WpDirectionsSection): DirectionsSection {
  return {
    ...heading("", section.title, section.description),
    routes: list(section.routes)
      .map((route) => ({
        label: text(route.title),
        note: text(route.text),
        button: text(route.button_text),
        href: toSiteHref(route.link) || "#",
      }))
      .filter((route) => route.label),
    landmark: text(section.note),
  };
}

function mapImageText(section: WpImageTextSection): ImageTextSection {
  return {
    title: highlight(section.title),
    lead: rich(section.description),
    items: texts(section.points),
    image: image(section.image, text(section.title)),
    primaryCta: cta(section.primary_text, section.primary_link),
    callLabel: text(section.call_text),
  };
}

function mapSocialLinks(section: WpSocialLinksSection) {
  return { title: text(section.title), links: socialLinks(section.links) };
}

/** One WordPress section → its component data; null for a layout this site doesn't know. */
export function mapSection(section: WpPageSection, context: SectionContext): PageSection | null {
  switch (section.acf_fc_layout) {
    case "page_hero":
      return mapAnyPageHero(section, context);
    case "stats":
      return { layout: "stats", data: stats(section.items) };
    case "story":
      return { layout: "story", data: mapStory(section) };
    case "values":
      return { layout: "values", data: mapValues(section) };
    case "doctor_profile":
      return { layout: "doctor_profile", data: mapDoctorProfile(section) };
    case "medical_team":
      return { layout: "medical_team", data: mapMedicalTeam(section) };
    case "facilities":
      return context.home
        ? { layout: "home_facilities", data: mapFacilities(section) }
        : { layout: "facilities", data: mapInfrastructure(section) };
    case "recognition":
      return { layout: "recognition", data: mapRecognition(section) };
    case "reviews":
      return { layout: "reviews", data: mapReviews(section) };
    case "location":
      return { layout: "location", data: mapLocation(section) };
    case "cta":
      return { layout: "cta", data: mapCta(section) };
    case "hero":
      return { layout: "hero", data: mapHero(section) };
    case "treatments":
      return { layout: "treatments", data: mapTreatments(section) };
    case "about":
      return { layout: "about", data: mapAbout(section) };
    case "doctor":
      return { layout: "doctor", data: mapDoctor(section, context.site) };
    case "journey":
      return { layout: "journey", data: mapJourney(section) };
    case "gynecology":
      return { layout: "gynecology", data: mapGynecology(section) };
    case "why_choose":
      return { layout: "why_choose", data: mapWhyChoose(section) };
    case "news":
      return { layout: "news", data: mapNews(section) };
    case "latest_blog":
      return { layout: "latest_blog", data: mapBlog(section) };
    case "faq":
      return { layout: "faq", data: mapFaq(section, context.site) };
    case "contact":
      // With a breadcrumb it is the Contact Us banner + call-back form; otherwise the Home booking section.
      return text(section.breadcrumb)
        ? { layout: "contact_hero", data: mapContactHero(section, context) }
        : { layout: "contact", data: mapContact(section) };
    case "gallery":
      return { layout: "gallery", data: mapGallery(section) };
    case "highlights":
      return { layout: "highlights", data: mapHighlights(section) };
    case "blog_list":
      return { layout: "blog_list", data: mapBlogList(section) };
    case "contact_info":
      return { layout: "contact_info", data: mapContactInfo(section, context) };
    case "directions":
      return { layout: "directions", data: mapDirections(section) };
    case "image_text":
      return { layout: "image_text", data: mapImageText(section) };
    case "social_links":
      return { layout: "social_links", data: mapSocialLinks(section) };
    default:
      return null;
  }
}

/** Every section of a page, in the CMS order (unknown layouts are skipped). */
export function mapSections(sections: WpPageSection[], context: SectionContext): PageSection[] {
  return sections.flatMap((section) => mapSection(section, context) ?? []);
}
