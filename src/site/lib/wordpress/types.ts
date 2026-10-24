/**
 * Raw WordPress REST responses (see README → "WordPress API contract"). ACF
 * returns `false` or `null` for empty fields, hence `Maybe<…>` everywhere.
 */

export type Maybe<T> = T | false | null | undefined;

/** ACF link field. */
export interface WpLink {
  title?: Maybe<string>;
  url?: Maybe<string>;
  target?: Maybe<string>;
}

/** ACF image field (return format "array"). */
export interface WpImage {
  url?: Maybe<string>;
  alt?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
}

export type TextRows = Maybe<{ text?: Maybe<string> }[]>;

/** Icon name picked in the CMS (see components/common/icon.tsx). */
type WpIcon = Maybe<string>;

/** Doctor post expanded by the WP plugin (hero chip, doctors mega menu…). */
export interface WpDoctor {
  id?: number;
  slug?: Maybe<string>;
  path?: Maybe<string>;
  name?: Maybe<string>;
  role?: Maybe<string>;
  qualifications?: Maybe<string>;
  short_intro?: Maybe<string>;
  photo?: Maybe<WpImage>;
}

export interface WpMenuItem {
  id?: number;
  title?: Maybe<string>;
  url?: Maybe<string>;
  target?: Maybe<string>;
  /** "treatments" | "doctors" opens that mega menu; "" is a plain link. */
  mega?: Maybe<string>;
  children?: Maybe<WpMenuItem[]>;
}

// ─── GET /ivf/v1/global ─────────────────────────────────────────────────────
// Links are plain URL strings ("" = no link yet); button labels sit beside
// them as `*_text`.

export interface WpGlobal {
  site?: Maybe<{
    name?: Maybe<string>;
    logo?: Maybe<WpImage>;
    phone?: Maybe<string>;
    phone_href?: Maybe<string>;
    whatsapp_link?: Maybe<string>;
    email?: Maybe<string>;
    email_href?: Maybe<string>;
    hours?: Maybe<string>;
    address?: Maybe<string>;
    map_link?: Maybe<string>;
    map_embed_url?: Maybe<string>;
  }>;
  header?: Maybe<{
    back_link_text?: Maybe<string>;
    back_link?: Maybe<string>;
    announcement_badge?: Maybe<string>;
    announcement_text?: Maybe<string>;
    announcement_link_text?: Maybe<string>;
    announcement_link?: Maybe<string>;
    logo?: Maybe<WpImage>;
    brand_name?: Maybe<string>;
    brand_tagline?: Maybe<string>;
    menu?: Maybe<{ id?: number; name?: Maybe<string>; slug?: Maybe<string>; items?: Maybe<WpMenuItem[]> }>;
    phone_label?: Maybe<string>;
    appointment_text?: Maybe<string>;
    appointment_link?: Maybe<string>;
    mega_treatments?: Maybe<{
      columns?: Maybe<
        {
          title?: Maybe<string>;
          icon?: WpIcon;
          links?: Maybe<{ label?: Maybe<string>; link?: Maybe<string>; badge?: Maybe<string> }[]>;
        }[]
      >;
      promo?: Maybe<{
        eyebrow?: Maybe<string>;
        title?: Maybe<string>;
        text?: Maybe<string>;
        button_text?: Maybe<string>;
        button_link?: Maybe<string>;
      }>;
      footer_note?: Maybe<string>;
      /** `href` is ready to use (tel:, mailto: or URL). */
      footer_links?: Maybe<{ label?: Maybe<string>; link_type?: Maybe<string>; href?: Maybe<string> }[]>;
    }>;
    mega_doctors?: Maybe<{
      eyebrow?: Maybe<string>;
      doctor?: Maybe<WpDoctor>;
      chips?: TextRows;
      primary_text?: Maybe<string>;
      primary_link?: Maybe<string>;
      secondary_text?: Maybe<string>;
      secondary_link?: Maybe<string>;
      checklist_title?: Maybe<string>;
      checklist_links?: Maybe<{ label?: Maybe<string>; link?: Maybe<string> }[]>;
      team_title?: Maybe<string>;
      team_members?: Maybe<{ name?: Maybe<string>; note?: Maybe<string>; link?: Maybe<string> }[]>;
      opd_label?: Maybe<string>;
    }>;
  }>;
  footer?: Maybe<{
    newsletter_title?: Maybe<string>;
    newsletter_text?: Maybe<string>;
    newsletter_form?: Maybe<WpCf7Form>;
    tagline?: Maybe<string>;
    /** Icon is chosen in code from `label` (Instagram, YouTube, Facebook…). */
    social?: Maybe<{ icon?: Maybe<WpImage>; label?: Maybe<string>; link?: Maybe<string> }[]>;
    menu_columns?: Maybe<
      {
        show?: Maybe<boolean>;
        heading?: Maybe<string>;
        menu?: Maybe<{ items?: Maybe<WpMenuItem[]> }>;
      }[]
    >;
    copyright?: Maybe<string>;
    legal_links?: Maybe<{ label?: Maybe<string>; link?: Maybe<string> }[]>;
    disclaimer?: Maybe<string>;
    credit?: Maybe<string>;
    credit_link_text?: Maybe<string>;
    credit_link?: Maybe<string>;
    credit_nofollow?: Maybe<boolean>;
    /** Credit link policy from WordPress: "follow" or "nofollow". */
    credit_rel?: Maybe<string>;
  }>;
  seo?: Maybe<{
    site_noindex?: Maybe<boolean>;
    public_base?: Maybe<string>;
    default_share_image?: Maybe<{ url?: Maybe<string>; width?: Maybe<number>; height?: Maybe<number>; type?: Maybe<string> }>;
  }>;
}

