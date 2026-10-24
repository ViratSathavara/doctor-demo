# IVF Hospital Template (white-label)

કોઈ પણ IVF / Fertility હોસ્પિટલ માટે તૈયાર વેબસાઇટ. હોસ્પિટલ બદલવા માટે ફક્ત 3 જગ્યાએ ફેરફાર કરવો પડે છે.
A ready-made website for any IVF / fertility hospital. Re-branding means editing three places only.

## ચલાવવા માટે (Run)

```bash
npm install
npm run dev:next      # http://localhost:3000
npm run build && npm start
```

## નવી હોસ્પિટલ માટે સેટઅપ (Re-brand in 3 steps)

1. **`src/config/hospital.ts`** — નામ, ડૉક્ટર, ફોન, ઇમેઇલ, સરનામું, શહેર, સમય, ભાષાઓ, social links, અને **બે રંગ** (`theme.primary`, `theme.accent`). આખી સાઇટનો કલર થીમ આ બે રંગથી આપોઆપ બને છે.
2. **`public/images/`** — `brand/logo.svg` (લોગો), `doctors/doctor-lead*.svg` (ડૉક્ટરનો ફોટો; આ જ ફાઇલનામે JPG મૂકી config માં path બદલો), `src/app/icon.png` અને `apple-icon.png` (favicon).
3. **`content/*.json`** — પેજનું લખાણ. `{{name}}`, `{{doctor.name}}`, `{{city}}` જેવા tokens config માંથી ભરાય છે. નવા doctors માટે `content/doctors.json`, blog માટે `content/posts.json`.

જાણવા જેવું:
- `siteUrl` સાચું મૂકો અને `noindex: false` કરો ત્યારે જ Google index કરશે (demo માં `true` છે).
- `public/images/about|facilities|gallery/*.svg` generic illustrations છે; `about/*.svg` માં હોસ્પિટલનું નામ લખેલું છે, તે બદલો અથવા અસલી ફોટા મૂકો.
- `stock/` અને `blog/` ના ફોટા demo stock છે; live કરતા પહેલાં તમારા અસલી ફોટા કે licensed ફોટા મૂકો.
- Reviews, awards, registration numbers, ડૉક્ટરની વિગતો **sample** છે. ખોટા દાવા ન થાય તે માટે live કરતા પહેલાં અસલી માહિતી ભરો.
- News videos ના section કાઢી નાખ્યા છે (મૂળ સાઇટના અસલી વીડિયો હતા). પોતાના YouTube વીડિયો `content/pages.json` માં `news` section અને gallery `video_groups` માં ઉમેરી શકો.

## Optional: WordPress CMS

`.env.local` માં `CMS_API_BASE` મૂકો તો content live WordPress માંથી આવશે (સમાન ACF field layout). ન મૂકો તો `content/` ની ફાઇલો વપરાશે.

## Structure

```
src/config/hospital.ts   brand + contact + colours (single source of truth)
content/*.json           page, post, doctor, header/footer text (tokens)
src/app                  routes (Next.js App Router), globals.css (theme)
src/site/components      UI sections (hero, treatments, doctor, journey, FAQ, reviews, forms...)
src/site/lib             content loader, SEO, WordPress mappers, brand token resolver
public/images            logo, doctor, facility, stock and blog images
```
