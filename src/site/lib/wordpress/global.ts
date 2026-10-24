import "server-only";
import type { FooterContent, GlobalContent, GlobalSeo, MegaMenuKey, SocialLink } from "@site/types/content";
import { cta, icon, list, requiredImage, text, texts, toSiteHref } from "./acf";
import { mapCf7Form } from "./cf7";
import { wpFetch } from "./client";
import { rich } from "./rich";
import type { Maybe, WpGlobal } from "./types";

/** Custom route registered by the site WP plugin (site info, header, footer). */
export const GLOBAL_ROUTE = "/ivf/v1/global";

const SOCIAL_PLATFORMS: SocialLink["platform"][] = ["instagram", "youtube", "facebook", "whatsapp", "linkedin"];




const megaKey = (value: unknown): MegaMenuKey | undefined =>
  value === "treatments" || value === "doctors" ? value : undefined;

/**
 * Site info, top bar, header and mega menus — only from the live
 * /ivf/v1/global response. Empty CMS fields stay empty (no dummy fallbacks).
 */
export function mapGlobal(data: WpGlobal): Omit<GlobalContent, "footer" | "seo"> {
  const site = data.site || {};
  const header = data.header || {};
  const treatments = header.mega_treatments || {};
  const promo = treatments.promo || {};
  const doctors = header.mega_doctors || {};
  const doctor = doctors.doctor || {};
  const name = text(site.name);
  const phone = text(site.phone);
  const phoneHref = text(site.phone_href) || "#";
  const whatsappHref = text(site.whatsapp_link);
  const hours = text(site.hours);

  return {
    site: {
      name,
      logo: requiredImage(site.logo, name),
      phone,
      phoneHref,
      whatsappHref,
      email: text(site.email),
      emailHref: text(site.email_href) || (text(site.email) ? `mailto:${text(site.email)}` : "#"),
      address: text(site.address),
      hours,
      mapEmbedUrl: text(site.map_embed_url),
      mapLinkUrl: text(site.map_link),
    },
    announcement: {
      tag: text(header.announcement_badge),
      text: text(header.announcement_text),
      link: text(header.announcement_link_text)
        ? cta(header.announcement_link_text, header.announcement_link)
        : undefined,
      hours,
    },
    header: {
      backLink: cta(header.back_link_text, header.back_link),
      brand: {
        logo: requiredImage(header.logo, name),
        name: text(header.brand_name),
        tagline: text(header.brand_tagline),
      },
      phoneLabel: text(header.phone_label),
      cta: cta(header.appointment_text, header.appointment_link),
      menu: list(header.menu && header.menu.items)
        .filter((item) => text(item.title))
        .map((item) => ({
          label: text(item.title),
          href: toSiteHref(item.url) || "#",
          mega: megaKey(item.mega),
          target: text(item.target) || undefined,
        }))
        // A plain item linking nowhere ("#", e.g. a removed page) is hidden; mega items open their menu instead.
        .filter((item) => item.mega || item.href !== "#"),
      mega: {
        treatments: {
          columns: list(treatments.columns).map((column) => ({
            title: text(column.title),
            icon: icon(column.icon, "flask"),
            links: list(column.links)
              .filter((row) => text(row.label))
              .map((row) => ({
                label: text(row.label),
                href: toSiteHref(row.link) || "#",
                badge: text(row.badge) || undefined,
              })),
          })),
          promo: {
            eyebrow: text(promo.eyebrow),
            title: text(promo.title),
            text: text(promo.text),
            cta: cta(promo.button_text, promo.button_link),
          },
          footerNote: text(treatments.footer_note),
          footerLinks: list(treatments.footer_links)
            .filter((row) => text(row.label))
            .map((row) => cta(row.label, row.href)),
        },
        doctors: {
          doctor: {
            eyebrow: text(doctors.eyebrow),
            name: text(doctor.name),
            role: text(doctor.role),
            qualifications: text(doctor.qualifications),
            image: requiredImage(doctor.photo, text(doctor.name)),
            chips: texts(doctors.chips),
            primaryCta: cta(doctors.primary_text, doctors.primary_link),
            secondaryCta: cta(doctors.secondary_text, doctors.secondary_link),
          },
          checklist: {
            title: text(doctors.checklist_title),
            links: list(doctors.checklist_links)
              .filter((row) => text(row.label))
              .map((row) => ({ ...cta(row.label, row.link), href: toSiteHref(row.link) })),
          },
          team: {
            title: text(doctors.team_title),
            members: list(doctors.team_members)
              .filter((member) => text(member.name))
              .map((member) => ({
                name: text(member.name),
                note: text(member.note),
                href: toSiteHref(member.link) || "#",
              })),
          },
          opd: { label: text(doctors.opd_label), value: hours },
        },
      },
    },
    // No CMS fields for the floating buttons: labels in code, links from `site`.
    floating: {
      whatsapp: { label: "Chat on WhatsApp", href: whatsappHref || "#", target: "_blank" },
      call: { label: `Call ${phone}`, href: phoneHref },
    },
  };
}

