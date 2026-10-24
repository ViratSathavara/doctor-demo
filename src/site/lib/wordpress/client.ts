import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { applyBrand } from "@site/lib/content/brand";

/**
 * Content source. By default the site reads the WordPress-shaped JSON files in
 * /content (tokens filled from src/config/hospital.ts). Set CMS_API_BASE to read
 * a live WordPress backend with the same field layout instead.
 *
 * REST API root from CMS_API_BASE. Both WordPress URL styles work,
 * because routes are simply appended to the root:
 *   pretty permalinks  https://cms.example.com/wp-json            → …/wp-json/wp/v2/posts
 *   plain permalinks   https://cms.example.com/index.php?rest_route= → …?rest_route=/wp/v2/posts
 */
const API_ROOT = (process.env.CMS_API_BASE || "").trim().replace(/\/+$/, "");
const REVALIDATE = Number(process.env.CMS_REVALIDATE ?? 300);
const TIMEOUT_MS = Number(process.env.CMS_TIMEOUT_MS ?? 8000);


type Params = Record<string, string | number | boolean | undefined>;

export function isWordPressConfigured() {
  return API_ROOT.length > 0;
}

/** Full URL for a REST route such as "/ivf/v1/home" or "/wp/v2/posts". */
export function wpUrl(route: string, params: Params = {}) {
  if (!API_ROOT) throw new Error("CMS_API_BASE must be set during build and at runtime");
  const url = new URL(API_ROOT);
  if (url.searchParams.has("rest_route")) {
    url.searchParams.set("rest_route", `/${route.replace(/^\/+/, "")}`);
  } else {
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/${route.replace(/^\/+/, "")}`;
  }
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url;
}

type Item = Record<string, unknown> & { id?: number; slug?: string; parent?: number };
const files = new Map<string, unknown>();

function localFile(name: string): unknown {
  if (!files.has(name)) {
    const raw = JSON.parse(readFileSync(path.join(process.cwd(), "content", `${name}.json`), "utf8"));
    files.set(name, applyBrand(raw));
  }
  return files.get(name);
}

/** Answers the few WordPress REST routes the mappers use from /content/*.json. */
function localFetch(route: string, params: Params): unknown {
  const clean = route.replace(/\/+$/, "");
  if (clean === "/ivf/v1/global") return localFile("global");
  const byId = clean.match(/^\/wp\/v2\/pages\/(\d+)$/);
  if (byId) return (localFile("pages") as Item[]).find((item) => item.id === Number(byId[1])) ?? null;
  const source = { "/wp/v2/pages": "pages", "/wp/v2/posts": "posts", "/wp/v2/doctors": "doctors" }[clean];
  if (!source) throw new Error(`No local content for ${route}`);
  let items = localFile(source) as Item[];
  if (params.slug !== undefined) items = items.filter((item) => item.slug === params.slug);
  if (source === "pages" && params.parent !== undefined) items = items.filter((item) => (item.parent ?? 0) === Number(params.parent));
  return items;
}

/** Cached, time-limited GET. Throws on network errors, timeouts and non-2xx. */
export async function wpRequest(route: string, params: Params = {}, tags: string[] = []) {
  const url = wpUrl(route, params);
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // revalidateTag("wp-site") refreshes every WordPress read at once.
    next: { revalidate: REVALIDATE, tags: ["wp", "wordpress", "wp-site", ...tags] },
  });
  if (!res.ok) throw new Error(`WordPress ${res.status} for ${route}`);
  return res;
}

/** JSON from a WordPress route (cached, see wpRequest). */
export async function wpFetch<T>(route: string, params: Params = {}, tags: string[] = []): Promise<T> {
  if (!API_ROOT) return localFetch(route, params) as T;
  const res = await wpRequest(route, params, tags);
  return await res.json() as T;
}

/** Traverse WP pagination instead of silently dropping entries after the first 100. */
export async function wpCollection<T>(route: string, params: Params = {}, tags: string[] = []): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const batch = await wpFetch<T[]>(route, { ...params, per_page: 100, page }, tags);
    if (!Array.isArray(batch)) throw new Error("Invalid WordPress collection: " + route);
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}
// reload

