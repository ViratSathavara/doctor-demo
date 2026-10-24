import "server-only";
import sanitizeHtml from "sanitize-html";
import type { Maybe } from "./types";
import { plain, text, toSiteHref } from "./acf";

/**
 * Rich-text CMS fields (descriptions, FAQ answers, notes…). With the backend
 * switch `ivf_rich_text_output` ON they arrive as an HTML string, with it OFF
 * (or when never edited) as plain text. `rich()` sanitizes the HTML once, on
 * the server, and rewrites every link to a site path; <RichText> prints it.
 * Short fields (titles, badges, labels, button texts) stay on `text()`.
 */

const ALLOWED_TAGS = ["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "a", "blockquote", "h3", "h4"];

const isHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);
const isExternal = (href: string) => /^(https?:)?\/\//i.test(href);

/** Sanitized HTML, or the plain text untouched (RichText splits that into paragraphs). Empty → "". */
export function rich(value: Maybe<string>) {
  const src = text(value);
  if (!src || !isHtml(src)) return src;

  const clean = sanitizeHtml(src, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      // Internal links (backend URL, frontend URL or path) → site path, same tab.
      // Other websites open in a new tab.
      a: (tagName, attribs) => {
        if (!attribs.href) return { tagName, attribs: {} };
        const rawHref = attribs.href.trim();
        // WordPress also permits relative paths. Resolve those at the site root
        // so they remain Next links on nested pages instead of disappearing.
        const href = toSiteHref(/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(rawHref) ? rawHref : `/${rawHref}`);
        const link: Record<string, string> = { href };
        if (attribs.title) link.title = attribs.title;
        if (isExternal(href)) Object.assign(link, { target: "_blank", rel: "noopener noreferrer" });
        return { tagName, attribs: link };
      },
    },
  }).trim();

  return plain(clean) ? clean : "";
}
