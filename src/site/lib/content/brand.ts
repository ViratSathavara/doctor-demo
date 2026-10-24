import { hospital } from "@config/hospital";

/**
 * Turns `{{token}}` placeholders in content/*.json into values from
 * src/config/hospital.ts, so one config edit rebrands every page.
 */
const h = hospital;
const plus = (value: string) => value.trim().replace(/\s+/g, "+");
const enc = encodeURIComponent;

const values: Record<string, string> = {
  name: h.name,
  shortName: h.shortName,
  hospitalName: h.hospitalName,
  legalName: h.legalName,
  slugName: h.shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  tagline: h.tagline,
  logo: h.logo,
  siteUrl: h.siteUrl.replace(/\/+$/, ""),
  noindex: String(h.noindex),
  city: h.city,
  cityPlus: plus(h.city),
  region: h.region,
  area: h.area,
  nearbyTown: h.nearbyTown,
  nearbyTown2: h.nearbyTown2,
  nearbyTownPlus: plus(h.nearbyTown),
  landmark: h.landmark,
  landmarkLine: `On ${h.area} Road, ${h.landmark}`,
  address: h.address,
  addressShort: h.addressShort,
  phone: h.phone,
  phoneHref: h.phoneHref,
  whatsappNumber: h.whatsappNumber,
  email: h.email,
  hours: h.hours,
  languages: h.languages,
  languagesShort: h.languagesShort,
  foundedYear: String(h.foundedYear),
  year: String(new Date().getFullYear()),
  mapQuery: plus(h.mapQuery),
  mapSearch: plus(`${h.name} ${h.area} ${h.city}`),
  mapDest: enc(`${h.name}, ${h.address}`),
  "wordmark.line1": h.wordmark.line1,
  "wordmark.line2": h.wordmark.line2,
  "doctor.name": h.doctor.name,
  "doctor.nameBare": h.doctor.name.replace(/^Dr\.?\s+/i, ""),
  "doctor.first": h.doctor.first,
  "doctor.slug": h.doctor.slug,
  "doctor.qualifications": h.doctor.qualifications,
  "doctor.registration": h.doctor.registration,
  "doctor.photo": h.doctor.photo,
  "doctor.photoDesk": h.doctor.photoDesk,
  "team.embryologist": h.team.embryologist,
  "team.anaesthetist": h.team.anaesthetist,
  "team.medicalOfficer": h.team.medicalOfficer,
  "social.facebook": h.social.facebook,
  "social.instagram": h.social.instagram,
  "social.youtube": h.social.youtube,
};

const TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;

function resolve(value: string): unknown {
  const replaced = value.replace(TOKEN, (match, key: string) => values[key] ?? match);
  // `"{{noindex}}"` style booleans keep their type.
  return replaced === "true" ? (value === "{{noindex}}" ? true : replaced) : replaced === "false" ? (value === "{{noindex}}" ? false : replaced) : replaced;
}

export function applyBrand<T>(data: T): T {
  if (typeof data === "string") return resolve(data) as T;
  if (Array.isArray(data)) return data.map(applyBrand) as T;
  if (data && typeof data === "object") {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, applyBrand(value)])) as T;
  }
  return data;
}