/** Contact Form 7 form definition, expanded by the WP plugin. */
export interface WpCf7Form {
  id?: number;
  title?: Maybe<string>;
  fields?: Maybe<
    {
      name?: Maybe<string>;
      type?: Maybe<string>;
      required?: Maybe<boolean>;
      placeholder?: Maybe<string>;
      autocomplete?: Maybe<string>;
      /** Visible label; for an acceptance checkbox, its text. "" when the form has none. */
      label?: Maybe<string>;
      /** Select options. */
      options?: Maybe<string[]>;
    }[]
  >;
  submit_label?: Maybe<string>;
  submit_url?: Maybe<string>;
  hidden?: Maybe<Record<string, string | number>>;
}

// ─── GET /wp/v2/pages/132?_fields=acf,yoast_head_json&acf_format=standard ──

export interface WpHeroSection {
  acf_fc_layout: "hero";
  badge?: Maybe<string>;
  /** Accent words wrapped in *stars*. */
  title?: Maybe<string>;
  description?: Maybe<string>;
  primary_text?: Maybe<string>;
  primary_link?: Maybe<string>;
  video_text?: Maybe<string>;
  video_link?: Maybe<string>;
  stats?: Maybe<{ icon?: WpIcon; value?: Maybe<string>; label?: Maybe<string> }[]>;
  image?: Maybe<WpImage>;
  feature_card?: Maybe<{ icon?: WpIcon; title?: Maybe<string>; text?: Maybe<string> }>;
  rating_card?: Maybe<{ stars?: Maybe<number | string>; label?: Maybe<string> }>;
  doctor?: Maybe<WpDoctor>;
  quick_actions?: Maybe<
    { icon?: WpIcon; colour?: Maybe<string>; title?: Maybe<string>; text?: Maybe<string>; link?: Maybe<string> }[]
  >;
  marquee_items?: TextRows;
}

type Str = Maybe<string>;
type Rows<T> = Maybe<T[]>;
type ValueLabel = Rows<{ value?: Str; label?: Str }>;

export interface WpTreatmentsSection {
  acf_fc_layout: "treatments";
  badge?: Str;
  title?: Str;
  description?: Str;
  tabs?: Rows<{
    label?: Str;
    services?: Rows<{ title?: Str; description?: Str; link?: Str }>;
    feature?: Maybe<{
      icon?: WpIcon;
      eyebrow?: Str;
      title?: Str;
      text?: Str;
      primary_text?: Str;
      primary_link?: Str;
      secondary_text?: Str;
      secondary_link?: Str;
    }>;
  }>;
}

