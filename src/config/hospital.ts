/**
 * THE one file to edit when this template is handed to a new hospital.
 *
 * - Every `{{token}}` in content/*.json is replaced with a value from here
 *   (see src/site/lib/content/brand.ts), so names, doctor, city, contact details
 *   and links change everywhere at once.
 * - `theme.primary` and `theme.accent` re-colour the whole site (src/app/layout.tsx
 *   injects them as CSS variables; every other shade is derived in globals.css).
 * - Logo / doctor / hero photos live in public/images (paths below).
 *
 * Nothing here is a real hospital: replace every value before going live.
 */
export const hospital = {
  /** Brand */
  name: "Aasha IVF & Fertility Centre",
  shortName: "Aasha IVF",
  hospitalName: "Aasha Hospital",
  legalName: "Aasha Hospital & Diagnosis Centre",
  /** Two-line wordmark in the header: LINE 1 big, LINE 2 small. */
  wordmark: { line1: "AASHA", line2: "IVF CENTRE" },
  foundedYear: 2015,
  tagline: "Compassionate, honest fertility care",
  logo: "/images/brand/logo.svg",
  /** Keep true while the site is a demo; set false to allow Google to index it. */
  noindex: true,
  siteUrl: "https://aashaivf.example",

  /** Colours: the whole palette is derived from these two. */
  theme: {
    primary: "#1d4e89",
    accent: "#d14a32",
  },

  /** Location and contact */
  city: "Ahmedabad",
  region: "Gujarat",
  area: "Satellite",
  nearbyTown: "Gandhinagar",
  nearbyTown2: "Mehsana",
  landmark: "next to City Centre Mall",
  address: "101, Wellness Plaza, Satellite Road, Ahmedabad, Gujarat 380015",
  addressShort: "Wellness Plaza, Satellite Road, Ahmedabad",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  whatsappNumber: "919876543210",
  email: "hello@aashaivf.example",
  hours: "Mon–Sat · 10:00 AM – 6:00 PM",
  languages: "Gujarati, Hindi & English",
  languagesShort: "Guj · Hin · Eng",
  mapQuery: "Satellite Road, Ahmedabad, Gujarat 380015",

  /** Social (leave "" to hide) */
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },

  /** Lead doctor (more doctors: add entries to content/doctors.json) */
  doctor: {
    name: "Dr. Ananya Mehta",
    first: "Ananya",
    slug: "dr-ananya-mehta",
    qualifications: "MBBS, MS (Obstetrics & Gynaecology), Fellowship in Reproductive Medicine",
    registration: "Gujarat Medical Council Reg. No. G-00000",
    photo: "/images/doctors/doctor-lead.svg",
    photoDesk: "/images/doctors/doctor-lead-desk.svg",
  },
  /** Sample team (shown on the About page) */
  team: {
    embryologist: "Dr. Meera Joshi",
    anaesthetist: "Dr. Rohan Shah",
    medicalOfficer: "Dr. Kabir Desai",
  },
} as const;

export type Hospital = typeof hospital;