/** Social icon from the row's label ("Instagram" → instagram); unknown labels are skipped. */
const socialPlatform = (label: string) => SOCIAL_PLATFORMS.find((platform) => label.toLowerCase().includes(platform));

/** Social rows ({ label, link }) → links with an icon; rows with an unknown platform are skipped. */
export function socialLinks(rows: Maybe<{ label?: Maybe<string>; link?: Maybe<string> }[]>): SocialLink[] {
  return list(rows).flatMap((row) => {
    const label = text(row.label);
    const platform = socialPlatform(label);
    return platform ? [{ platform, label, href: toSiteHref(row.link) || "#" }] : [];
  });
}

/** Use the external host when a credit label is missing; malformed URLs never crash the footer. */
function creditHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

/** Footer settings. Missing bottom-bar URLs stay empty so their labels render as plain text. */
export function mapFooter(data: WpGlobal): FooterContent {
  const footer = data.footer || {};
  const creditUrl = text(footer.credit_link);
  const form = mapCf7Form(footer.newsletter_form);
  const email = form?.fields.find((field) => field.type === "email");
  return {
    newsletter: {
      title: text(footer.newsletter_title),
      text: text(footer.newsletter_text),
      placeholder: email?.placeholder ?? "",
      button: form?.submitLabel ?? "",
      form,
    },
    tagline: text(footer.tagline),
    social: socialLinks(footer.social),
    columns: list(footer.menu_columns)
      .filter((column) => column.show !== false)
      .map((column) => ({
        heading: text(column.heading),
        links: list(column.menu && column.menu.items)
          .filter((item) => text(item.title))
          .map((item) => ({
            label: text(item.title),
            href: toSiteHref(item.url) || "#",
            target: text(item.target) || undefined,
          })),
      })),
    copyright: text(footer.copyright),
    legalLinks: list(footer.legal_links)
      .filter((row) => text(row.label))
      .map((row) => ({ ...cta(row.label, row.link), href: toSiteHref(row.link) })),
    disclaimer: rich(footer.disclaimer),
    credit: {
      text: text(footer.credit),
      link: { label: text(footer.credit_link_text) || creditHost(creditUrl), href: creditUrl, target: "_blank" },
      rel: text(footer.credit_rel) === "nofollow" ? "nofollow" : "follow",
    },
  };
}

/** Whole-site switch and share-image default. A missing answer keeps the site hidden. */
export function mapGlobalSeo(data: WpGlobal): GlobalSeo {
  const seo = data.seo || {};
  const image = seo.default_share_image;
  return {
    siteNoindex: seo.site_noindex !== false,
    publicBase: text(seo.public_base) || undefined,
    defaultShareImage: image && text(image.url) ? { url: text(image.url), width: image.width || undefined, height: image.height || undefined } : undefined,
  };
}

/** Site settings, header and footer. Throws if the response is unusable. */
export async function fetchGlobal(): Promise<GlobalContent> {
  const data = await wpFetch<WpGlobal>(GLOBAL_ROUTE, {}, ["global"]);
  if (!data || typeof data !== "object" || !data.site || !data.header) {
    throw new Error(`WordPress ${GLOBAL_ROUTE} response has no site or header settings`);
  }
  return { ...mapGlobal(data), footer: mapFooter(data), seo: mapGlobalSeo(data) };
}