export interface WpAboutSection {
  acf_fc_layout: "about";
  images?: Rows<{ image?: Maybe<WpImage>; caption?: Str }>;
  highlight_value?: Str;
  highlight_label?: Str;
  badge?: Str;
  title?: Str;
  description?: Str;
  points?: Rows<{ title?: Str; text?: Str }>;
  button_text?: Str;
  button_link?: Str;
}

export interface WpDoctorSection {
  acf_fc_layout: "doctor";
  badge?: Str;
  doctor?: Maybe<WpDoctor>;
  stats?: ValueLabel;
  specialties?: TextRows;
  primary_text?: Str;
  primary_link?: Str;
  secondary_text?: Str;
  secondary_link?: Str;
  opd_label?: Str;
}

export interface WpStatsSection {
  acf_fc_layout: "stats";
  items?: ValueLabel;
}

export interface WpJourneySection {
  acf_fc_layout: "journey";
  badge?: Str;
  title?: Str;
  description?: Str;
  guide_text?: Str;
  guide_file?: Maybe<{ url?: Str; filename?: Str }>;
  note?: Str;
  steps?: Rows<{ title?: Str; description?: Str; tag?: Str }>;
}

export interface WpGynecologySection {
  acf_fc_layout: "gynecology";
  badge?: Str;
  title?: Str;
  all_text?: Str;
  all_link?: Str;
  cards?: Rows<{ title?: Str; description?: Str; link?: Str }>;
  note_title?: Str;
  note_text?: Str;
  note_button_text?: Str;
  note_button_link?: Str;
}

export interface WpWhyChooseSection {
  acf_fc_layout: "why_choose";
  badge?: Str;
  title?: Str;
  button_text?: Str;
  button_link?: Str;
  reasons?: Rows<{ title?: Str; description?: Str }>;
}

export interface WpFacilitiesSection {
  acf_fc_layout: "facilities";
  badge?: Str;
  title?: Str;
  description?: Str;
  tour_text?: Str;
  tour_link?: Str;
  /** On Home the first item is the large card. */
  items?: Rows<{ image?: Maybe<WpImage>; title?: Str; description?: Str; representative?: Maybe<boolean> }>;
}

export interface WpNewsSection {
  acf_fc_layout: "news";
  badge?: Str;
  title?: Str;
  description?: Str;
  youtube_text?: Str;
  youtube_link?: Str;
  /** The first video is the large one. */
  videos?: Rows<{ video_url?: Str; title?: Str; channel?: Str; type?: Str; category?: Str }>;
  note?: Str;
}

export interface WpReviewsSection {
  acf_fc_layout: "reviews";
  badge?: Str;
  title?: Str;
  description?: Str;
  read_text?: Str;
  read_link?: Str;
  write_text?: Str;
  write_link?: Str;
  rating_value?: Maybe<string | number>;
  rating_text?: Str;
  /** Total Google reviews (live from Google My Business). */
  rating_count?: Maybe<string | number>;
  place_id?: Str;
  reviews?: Rows<{
    name?: Str;
    /** Relative, as Google words it ("4 days ago"). */
    time?: Str;
    /** ISO date, "YYYY-MM-DD". */
    date?: Str;
    rating?: Maybe<string | number>;
    text?: Str;
    /** Reviewer's photo on Google's CDN (lh3.googleusercontent.com). */
    avatar?: Str;
    review_id?: Str;
  }>;
}

/** Post card expanded by the WP plugin (the 3 newest posts). */
export interface WpPostCard {
  id?: number;
  slug?: Str;
  path?: Str;
  title?: Str;
  date?: Str;
  excerpt?: Str;
  read_time?: Str;
  category?: Maybe<{ id?: number; name?: Str; slug?: Str }>;
  image?: Maybe<WpImage>;
  doctor?: Maybe<{ id?: number; name?: Str; path?: Str }>;
}

export interface WpLatestBlogSection {
  acf_fc_layout: "latest_blog";
  badge?: Str;
  title?: Str;
  view_all_text?: Str;
  view_all_link?: Str;
  posts?: Rows<WpPostCard>;
}

