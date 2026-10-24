"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { GallerySection, SiteSettings } from "@site/types/content";
import { GlassTabs } from "@site/components/common/glass-tabs";
import { Icon } from "@site/components/common/icon";
import { Lightbox } from "@site/components/common/lightbox";
import { RichText } from "@site/components/common/rich-text";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container } from "@site/components/common/ui";
import { VideoPlayer } from "@site/components/sections/video-player";
import { cn } from "@site/lib/utils/cn";
import { youtubeId } from "@site/lib/utils/format";

const TABS = ["photos", "videos"] as const;
type Tab = (typeof TABS)[number];

const tabFromHash = (): Tab | null => {
  const hash = window.location.hash.slice(1);
  return (TABS as readonly string[]).includes(hash) ? (hash as Tab) : null;
};

/**
 * Photo / video gallery. The tab follows the URL hash (#photos, #videos), so
 * the hero buttons and shared links open the right one.
 */
export function GalleryTabs({ data, site }: { data: GallerySection; site: SiteSettings }) {
  const [tab, setTab] = useState<Tab>("photos");

  useEffect(() => {
    const sync = () => {
      const next = tabFromHash();
      if (next) setTab(next);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (index: number) => {
    const next = TABS[index];
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  };

  const tabs = [
    { key: "photos", label: <TabLabel icon="search" text={data.photos.tabLabel} count={data.photos.items.length} /> },
    { key: "videos", label: <TabLabel icon="play" text={data.videos.tabLabel} count={data.videos.items.length} /> },
  ];

  return (
    <section id="gallery" className="relative bg-white pb-19 md:pb-26">
      {/* Scroll targets for #photos / #videos, clear of the sticky header. */}
      <span id="photos" className="absolute top-0 scroll-mt-24" aria-hidden />
      <span id="videos" className="absolute top-0 scroll-mt-24" aria-hidden />
      <div className="sticky top-16 z-20 border-b border-line bg-white/90 py-3.5 backdrop-blur-md md:top-[72px]">
        <Container className="flex flex-wrap items-center justify-between gap-3">
          <GlassTabs items={tabs} value={TABS.indexOf(tab)} onChange={select} label="Gallery type" idPrefix="gallery" />
          {tab === "photos" && data.photos.hint ? (
            <span className="text-[13.5px] font-bold text-muted max-md:hidden">{data.photos.hint}</span>
          ) : null}
        </Container>
      </div>
      <div id="gallery-panel" role="tabpanel" aria-labelledby={`gallery-tab-${TABS.indexOf(tab)}`} className="pt-10 md:pt-14">
        {/* Keyed so each tab fades in when selected. */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "photos" ? <Photos data={data.photos} site={site} /> : <Videos data={data.videos} />}
        </motion.div>
      </div>
    </section>
  );
}

function TabLabel({ icon, text, count }: { icon: "search" | "play"; text: string; count: number }) {
  return (
    <span className="flex items-center gap-2">
      <Icon name={icon} size={15} strokeWidth={2.2} />
      {text}
      <span className="rounded-full bg-current/12 px-2 py-0.5 text-[12px] font-extrabold">{count}</span>
    </span>
  );
}

function Photos({ data, site }: { data: GallerySection["photos"]; site: SiteSettings }) {
  const albums = [
    { key: "all", label: data.allLabel, items: data.items },
    ...data.albums
      .map((album) => ({ ...album, items: data.items.filter((item) => item.album === album.key) }))
      .filter((album) => album.items.length),
  ];
  const [album, setAlbum] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const visible = albums.find((entry) => entry.key === album)?.items ?? data.items;

  return (
    <Container>
      <div className="mb-8 flex snap-x gap-3 overflow-x-auto pb-2" role="toolbar" aria-label="Photo albums">
        {albums.map((entry) => {
          const on = album === entry.key;
          const cover = entry.items[0]?.image;
          return (
            <button
              key={entry.key}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setAlbum(entry.key);
                setOpen(null);
              }}
              className={cn(
                "flex shrink-0 cursor-pointer snap-start items-center gap-3 rounded-[20px] border p-2 pr-5 text-left transition-[background-color,border-color,box-shadow] duration-200",
                on
                  ? "border-primary bg-linear-to-b from-primary to-primary-700 text-white shadow-primary"
                  : "border-line bg-white text-heading hover:border-primary/40 hover:bg-tint-50",
              )}
            >
              <span className="relative size-12 shrink-0 overflow-hidden rounded-[14px] bg-tint-200">
                {cover ? <Image src={cover.src} alt="" fill sizes="48px" className="object-cover" /> : null}
              </span>
              <span>
                <b className="block text-[14.5px] leading-tight">{entry.label}</b>
                <small className={cn("text-[12.5px]", on ? "text-on-primary" : "text-muted")}>
                  {entry.items.length} {entry.items.length === 1 ? "photo" : "photos"}
                </small>
              </span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.figure
              layout
              key={item.image.src + item.title}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="group relative m-0 mb-4 break-inside-avoid overflow-hidden rounded-lg bg-tint-100"
            >
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                aria-label={`View larger: ${item.title}`}
                onClick={() => setOpen(i)}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width ?? 800}
                  height={item.image.height ?? 600}
                  sizes="(min-width: 1101px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-600 group-hover:scale-105"
                />
              </button>
              <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-[16px] bg-white/94 px-4 py-3 backdrop-blur-md">
                <span className="min-w-0">
                  <b className="block font-display text-[16.5px] leading-[1.25] font-normal text-heading">{item.title}</b>
                  {item.note ? <small className="text-[12.5px] text-muted">{item.note}</small> : null}
                </span>
                {item.tag ? (
                  <span className="shrink-0 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-extrabold tracking-[.08em] text-accent-700 uppercase">
                    {item.tag}
                  </span>
                ) : null}
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      {data.visit.title ? (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-xl bg-tint-100 p-6 md:p-9">
          <div className="max-w-[560px]">
            <h3 className="text-[26px]">{data.visit.title}</h3>
            <RichText html={data.visit.text} className="rt mt-1.5 text-[15px] text-muted" />
          </div>
          <div className="flex flex-wrap gap-3">
            {data.visit.directionsLabel && site.mapLinkUrl ? (
              <a href={site.mapLinkUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("outline")}>
                <Icon name="map-pin" size={17} />
                {data.visit.directionsLabel}
              </a>
            ) : null}
            <SmartLink href={data.visit.cta.href} target={data.visit.cta.target} className={buttonClass("primary")}>
              {data.visit.cta.label}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </SmartLink>
          </div>
        </div>
      ) : null}

      <Lightbox
        items={visible.map((item) => ({ image: item.image, title: item.title, note: item.note }))}
        index={open}
        onChange={setOpen}
      />
    </Container>
  );
}

const TONES = ["bg-tint-200 text-primary", "bg-accent-50 text-accent-700", "bg-amber-50 text-amber"];

function Videos({ data }: { data: GallerySection["videos"] }) {
  const filters = [
    { key: "all", label: data.allLabel },
    ...data.filters.filter((filter) => data.items.some((item) => item.category === filter.key)),
  ];
  const [filter, setFilter] = useState(0);
  const [current, setCurrent] = useState(0);
  const active = filters[filter]?.key ?? "all";
  const list = data.items
    .map((video, index) => ({ video, index }))
    .filter(({ video }) => active === "all" || video.category === active);
  const video = data.items[current];
  const categoryIndex = (category: string) => Math.max(0, data.filters.findIndex((f) => f.key === category));

  if (!video) return null;

  return (
    <Container>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-md">
          <VideoPlayer key={current} id={video.youtubeId} label={`Play video: ${video.title}`} large />
          <div className="flex flex-col gap-2.5 p-6 md:p-8">
            {video.categoryLabel ? (
              <span className="text-[12px] font-extrabold tracking-[.16em] text-accent-700 uppercase">{video.categoryLabel}</span>
            ) : null}
            <h3 className="text-[clamp(22px,2.4vw,28px)]">{video.title}</h3>
            <RichText html={video.description} className="rt text-[15px] leading-[1.7] text-muted" />
            {data.credit ? (
              <span className="mt-1 flex items-center gap-2.5 text-[13.5px] font-bold text-heading">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-white">
                  <Icon name="play" size={12} />
                </span>
                {data.credit}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-line bg-tint-50 p-4 md:p-5 lg:max-h-[640px]">
          <div className="flex items-center justify-between px-1">
            <b className="font-display text-[20px] font-normal text-heading">{data.playlistLabel}</b>
            <span className="text-[13px] font-bold text-muted">
              {list.length} {list.length === 1 ? "video" : "videos"}
            </span>
          </div>
          {filters.length > 2 ? (
            <GlassTabs
              items={filters}
              value={filter}
              onChange={setFilter}
              label="Filter videos"
              idPrefix="videos"
              size="sm"
              scroll
              className="shrink-0"
            />
          ) : null}
          <ul className="scrollbar-soft -mr-1 flex flex-col gap-2 overflow-y-auto pr-1">
            {list.map(({ video: item, index }) => {
              const id = youtubeId(item.youtubeId);
              const playing = index === current;
              return (
                <li key={`${item.title}-${index}`}>
                  <button
                    type="button"
                    aria-current={playing || undefined}
                    onClick={() => setCurrent(index)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-[18px] border p-2 text-left transition-colors",
                      playing ? "border-primary bg-white shadow-sm" : "border-transparent hover:bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "relative grid h-[62px] w-[100px] shrink-0 place-items-center overflow-hidden rounded-[12px] bg-cover bg-center",
                        TONES[categoryIndex(item.category) % TONES.length],
                      )}
                      style={id ? { backgroundImage: `url('https://i.ytimg.com/vi/${id}/mqdefault.jpg')` } : undefined}
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-white/90 text-primary">
                        <Icon name="play" size={12} />
                      </span>
                      {item.duration ? (
                        <em className="absolute right-1 bottom-1 rounded-md bg-ink/70 px-1.5 text-[10.5px] font-bold text-white not-italic">
                          {item.duration}
                        </em>
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <small className="block text-[11.5px] font-extrabold tracking-[.08em] text-accent-700 uppercase">
                        {item.categoryLabel}
                      </small>
                      <b className={cn("line-clamp-2 text-[14px] leading-[1.35]", playing ? "text-primary" : "text-heading")}>
                        {item.title}
                      </b>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {data.channel.label ? (
        <div className="mt-8 flex justify-center">
          <SmartLink href={data.channel.href} target={data.channel.target} className={buttonClass("primary")}>
            <Icon name="youtube" size={19} />
            {data.channel.label}
          </SmartLink>
        </div>
      ) : null}
    </Container>
  );
}
