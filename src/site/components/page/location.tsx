import Image from "next/image";
import type { LocationSection, SiteSettings } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichTitle } from "@site/components/common/rich-title";
import { buttonClass, DecoRing, Eyebrow, h2Class } from "@site/components/common/ui";
import { placeQuery } from "@site/lib/utils/maps";
import { MapFrame } from "./map-frame";

const label = "text-[12.5px] font-extrabold tracking-[.16em] text-accent-700 uppercase";

/**
 * Full-width "Find us" band: map (Map / Satellite) filling the left half;
 * address, phone, areas, access facts and directions on the right. Address,
 * phone and map come from the site settings; the rest from the page's location block.
 */
export function Location({ data, site }: { data: LocationSection; site: SiteSettings }) {
  return (
    <section id="location" className="grid border-y border-line bg-white lg:grid-cols-2">
      {site.address ? (
        <MapFrame
          query={placeQuery(site)}
          title={`Map – ${site.name}`}
          className="min-h-[360px] lg:min-h-full"
        />
      ) : null}

      <div className="relative isolate overflow-hidden">
        {/* Soft decoration in the top-right corner. */}
        <span className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-tint-200 blur-2xl" aria-hidden />
        <DecoRing className="top-20 -right-10 -z-10 size-40 border-dashed" color="border-primary/20" />

        <Reveal className="flex max-w-[680px] flex-col gap-6 px-4 py-12 md:px-12 md:py-16 xl:px-16 xl:py-20">
          <div className="flex flex-col gap-3">
            {data.eyebrow ? <Eyebrow className="before:hidden">{data.eyebrow}</Eyebrow> : null}
            <h2 className={h2Class()}>
              <RichTitle text={data.title} />
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <address className="flex items-start gap-4 text-[16px] leading-[1.55] text-muted not-italic">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tint-200 text-primary">
                <Icon name="map-pin" size={21} />
              </span>
              <span>
                <b className="block text-[18px] text-heading">{site.name}</b>
                {site.address}
              </span>
            </address>
            {site.phone ? (
              <a href={site.phoneHref} className="flex items-center gap-4 text-[20px] font-extrabold text-primary hover:underline">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tint-200 text-primary">
                  <Icon name="phone" size={20} strokeWidth={2} />
                </span>
                {site.phone}
              </a>
            ) : null}
          </div>

          {data.areas.length ? (
            <div className="flex flex-col gap-3">
              {data.areasTitle ? <h3 className={`font-sans ${label}`}>{data.areasTitle}</h3> : null}
              <div className="flex flex-wrap gap-2">
                {data.areas.map((area) => (
                  <span key={area} className="rounded-full bg-tint-200 px-4 py-2 text-[14px] font-bold text-heading">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {data.features.length ? (
            <div className="grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
              {data.features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-700">
                    <Icon name={feature.icon} size={20} />
                  </span>
                  <span>
                    <b className="block text-[14.5px] text-heading">{feature.title}</b>
                    <span className="text-[12.5px] leading-[1.45] text-muted">{feature.text}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {data.notes.length ? (
            <ul className="flex flex-col gap-2">
              {data.notes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-[15.5px] text-body-soft">
                  <Icon name="check" size={18} strokeWidth={2.6} className="mt-0.5 shrink-0 text-accent-700" />
                  {note}
                </li>
              ))}
            </ul>
          ) : null}

          {data.directionsLabel && site.mapLinkUrl ? (
            <a href={site.mapLinkUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "self-start")}>
              <Icon name="map-pin" size={18} />
              {data.directionsLabel}
              <Icon name="arrow-right" size={17} strokeWidth={2.2} />
            </a>
          ) : null}
        </Reveal>

        {data.image ? (
          <div className="pointer-events-none absolute -right-14 -bottom-14 -z-10 hidden size-[300px] overflow-hidden rounded-full border-[6px] border-white bg-accent-50 shadow-lg 2xl:block">
            <Image src={data.image.src} alt={data.image.alt} fill sizes="300px" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