export interface WpFaqSection {
  acf_fc_layout: "faq";
  badge?: Str;
  title?: Str;
  description?: Str;
  help_title?: Str;
  help_text?: Str;
  call_text?: Str;
  whatsapp_text?: Str;
  items?: Rows<{ question?: Str; answer?: Str }>;
}

export interface WpContactSection {
  acf_fc_layout: "contact";
  badge?: Str;
  title?: Str;
  description?: Str;
  address_label?: Str;
  phone_label?: Str;
  email_label?: Str;
  hours_label?: Str;
  form_title?: Str;
  form_subtitle?: Str;
  form?: Maybe<WpCf7Form>;
  /** Contact Us banner only: set → the section renders as the page banner with the call-back form. */
  breadcrumb?: Str;
  whatsapp_label?: Str;
  whatsapp_button_text?: Str;
  form_note?: Str;
}

// ─── Inner-page layouts (same flexible field, e.g. /wp/v2/pages&slug=about) ──

type Fact = { label?: Str; value?: Str };

export interface WpPageHeroSection {
  acf_fc_layout: "page_hero";
  /** Last breadcrumb item; empty → the page title. */
  breadcrumb?: Str;
  title?: Str;
  description?: Str;
  points?: TextRows;
  primary_text?: Str;
  primary_link?: Str;
  secondary_text?: Str;
  secondary_link?: Str;
  image?: Maybe<WpImage>;
  image_title?: Str;
  image_text?: Str;
  /** Gallery banner: eyebrow, stat row and extra collage photos. */
  badge?: Str;
  stats?: ValueLabel;
  more_photos?: Maybe<WpImage[]>;
  /** Blog banner: search box and the "medically reviewed" note. */
  search_placeholder?: Str;
  search_button_text?: Str;
  note?: Str;
  note_image?: Maybe<WpImage>;
}

export interface WpStorySection {
  acf_fc_layout: "story";
  title?: Str;
  lead?: Str;
  /** Paragraphs separated by an empty line. */
  text?: Str;
  video_url?: Str;
  video_length?: Str;
  video_title?: Str;
  video_text?: Str;
  video_points?: TextRows;
  video_button_text?: Str;
}

export interface WpValuesSection {
  acf_fc_layout: "values";
  title?: Str;
  description?: Str;
  cards?: Rows<{ title?: Str; text?: Str }>;
  values?: Rows<{ title?: Str; text?: Str }>;
}

export interface WpDoctorProfileSection {
  acf_fc_layout: "doctor_profile";
  doctor?: Maybe<WpDoctor>;
  /** Falls back to the doctor's photo / role. */
  photo?: Maybe<WpImage>;
  role?: Str;
  description?: Str;
  message?: Str;
  facts?: Rows<Fact>;
  button_text?: Str;
  button_link?: Str;
}

export interface WpMedicalTeamSection {
  acf_fc_layout: "medical_team";
  title?: Str;
  description?: Str;
  members?: Rows<{
    photo?: Maybe<WpImage>;
    representative?: Maybe<boolean>;
    role?: Str;
    name?: Str;
    qualifications?: Str;
    description?: Str;
    facts?: Rows<Fact>;
  }>;
}

export interface WpRecognitionSection {
  acf_fc_layout: "recognition";
  title?: Str;
  description?: Str;
  tab_all?: Str;
  tab_awards?: Str;
  tab_registrations?: Str;
  tab_certificates?: Str;
  items?: Rows<{
    image?: Maybe<WpImage>;
    representative?: Maybe<boolean>;
    /** Fixed key of the tab the item belongs to. */
    tab?: Maybe<"awards" | "registrations" | "certificates" | string>;
    /** Small label on the card (Certificate, Award…). */
    tag?: Str;
    title?: Str;
    details?: Str;
  }>;
}

/** Address, phone and map come from global site info. */
export interface WpLocationSection {
  acf_fc_layout: "location";
  badge?: Str;
  title?: Str;
  areas_title?: Str;
  areas?: TextRows;
  features?: Rows<{ title?: Str; text?: Str }>;
  points?: TextRows;
  directions_text?: Str;
  image?: Maybe<WpImage>;
}

