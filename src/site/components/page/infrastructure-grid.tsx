"use client";

import Image from "next/image";
import { useState } from "react";
import type { PhotoItem } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Lightbox, type LightboxItem } from "@site/components/common/lightbox";
import { PhotoPlaceholder, placeholderTone } from "@site/components/common/photo-placeholder";
import { Reveal } from "@site/components/common/reveal";
import { StockBadge } from "@site/components/common/stock-badge";
import { cn } from "@site/lib/utils/cn";

/** Department tiles on a dark background; the first is large. Photos open in the lightbox. */
export function InfrastructureGrid({ items }: { items: PhotoItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const photos: LightboxItem[] = items.flatMap((item) => (item.image ? [{ image: item.image, title: item.title, note: item.text }] : []));

  return (
    <>
      <div className="grid auto-rows-[230px] gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const photoIndex = item.image ? photos.findIndex((photo) => photo.image === item.image) : -1;
          return (
            <Reveal
              as="figure"
              key={`${item.title}-${i}`}
              delay={(i % 4) * 0.06}
              className={cn(
                "group relative m-0 flex flex-col overflow-hidden rounded-lg",
                item.image ? "bg-white/4" : "border-2 border-dashed border-white/14 bg-white/4",
                i === 0 && "md:col-span-2 md:row-span-2 md:rounded-xl",
              )}
            >
              {item.image ? (
                <button
                  type="button"
                  className="absolute inset-0 cursor-zoom-in"
                  aria-label={`View larger photo: ${item.title}`}
                  onClick={() => setOpen(photoIndex)}
                >
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes={i === 0 ? "(min-width: 1101px) 590px, 100vw" : "(min-width: 1101px) 290px, 50vw"}
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  <StockBadge src={item.image.src} show={item.representative} />
                  <span className="absolute top-3.5 right-3.5 grid size-10 place-items-center rounded-full bg-white/90 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <Icon name="search" size={18} strokeWidth={2.2} />
                  </span>
                </button>
              ) : (
                <PhotoPlaceholder tone={placeholderTone(i)} className="min-h-0 grow" />
              )}
              <figcaption
                className={cn(
                  "pointer-events-none rounded-[16px] bg-white/94 px-4 py-3 backdrop-blur-md",
                  item.image ? "absolute inset-x-3 bottom-3" : "relative m-2.5 mt-0",
                )}
              >
                <b className={cn("block font-display font-normal text-heading", i === 0 ? "text-[21px]" : "text-[16px] leading-[1.25]")}>
                  {item.title}
                </b>
                {item.text ? <span className="text-[13px] leading-[1.45] text-muted">{item.text}</span> : null}
              </figcaption>
            </Reveal>
          );
        })}
      </div>
      <Lightbox items={photos} index={open} onChange={setOpen} />
    </>
  );
}
