import { hospital } from "@config/hospital";
import { isIconName, type IconName } from "@site/components/common/icon";
import { withBasePath, withoutBasePath } from "@site/lib/utils/base-path";
import type { Cta, ImageAsset, Tone } from "@site/types/content";
import type { Maybe, WpImage, WpLink } from "./types";

/**
 * Small, forgiving readers for ACF values. ACF returns `false`, `null` or ""
 * for empty fields, so every mapper goes through these instead of trusting
 * the raw JSON.
 */

export function text(value: Maybe<string | number>, fallback = "") {
  if (typeof value === "number") return String(value);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function num(value: Maybe<string | number>, fallback = 0) {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

export function list<T>(value: Maybe<T[]>): T[] {
  return Array.isArray(value) ? value.filter((item) => item != null) : [];
}

/** ACF repeater of `{ text }` rows → plain strings. */
export function texts(value: Maybe<{ text?: Maybe<string> }[]>) {
  return list(value)
    .map((row) => text(row.text))
    .filter(Boolean);
}

/** This site's hosts: links to them become local paths. */
function localHosts() {
  const hosts = new Set(["localhost", "127.0.0.1", new URL(hospital.siteUrl).hostname]);
  for (const value of [process.env.NEXT_PUBLIC_SITE_URL, process.env.CMS_API_BASE]) {
    if (!value) continue;
    try {
      hosts.add(new URL(value).hostname);
    } catch {
      /* ignore an unparsable URL */
    }
  }
  // Editors type full front-end URLs (e.g. https://ivf-website-ten.vercel.app/katyayani#book).
  for (const host of (process.env.CMS_LINK_HOSTS ?? "").split(",")) {
    if (host.trim()) hosts.add(host.trim().toLowerCase());
  }
  return hosts;
}

/** Keep tel/mailto/hash/external links; turn this site's (or the CMS's) absolute URLs into paths. */
export function toSiteHref(url: Maybe<string>) {
  const value = text(url);
  if (!value) return "";
  // Editors may type root paths with the project folder ("/katyayani/about"); site paths never carry it.
  if (value.startsWith("/") && !value.startsWith("//")) return withoutBasePath(value);
  if (/^(#|tel:|mailto:)/.test(value)) return value;
  try {
    const parsed = new URL(value.startsWith("//") ? `https:${value}` : value);
    if (localHosts().has(parsed.hostname)) {
      return withoutBasePath(`${parsed.pathname}${parsed.search}${parsed.hash}`) || "/";
    }
  } catch {
    return value;
  }
  return value;
}

/** ACF link field (`{ title, url, target }`). */
export function link(value: Maybe<WpLink>, fallbackLabel = ""): Cta {
  const raw = value || {};
  return {
    label: text(raw.title, fallbackLabel),
    href: toSiteHref(raw.url) || "#",
    target: text(raw.target) || undefined,
  };
}

/**
 * Label + plain URL string (the `*_text` / `*_link` field pairs). An empty URL
 * renders as "#"; links that stay external open in a new tab.
 */
export function cta(label: Maybe<string>, url: Maybe<string>, fallbackLabel = ""): Cta {
  const href = toSiteHref(url) || "#";
  return { label: text(label, fallbackLabel), href, target: /^https?:\/\//.test(href) ? "_blank" : undefined };
}

/** CMS titles mark accent words with *stars*; RichTitle renders <em>. */
export function highlight(value: Maybe<string>) {
  return text(value).replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

/** "Dr. Jane Doe" → "JD". */
export function initials(name: string) {
  return name
    .replace(/^dr\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

/** ACF image field (return format "array") or a WP media object. */
export function image(value: Maybe<WpImage>, fallbackAlt = ""): ImageAsset | undefined {
  if (!value || !value.url) return undefined;
  return {
    src: withBasePath(value.url),
    alt: text(value.alt, fallbackAlt),
    width: value.width || undefined,
    height: value.height || undefined,
  };
}

/** Like image(), but always returns an asset (empty src when missing). */
export function requiredImage(value: Maybe<WpImage>, fallbackAlt = ""): ImageAsset {
  return image(value, fallbackAlt) ?? { src: "", alt: fallbackAlt };
}

export function icon(value: Maybe<string>, fallback: IconName): IconName {
  return isIconName(value) ? value : fallback;
}

export function tone(value: Maybe<string>, fallback: Tone = "primary"): Tone {
  return value === "primary" || value === "accent" || value === "amber" ? value : fallback;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/**
 * WordPress `rendered` strings and rich-text fields → plain text (tags stripped,
 * entities decoded, whitespace collapsed). Use it wherever a rich field leaves
 * the page body: meta, alt, aria-label, JSON-LD, line-clamped captions.
 */
export function plain(rendered: Maybe<string>) {
  return text(rendered)
    .replace(/<\/(p|li|h[1-6]|blockquote)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}