/** Call / WhatsApp buttons use the global site phone + WhatsApp link. */
export interface WpCtaSection {
  acf_fc_layout: "cta";
  title?: Str;
  description?: Str;
  primary_text?: Str;
  primary_link?: Str;
  call_text?: Str;
  whatsapp_text?: Str;
}

export type WpHomeSection =
  | WpHeroSection
  | WpTreatmentsSection
  | WpAboutSection
  | WpDoctorSection
  | WpStatsSection
  | WpJourneySection
  | WpGynecologySection
  | WpWhyChooseSection
  | WpFacilitiesSection
  | WpNewsSection
  | WpReviewsSection
  | WpLatestBlogSection
  | WpFaqSection
  | WpContactSection;

export interface WpGallerySection {
  acf_fc_layout: "gallery";
  photos_tab_text?: Str;
  photos_hint?: Str;
  all_photos_text?: Str;
  albums?: Rows<{ name?: Str; photos?: Rows<{ image?: Maybe<WpImage>; title?: Str; note?: Str; tag?: Str }> }>;
  visit_title?: Str;
  visit_text?: Str;
  visit_directions_text?: Str;
  visit_button_text?: Str;
  visit_button_link?: Str;
  videos_tab_text?: Str;
  playlist_text?: Str;
  all_videos_text?: Str;
  video_groups?: Rows<{
    name?: Str;
    tag?: Str;
    videos?: Rows<{ video_url?: Str; title?: Str; description?: Str; duration?: Str }>;
  }>;
  videos_credit?: Str;
  channel_text?: Str;
  channel_link?: Str;
}

export interface WpHighlightsSection {
  acf_fc_layout: "highlights";
  items?: Rows<{ icon?: WpIcon; title?: Str; text?: Str }>;
}

/** Blog listing; the API fills the post cards, most-read list, categories and doctor card. */
export interface WpBlogListSection {
  acf_fc_layout: "blog_list";
  featured_post?: Maybe<WpPostCard>;
  featured_label?: Str;
  read_article_text?: Str;
  all_text?: Str;
  read_more_text?: Str;
  doctor?: Maybe<WpDoctor>;
  ask_title?: Str;
  ask_text?: Str;
  ask_primary_text?: Str;
  ask_primary_link?: Str;
  ask_call_text?: Str;
  categories_title?: Str;
  most_read_title?: Str;
  most_read?: Rows<WpPostCard>;
  newsletter_title?: Str;
  newsletter_text?: Str;
  topics_title?: Str;
  topics?: Rows<{ label?: Str; search?: Str }>;
  posts?: Rows<WpPostCard>;
  categories?: Rows<{ id?: number; name?: Str; slug?: Str; count?: number }>;
}

/** Address, timings and emergency; the address and phone come from site info. */
export interface WpContactInfoSection {
  acf_fc_layout: "contact_info";
  address_title?: Str;
  directions_text?: Str;
  directions_link?: Str;
  hours_title?: Str;
  hours?: Rows<{ label?: Str; value?: Str }>;
  emergency_title?: Str;
  emergency_text?: Str;
}

export interface WpDirectionsSection {
  acf_fc_layout: "directions";
  title?: Str;
  description?: Str;
  routes?: Rows<{ title?: Str; text?: Str; button_text?: Str; link?: Str }>;
  note?: Str;
}

export interface WpImageTextSection {
  acf_fc_layout: "image_text";
  image?: Maybe<WpImage>;
  title?: Str;
  description?: Str;
  points?: TextRows;
  primary_text?: Str;
  primary_link?: Str;
  call_text?: Str;
}

/** `links` is filled by the API from Footer → Social. */
export interface WpSocialLinksSection {
  acf_fc_layout: "social_links";
  title?: Str;
  links?: Rows<{ label?: Str; link?: Str }>;
}

/** Every layout of the `home_sections` flexible field; any of them may be used on any page. */
export type WpPageSection =
  | WpHomeSection
  | WpPageHeroSection
  | WpStorySection
  | WpValuesSection
  | WpDoctorProfileSection
  | WpMedicalTeamSection
  | WpRecognitionSection
  | WpLocationSection
  | WpCtaSection
  | WpGallerySection
  | WpHighlightsSection
  | WpBlogListSection
  | WpContactInfoSection
  | WpDirectionsSection
  | WpImageTextSection
  | WpSocialLinksSection;

