@AGENTS.md

White-label IVF / fertility hospital website (Next.js 16, Tailwind v4, motion). One codebase, any hospital.

- Everything hospital-specific is in `src/config/hospital.ts` (name, doctor, contact, colours, logo paths). Page text is in `content/*.json` using `{{token}}` placeholders resolved by `src/site/lib/content/brand.ts`.
- Colours: only `theme.primary` and `theme.accent` are set; all shades derive from them in `src/app/globals.css` (Tailwind names: `primary-*`, `accent-*`, `tint-*`, `line*`).
- Routes: `src/app`, components and data mapping: `src/site` (alias `@site/*`), config alias `@config/*`, static files: `public/`.
- `content/*.json` mirrors WordPress REST/ACF shapes so a live CMS can be attached later via `CMS_API_BASE` (see `src/site/lib/wordpress/client.ts`); without it the local files are used.
