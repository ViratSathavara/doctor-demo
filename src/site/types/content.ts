/**
 * Frontend content model. The WordPress mappers in src/lib/wordpress produce
 * these shapes from API responses (live or mocked), so components never
 * depend on raw WP JSON.
 */

import type { IconName } from "@site/components/common/icon";

export type { IconName };

/** Icon-chip colour used by quick actions and cards. */
export type Tone = "primary" | "accent" | "amber";

export interface ImageAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** CSS object-position, for keeping faces in frame when cropped. */
  position?: string;
}

export interface Cta {
  label: string;
  href: string;
  /** "_blank" for links that open in a new tab. */
  target?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  /** Open Graph overrides from Yoast (fall back to title / description). */
  ogTitle?: string;
  ogDescription?: string;
  ogImages?: { url: string; width?: number; height?: number }[];
  ogUrl?: string;
  ogLocale?: string;
  siteName?: string;
  /** Final answer from WordPress (whole-site switch or the page's own switch). */
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

/** `seo` of GET /ivf/v1/global. */
export interface GlobalSeo {
  /** "Hide the whole site from Google". Stays true when the API gives no answer. */
  siteNoindex: boolean;
  publicBase?: string;
  defaultShareImage?: { url: string; width?: number; height?: number };
}

/** JSON-LD from WordPress's Schema box, printed as is (one object, a list, or null). */
export type JsonLdData = Record<string, unknown> | Record<string, unknown>[] | null;

/**
 * Headings may contain one or more `<em>…</em>` spans (the italic accent
 * colour). Rendered with <RichTitle>, which allows `<em>` only.
 */
export type RichText = string;

/**
 * `lead`, and every other descriptive text field of the sections below
 * (`description`, `text`, `note`, `answer`, `bio`, `message`…), is rich text:
 * sanitized HTML or plain text, printed with <RichText> (components/common),
 * never inside a <p>. Outside the page body use `plain()` (lib/wordpress/acf).
 * Titles are `RichText` above (stars → <em>), not the HTML kind.
 */
export interface SectionHeading {
  eyebrow: string;
  title: RichText;
  lead?: string;
}

// ─── Forms (Contact Form 7 in WordPress) ────────────────────────────────────

export interface Cf7Field {
  /** Field name posted to CF7, e.g. "your-name". */
  name: string;
  type: "text" | "tel" | "email" | "date" | "select" | "textarea" | "acceptance";
  required: boolean;
  /** Also used as the visible label. */
  placeholder: string;
  autocomplete?: string;
  /** Visible label (CF7 `label`); for an acceptance checkbox, its text. */
  label?: string;
  options?: string[];
}

export interface Cf7Form {
  fields: Cf7Field[];
  submitLabel: string;
  /** CF7 REST feedback endpoint (multipart POST from the browser). */
  submitUrl: string;
  hidden: Record<string, string>;
}

// ─── Global (header, footer, contact details) ───────────────────────────────

export interface SocialLink {
  platform: "instagram" | "youtube" | "facebook" | "whatsapp" | "linkedin";
  label: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  logo: ImageAsset;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
  emailHref: string;
  address: string;
  hours: string;
  mapEmbedUrl: string;
  mapLinkUrl: string;
}

export interface Announcement {
  tag: string;
  text: string;
  link?: Cta;
  hours: string;
}

export type MegaMenuKey = "treatments" | "doctors";

export interface NavItem {
  target?: string;
  label: string;
  href: string;
  /** Opens a mega menu on desktop instead of navigating. */
  mega?: MegaMenuKey;
}

export interface TreatmentsMegaMenu {
  columns: {
    title: string;
    icon: IconName;
    links: { label: string; href: string; badge?: string }[];
  }[];
  promo: { eyebrow: string; title: string; text: string; cta: Cta };
  footerNote: string;
  footerLinks: Cta[];
}

export interface DoctorsMegaMenu {
  doctor: {
    eyebrow: string;
    name: string;
    role: string;
    qualifications: string;
    image: ImageAsset;
    chips: string[];
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  checklist: { title: string; links: Cta[] };
  team: { title: string; members: { name: string; note: string; href: string }[] };
  opd: { label: string; value: string };
}

export interface Brand {
  logo: ImageAsset;
  /** Word mark, e.g. "AASHA". */
  name: string;
  /** Line under the word mark, e.g. "IVF CENTRE". */
  tagline: string;
}

export interface HeaderContent {
  backLink: Cta;
  brand: Brand;
  menu: NavItem[];
  phoneLabel: string;
  cta: Cta;
  mega: {
    treatments: TreatmentsMegaMenu;
    doctors: DoctorsMegaMenu;
  };
}

export interface FooterContent {
  newsletter: { title: string; text: string; placeholder: string; button: string; form?: Cf7Form };
  tagline: string;
  social: SocialLink[];
  columns: { heading: string; links: Cta[] }[];
  copyright: string;
  legalLinks: Cta[];
  disclaimer: string;
  /** "Developed and designed by" + link. */
  /** `rel` comes from WordPress ("noopener" or "nofollow noopener"). */
  credit: { text: string; link: Cta; rel: "follow" | "nofollow" };
}

export interface FloatingActions {
  whatsapp: Cta;
  call: Cta;
}

export interface GlobalContent {
  site: SiteSettings;
  announcement: Announcement;
  header: HeaderContent;
  footer: FooterContent;
  floating: FloatingActions;
  seo: GlobalSeo;
}

// ─── Home page sections ─────────────────────────────────────────────────────

export interface HeroStat {
  icon: IconName;
  value: string;
  label: string;
}

export interface QuickAction {
  icon: IconName;
  tone: Tone;
  title: string;
  text: string;
  link: Cta;
}

export interface HeroSection {
  badge: string;
  title: RichText;
  lead: string;
  primaryCta: Cta;
  videoCta: Cta;
  stats: HeroStat[];
  image: ImageAsset;
  featureCard: { icon: IconName; title: string; text: string };
  ratingCard: { rating: number; label: string };
  doctorCard: { initials: string; name: string; role: string; href: string };
  quickActions: QuickAction[];
}

export interface ServiceCard {
  title: string;
  description: string;
  href: string;
}

export interface TreatmentTab {
  label: string;
  services: ServiceCard[];
  feature: {
    icon: IconName;
    eyebrow: string;
    title: string;
    text: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
}

export interface TreatmentsSection extends SectionHeading {
  tabs: TreatmentTab[];
}

export interface AboutSection extends SectionHeading {
  primaryImage: { image: ImageAsset; caption: string };
  secondaryImage: { image: ImageAsset; caption: string };
  stat: { value: string; label: string };
  cards: { icon: IconName; tone: Tone; title: string; text: string }[];
  cta: Cta;
}

export interface DoctorSection {
  eyebrow: string;
  name: string;
  role: string;
  qualifications: string;
  bio: string;
  image: ImageAsset;
  stats: { value: string; label: string }[];
  chips: string[];
  primaryCta: Cta;
  secondaryCta: Cta;
  opd: { label: string; value: string };
}

export interface StatItem {
  /** "1000+" counts up; values like "4.9★" are shown as-is. */
  value: string;
  label: string;
}

export interface JourneySection extends SectionHeading {
  download: Cta;
  note: string;
  steps: { title: string; description: string; tag: string }[];
}

export interface GynecologySection extends SectionHeading {
  link: Cta;
  items: { icon: IconName; title: string; description: string; href: string }[];
  band: { title: string; text: string; cta: Cta };
}

export interface WhyChooseUsSection extends SectionHeading {
  cta: Cta;
  items: { icon: IconName; title: string; description: string; highlight: boolean }[];
}

export interface FacilitiesSection extends SectionHeading {
  link: Cta;
  featured: { image: ImageAsset; title: string; text: string; href: string };
  items: { image: ImageAsset; caption: string }[];
}

export interface VideoTestimonial {
  /**
   * 1-based slot on the page after sorting by the CMS `order` number:
   * 1 = large video, 2–3 = beside it, 4+ = rows of three.
   */
  position: number;
  /** 11-character YouTube ID; invalid/empty IDs render a placeholder. */
  youtubeId: string;
  name: string;
  location: string;
  tag: string;
}

export interface SuccessStoriesSection extends SectionHeading {
  channel: Cta;
  videos: VideoTestimonial[];
  note: string;
}

export interface Review {
  /** Google review ID; falls back to the position when the CMS sends none. */
  id: string;
  name: string;
  initial: string;
  text: string;
  rating: number;
  time: string;
  source: string;
  avatarColor?: string;
  /** Reviewer's Google profile photo (https, googleusercontent.com only). */
  avatar?: string;
}

export interface ReviewsSection extends SectionHeading {
  rating: number;
  /** Total number of Google reviews (0 when unknown). */
  ratingCount: number;
  ratingLabel: string;
  readLink: Cta;
  writeLink: Cta;
  items: Review[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface FaqSection extends SectionHeading {
  help: { title: string; text: string; call: Cta; whatsapp: Cta };
  items: Faq[];
}

export interface BookingSection extends SectionHeading {
  labels: { address: string; phone: string; email: string; hours: string };
  form: {
    title: string;
    subtitle: string;
    /** Fields, button and endpoint from WordPress; the success message comes from its response. */
    cf7: Cf7Form;
  };
}

export interface BlogSection extends SectionHeading {
  cta: Cta;
  /** Newest posts, picked by WordPress. */
  posts: PostSummary[];
}

/** Home layouts in WordPress order (`acf_fc_layout`). */
export type HomeSectionKey =
  | "hero"
  | "treatments"
  | "about"
  | "doctor"
  | "stats"
  | "journey"
  | "gynecology"
  | "why_choose"
  | "facilities"
  | "news"
  | "reviews"
  | "latest_blog"
  | "faq"
  | "contact";

export interface HomePageContent {
  sections: PageSection[];
  /** Sections present in WordPress, in their CMS order. */
  order: HomeSectionKey[];
  seo: Seo;
  schema: JsonLdData;
  hero: HeroSection;
  marquee: string[];
  treatments: TreatmentsSection;
  about: AboutSection;
  doctor: DoctorSection;
  stats: StatItem[];
  journey: JourneySection;
  gynecology: GynecologySection;
  whyChooseUs: WhyChooseUsSection;
  facilities: FacilitiesSection;
  successStories: SuccessStoriesSection;
  reviews: ReviewsSection;
  blog: BlogSection;
  faqs: FaqSection;
  booking: BookingSection;
}

// ─── Blog ───────────────────────────────────────────────────────────────────

export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category: string;
  /** Category slug, used by the blog filters (`/blog?category=…`). */
  categorySlug: string;
  readTime: string;
  /** Shown as the large featured card on /blog. */
  featured: boolean;
  image?: ImageAsset;
  /** Card thumbnail styling, used when the post has no featured image. */
  thumb: { tone: Tone; icon: IconName };
}

export interface Post extends PostSummary {
  modified: string;
  seo: Seo;
  schema: JsonLdData;
  /** Author / reviewer doctor (WordPress `doctor`), with the profile path. */
  doctor?: { name: string; slug: string; href: string };
  /** Standfirst under the article title. */
  lead: string;
  /** Article HTML from WordPress (root paths already prefixed, h2s carry ids). */
  content: string;
  /** "In this article" links, built from the h2s in `content`. */
  toc: { id: string; label: string }[];
  reviewed: boolean;
  faqs: Faq[];
  /** Call-to-action card after the article body. */
  inlineCta?: { title: string; text: string; cta: Cta };
  sidebarCta: { title: string; text: string };
  relatedTreatments: Cta[];
}

// ─── Inner pages (shared blocks) ────────────────────────────────────────────

export interface Breadcrumb {
  label: string;
  /** Omitted for the current page. */
  href?: string;
}

/** Closing call-to-action band. The call / WhatsApp buttons use the site's phone and WhatsApp link. */
export interface CtaBand {
  title: RichText;
  text: string;
  primaryCta: Cta;
  /** Label before the phone number ("Call Now:"); empty hides the call button. */
  callLabel: string;
  /** Empty hides the WhatsApp button. */
  whatsappLabel: string;
}

/** Map + address card. Address, phone and map come from the site settings. */
export interface LocationSection {
  eyebrow: string;
  title: RichText;
  /** Short facts with an icon ("Easy access", "Lift available", "Parking"). */
  features: { icon: IconName; title: string; text: string }[];
  /** Round picture in the card's corner (desktop only). */
  image?: ImageAsset;
  areasTitle: string;
  areas: string[];
  notes: string[];
  directionsLabel: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  place: string;
}

/** Captioned photo that opens in the lightbox; `image` is missing until a photo is added. */
export interface PhotoItem {
  image?: ImageAsset;
  title: string;
  text: string;
  /** Show the "Representative image" tag (stock photo, not the hospital's own). */
  representative?: boolean;
  /** Text of that tag when the CMS sets it (e.g. doctor award `image_tag`). */
  tag?: string;
}

// ─── Inner-page sections (WordPress layouts, any page) ─────────────────────

/** `page_hero`: dark banner with breadcrumb, h1, ticks, two buttons and a photo. */
export interface PageHeroSection {
  /** Last breadcrumb item (the CMS value, else the page title). */
  breadcrumb: string;
  title: RichText;
  lead: string;
  points: string[];
  primaryCta: Cta;
  secondaryCta: Cta;
  image?: ImageAsset;
  tag: { title: string; text: string };
}

export interface FactItem {
  label: string;
  value: string;
}

/** `story`: "Who we are" text beside a video card (`tour` is null without a video). */
export interface StorySection extends SectionHeading {
  highlight: string;
  /** Rich text (HTML, or plain paragraphs split on blank lines): print with <RichText>. */
  text: string;
  tour: { youtubeId: string; duration: string; title: string; text: string; points: string[]; link: Cta } | null;
}

/** `values`: large cards (mission, vision) + small value items; icons by position. */
export interface ValuesSection extends SectionHeading {
  cards: { icon: IconName; title: string; text: string }[];
  items: { icon: IconName; title: string; text: string }[];
}

/** `doctor_profile`: photo, name, role, bio, message, facts and a button. */
export interface DoctorProfileSection {
  name: string;
  role: string;
  bio: string;
  message: string;
  image?: ImageAsset;
  details: FactItem[];
  cta: Cta;
}

/** `medical_team`: one card per team member. */
export interface MedicalTeamSection extends SectionHeading {
  members: {
    role: string;
    name: string;
    qualifications: string;
    text: string;
    image?: ImageAsset;
    representative: boolean;
    details: FactItem[];
  }[];
}

/** `facilities` on inner pages: photo grid with lightbox (optional tour button). */
export interface InfrastructureSection extends SectionHeading {
  link: Cta;
  items: PhotoItem[];
}

/** `page_hero` with a photo collage and stats (Success Stories). */
export interface GalleryHeroSection {
  breadcrumb: string;
  eyebrow: string;
  title: RichText;
  lead: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  stats: StatItem[];
  images: ImageAsset[];
  /** Badge over the collage. */
  badge: string;
}

/** `page_hero` with a search box (Blogs). */
export interface BlogHeroSection {
  breadcrumb: string;
  title: RichText;
  lead: string;
  searchPlaceholder: string;
  searchButton: string;
  /** "Every article is medically reviewed…" with the doctor's photo. */
  note: { text: string; image?: ImageAsset };
}

/** `recognition`: awards / registrations / certificates with filter tabs. */
export interface RecognitionSection extends SectionHeading {
  /** Label of the "show everything" tab. */
  allLabel: string;
  /** Tabs with at least one item, in a fixed order. */
  filters: { key: string; label: string }[];
  /** `type` = tab key, `label` = small tag on the card. */
  items: (PhotoItem & { type: string; label: string })[];
}

/** Doctor shown with blog posts (name + photo). */
export interface PostAuthor {
  name: string;
  image?: ImageAsset;
  href: string;
}

/** `blog_list`: featured post, cards, sidebar (ask the doctor, categories, most read, newsletter, topics). */
export interface BlogListSection {
  featuredLabel: string;
  readLabel: string;
  allLabel: string;
  readMoreLabel: string;
  featured?: PostSummary;
  posts: PostSummary[];
  mostRead: PostSummary[];
  categories: { slug: string; name: string; count: number }[];
  author: PostAuthor;
  sidebar: {
    doctor: { title: string; text: string; cta: Cta; callLabel: string };
    categoriesTitle: string;
    mostReadTitle: string;
    /** Sign-up uses the footer's newsletter form (Contact Form 7). */
    newsletter: { title: string; text: string };
    topicsTitle: string;
    topics: { label: string; search: string }[];
  };
}

/** Call-back form on the Contact Us banner; fields, labels and endpoint come from Contact Form 7. */
export interface ContactFormContent {
  title: string;
  subtitle: string;
  cf7: Cf7Form;
  /** Empty hides the WhatsApp button. */
  whatsappButton: string;
  privacy: string;
}

/** `contact` on Contact Us: banner with call / WhatsApp / email cards and the call-back form. */
export interface ContactHeroSection {
  breadcrumb: string;
  title: RichText;
  lead: string;
  callLabel: string;
  whatsappLabel: string;
  emailLabel: string;
  form: ContactFormContent;
}

/** `contact_info`: address (from site info), timings and the emergency line. */
export interface ContactInfoSection {
  address: { title: string; buttonLabel: string; href: string };
  timings: { title: string; rows: { label: string; value: string; highlight: boolean }[] };
  emergency: { title: string; text: string };
}

/** `directions`: route buttons to Google Maps beside the map. */
export interface DirectionsSection extends SectionHeading {
  routes: { label: string; note: string; button: string; href: string }[];
  landmark: string;
}

/** `image_text`: photo beside a checklist with a button (e.g. "first consultation"). */
export interface ImageTextSection {
  title: RichText;
  lead: string;
  items: string[];
  image?: ImageAsset;
  primaryCta: Cta;
  callLabel: string;
}

/**
 * One WordPress section (`acf_fc_layout`) mapped for its component. Every
 * layout may appear on any page; pages render them in the CMS order.
 */
export type PageSection =
  | { layout: "page_hero"; data: PageHeroSection }
  /* `page_hero` variants, picked from the fields the editor filled. */
  | { layout: "gallery_hero"; data: GalleryHeroSection }
  | { layout: "blog_hero"; data: BlogHeroSection }
  | { layout: "gallery"; data: GallerySection }
  | { layout: "highlights"; data: HighlightItem[] }
  | { layout: "blog_list"; data: BlogListSection }
  /* `contact` with a breadcrumb: the Contact Us banner (without one: the Home booking section). */
  | { layout: "contact_hero"; data: ContactHeroSection }
  | { layout: "contact_info"; data: ContactInfoSection }
  | { layout: "directions"; data: DirectionsSection }
  | { layout: "image_text"; data: ImageTextSection }
  | { layout: "social_links"; data: { title: string; links: SocialLink[] } }
  | { layout: "stats"; data: StatItem[] }
  | { layout: "story"; data: StorySection }
  | { layout: "values"; data: ValuesSection }
  | { layout: "doctor_profile"; data: DoctorProfileSection }
  | { layout: "medical_team"; data: MedicalTeamSection }
  | { layout: "facilities"; data: InfrastructureSection }
  | { layout: "home_facilities"; data: FacilitiesSection }
  | { layout: "recognition"; data: RecognitionSection }
  | { layout: "reviews"; data: ReviewsSection }
  | { layout: "location"; data: LocationSection }
  | { layout: "cta"; data: CtaBand }
  | { layout: "hero"; data: { hero: HeroSection; marquee: string[] } }
  | { layout: "treatments"; data: TreatmentsSection }
  | { layout: "about"; data: AboutSection }
  | { layout: "doctor"; data: DoctorSection }
  | { layout: "journey"; data: JourneySection }
  | { layout: "gynecology"; data: GynecologySection }
  | { layout: "why_choose"; data: WhyChooseUsSection }
  | { layout: "news"; data: SuccessStoriesSection }
  | { layout: "latest_blog"; data: BlogSection }
  | { layout: "faq"; data: FaqSection }
  | { layout: "contact"; data: BookingSection };

export type PageSectionLayout = PageSection["layout"];

/** A WordPress page built from sections (About, Success Stories, Blogs, Contact Us, and any page added later). */
export interface PageContent {
  id: number;
  slug: string;
  title: string;
  seo: Seo;
  schema: JsonLdData;
  sections: PageSection[];
}

// ─── Doctor profile ─────────────────────────────────────────────────────────

export interface DoctorProfile {
  slug: string;
  seo: Seo;
  schema: JsonLdData;
  name: string;
  role: string;
  qualifications: string;
  /** Short intro (WordPress `short_intro`), used in the article author box. */
  intro: string;
  phone?: string;
  email?: string;
  social?: SocialLink[];
  /** Card photo (`photo`): author box, schema. */
  image: ImageAsset;
  /** Profile page photo: `page_photo`, else `photo`. */
  pageImage: ImageAsset;
  /** Profile page role: `page_role`, else `role`. */
  pageRole: string;
  /** Badge under the profile photo. */
  photoBadge: string;
  /** Tick list (`highlights`). */
  chips: string[];
  rating: { value: string; label: string };
  registration: string;
  /** Hero buttons; call / WhatsApp links come from the site settings. */
  primaryCta: Cta;
  callLabel: string;
  whatsappLabel: string;
  facts: { label: string; value: string }[];
  /** `html` is the WordPress editor output. */
  about: { title: string; html: string };
  expertise: SectionHeading & { items: { icon: IconName; title: string; text: string; href: string }[] };
  education: { title: string; items: TimelineItem[] };
  experience: { title: string; items: TimelineItem[] };
  certificates: { title: string; items: PhotoItem[] };
  booking: {
    title: string;
    subtitle: string;
    opd: { label: string; value: string }[];
    fee: { label: string; value: string };
    primaryCta: Cta;
    callLabel: string;
    whatsappLabel: string;
    mapLabel: string;
  };
  /** Reviews · Location · CTA (`home_sections`), rendered by PageSections. */
  sections: PageSection[];
}

// ─── Success Stories (gallery) ──────────────────────────────────────────────

export interface GalleryPhoto {
  album: string;
  image: ImageAsset;
  title: string;
  note: string;
  tag: string;
}

export interface GalleryVideo {
  youtubeId: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  duration: string;
}

/** `gallery`: photo albums and video groups in two tabs. */
export interface GallerySection {
  photos: {
    tabLabel: string;
    hint: string;
    allLabel: string;
    albums: { key: string; label: string }[];
    items: GalleryPhoto[];
    visit: { title: string; text: string; directionsLabel: string; cta: Cta };
  };
  videos: {
    tabLabel: string;
    playlistLabel: string;
    allLabel: string;
    filters: { key: string; label: string }[];
    items: GalleryVideo[];
    credit: string;
    channel: Cta;
  };
}

/** `highlights`: icon cards ("Privacy first", …). */
export interface HighlightItem {
  icon: IconName;
  title: string;
  text: string;
}

// ─── Blog articles ──────────────────────────────────────────────────────────

/** Author box under an article: the WordPress doctor, with the design's stats / chips. */
export interface BlogAuthor {
  eyebrow: string;
  name: string;
  role: string;
  qualifications: string;
  image: ImageAsset;
  bio: string;
  stats: StatItem[];
  chips: string[];
  profile: Cta;
  book: Cta;
}

/** Fixed article labels (WordPress has no fields for them) and the author box / sidebar booking card. */
export interface ArticleSettings {
  article: {
    writtenBy: string;
    reviewedLabel: string;
    updatedLabel: string;
    tocTitle: string;
    faqTitle: string;
    disclaimer: string;
    feedbackQuestion: string;
    feedbackThanks: string;
    relatedTreatmentsTitle: string;
    related: { eyebrow: string; title: string; link: Cta };
    cta: CtaBand;
  };
  author: BlogAuthor;
  /** Booking button in the article sidebar. */
  book: Cta;
}