/** JSON-LD from the page's Schema box: one object, a list, or null. */
export type WpSchema = Maybe<Record<string, unknown> | Record<string, unknown>[]>;

/** Yoast SEO fields used for metadata; canonical and robots are final answers from WordPress. */
export interface WpYoast {
  title?: Maybe<string>;
  description?: Maybe<string>;
  canonical?: Maybe<string>;
  robots?: Maybe<{ index?: Maybe<string>; follow?: Maybe<string> }>;
  og_title?: Maybe<string>;
  og_description?: Maybe<string>;
  og_url?: Maybe<string>;
  og_type?: Maybe<string>;
  og_locale?: Maybe<string>;
  og_site_name?: Maybe<string>;
  og_image?: Maybe<{ url?: Maybe<string>; width?: Maybe<number>; height?: Maybe<number> }[]>;
  twitter_card?: Maybe<string>;
  twitter_title?: Maybe<string>;
  twitter_description?: Maybe<string>;
  twitter_image?: Maybe<string>;
}

/** GET /wp/v2/pages&slug=…&_fields=id,slug,title,acf,yoast_head_json,schema&acf_format=standard (an array; [0] is the page). */
export interface WpPage {
  id: number;
  slug?: Str;
  title?: Maybe<WpRendered>;
  acf?: Maybe<{ home_sections?: Maybe<WpPageSection[]> }>;
  yoast_head_json?: Maybe<WpYoast>;
  seo_noindex?: Maybe<boolean>;
  schema?: WpSchema;
}

export interface WpHomePage {
  acf?: Maybe<{ home_sections?: Maybe<WpHomeSection[]> }>;
  yoast_head_json?: Maybe<WpYoast>;
  seo_noindex?: Maybe<boolean>;
  schema?: WpSchema;
}

export interface WpHeading {
  eyebrow?: Maybe<string>;
  title?: Maybe<string>;
  lead?: Maybe<string>;
}

// ─── Design fallbacks (lib/mock) ────────────────────────────────────────────
// The doctor profile (used where the WordPress doctor post is empty) and the
// article settings (no WordPress fields). ACF-style field names; headings mark
// accent words with *stars*.

type Pairs = Maybe<{ label?: Str; value?: Str }[]>;

export interface WpSeo {
  title?: Str;
  description?: Str;
}

/** Closing CTA band; call / WhatsApp buttons use the global site phone + WhatsApp link. */
export interface WpCtaBand {
  title?: Str;
  text?: Str;
  primary_cta?: Maybe<WpLink>;
  call_label?: Str;
  whatsapp_label?: Str;
}

/** Map + address card; the address, phone and map come from global site settings. */
export interface WpLocation {
  eyebrow?: Str;
  title?: Str;
  features?: Maybe<{ icon?: Str; title?: Str; text?: Str }[]>;
  image?: Maybe<WpImage>;
  areas_title?: Str;
  areas?: TextRows;
  notes?: TextRows;
  directions_label?: Str;
}

/** Photo with caption; `image: false` until a photo is uploaded. */
export interface WpPhoto {
  image?: Maybe<WpImage>;
  title?: Str;
  text?: Str;
}

/** Article labels, closing CTA and author box (lib/constants/article-settings.json): WordPress has no fields for them. */
export interface LegacyWpArticleSettings {
  article?: Maybe<{
    written_by?: Str;
    reviewed_label?: Str;
    updated_label?: Str;
    toc_title?: Str;
    faq_title?: Str;
    disclaimer?: Str;
    feedback_question?: Str;
    feedback_thanks?: Str;
    related_treatments_title?: Str;
    related?: Maybe<{ eyebrow?: Str; title?: Str; link?: Maybe<WpLink> }>;
    cta?: Maybe<WpCtaBand>;
  }>;
  author?: Maybe<{
    eyebrow?: Str;
    name?: Str;
    role?: Str;
    qualifications?: Str;
    image?: Maybe<WpImage>;
    bio?: Str;
    stats?: Pairs;
    chips?: TextRows;
    profile?: Maybe<WpLink>;
    book?: Maybe<WpLink>;
  }>;
  /** Booking button in the article sidebar. */
  book?: Maybe<WpLink>;
}

