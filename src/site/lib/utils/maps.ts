/**
 * Google Maps embed that pins one place: searching the clinic's name + full
 * address makes Google drop its red marker on the place, at street zoom.
 * `view`: "m" = map, "k" = satellite.
 */
export function placeEmbedUrl(query: string, view: "m" | "k" = "m") {
  const url = new URL("https://www.google.com/maps");
  url.searchParams.set("q", query);
  url.searchParams.set("z", "17");
  url.searchParams.set("t", view);
  url.searchParams.set("output", "embed");
  return url.toString();
}

/** "Aasha IVF Centre, 101 Wellness Plaza, …" from the site settings. */
export function placeQuery(site: { name: string; address: string }) {
  return [site.name, site.address].filter(Boolean).join(", ");
}