// ─── GET /wp/v2/posts?_embed ────────────────────────────────────────────────

export interface WpRendered {
  rendered: string;
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WpPost {
  id: number;
  slug: string;
  /** Live posts: `date_gmt` / `modified_gmt` (UTC, no zone). The mock articles: `date` / `modified`. */
  date?: string;
  modified?: string;
  date_gmt?: string;
  modified_gmt?: string;
  link?: string;
  title: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  featured_media?: number;
  /** Author / reviewer, expanded by the WP plugin. */
  doctor?: Maybe<{ id?: number; name?: Str; path?: Str }>;
  schema?: WpSchema;
  yoast_head_json?: Maybe<WpYoast>;
  seo_noindex?: Maybe<boolean>;
  acf?: Maybe<{
    author_doctor?: Maybe<number>;
    read_time?: Maybe<string>;
    card_tone?: Maybe<string>;
    card_icon?: Maybe<string>;
    /** Large card at the top of /blog (the newest featured post wins). */
    featured?: Maybe<boolean>;
    /** Standfirst under the article title; falls back to the excerpt. */
    subtitle?: Maybe<string>;
    reviewed?: Maybe<boolean>;
    faqs?: Maybe<{ question?: Maybe<string>; answer?: Maybe<string> }[]>;
    inline_cta?: Maybe<{
      title?: Maybe<string>;
      text?: Maybe<string>;
      button_text?: Maybe<string>;
      button_link?: Maybe<string>;
    }>;
    sidebar_cta?: Maybe<{ title?: Maybe<string>; text?: Maybe<string> }>;
    related_treatments?: Maybe<{ label?: Maybe<string>; link?: Maybe<string> }[]>;
  }>;
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string; media_details?: { width: number; height: number } }[];
    "wp:term"?: WpTerm[][];
  };
}

// ─── GET /wp/v2/doctors&slug=…&acf_format=standard ──────────────────────────

export interface WpDoctorPost {
  id: number;
  slug?: Str;
  title?: Maybe<WpRendered>;
  acf?: Maybe<{
    photo?: Maybe<WpImage>;
    role?: Str;
    qualifications?: Str;
    short_intro?: Str;
    /* Profile page (falls back to photo / role). */
    page_photo?: Maybe<WpImage>;
    photo_badge?: Str;
    page_role?: Str;
    highlights?: Rows<{ text?: Str }>;
    rating_value?: Str;
    rating_text?: Str;
    registration?: Str;
    facts?: Rows<{ label?: Str; value?: Str }>;
    book_text?: Str;
    book_link?: Str;
    call_text?: Str;
    whatsapp_text?: Str;
    /** HTML. */
    about?: Str;
    expertise_title?: Str;
    expertise_text?: Str;
    expertise?: Rows<{ title?: Str; text?: Str; link?: Str }>;
    education_title?: Str;
    education?: Rows<{ year?: Str; title?: Str; place?: Str }>;
    career_title?: Str;
    career?: Rows<{ period?: Str; title?: Str; place?: Str }>;
    awards_title?: Str;
    awards?: Rows<{ image?: Maybe<WpImage>; image_tag?: Str; title?: Str; details?: Str }>;
    booking_title?: Str;
    booking_text?: Str;
    working_hours?: Rows<{ day?: Str; hours?: Str }>;
    fee_label?: Str;
    fee?: Str;
    booking_call_text?: Str;
    booking_whatsapp_text?: Str;
    map_link_text?: Str;
    phone?: Str;
    email?: Str;
    social_links?: Rows<{ label?: Str; link?: Str }>;
    /** Reviews · Location · CTA, the same layouts as the pages. */
    home_sections?: Maybe<WpPageSection[]>;
  }>;
  yoast_head_json?: Maybe<WpYoast>;
  seo_noindex?: Maybe<boolean>;
  schema?: WpSchema;
}
