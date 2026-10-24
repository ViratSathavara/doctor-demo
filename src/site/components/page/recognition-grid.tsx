"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { RecognitionSection } from "@site/types/content";
import { GlassTabs } from "@site/components/common/glass-tabs";
import { Lightbox, type LightboxItem } from "@site/components/common/lightbox";
import type { IconName } from "@site/components/common/icon";
import { PhotoPlaceholder, placeholderTone } from "@site/components/common/photo-placeholder";
import { isStockImage, StockBadge } from "@site/components/common/stock-badge";
import { cn } from "@site/lib/utils/cn";


/** Icon for an item without an image, picked from its label (Registration, Award, …). */
function kindIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("registration")) return "shield-check";
  if (l.includes("accreditation")) return "shield";
  if (l.includes("award")) return "star";
  return "award";
}

/** Awards / registrations / memberships with a filter strip; images open in the lightbox. */
export function RecognitionGrid({
  allLabel,
  filters,
  items,
  narrow,
}: Pick<RecognitionSection, "filters" | "items"> & {
  /** Label of the first tab (CMS `tab_all`); "All" when not given. */
  allLabel?: string;
  /** Inside a narrow column: two cards per row at most. */
  narrow?: boolean;
}) {
  const tabs = [{ key: "all", label: allLabel || "All" }, ...filters.filter((filter) => items.some((item) => item.type === filter.key))];
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const active = tabs[tab]?.key ?? "all";
  const visible = active === "all" ? items : items.filter((item) => item.type === active);
  const photos: LightboxItem[] = visible.flatMap((item) => (item.image ? [{ image: item.image, title: item.title, note: item.text }] : []));

  return (
    <>
      {tabs.length > 2 ? (
        <div className="mb-8 flex justify-center">
          <GlassTabs
            items={tabs}
            value={tab}
            onChange={setTab}
            label="Filter recognition"
            idPrefix="recognition"
            size="sm"
            className="max-md:justify-start"
          />
        </div>
      ) : null}
      <motion.div
        layout
        id="recognition-panel"
        role={tabs.length > 2 ? "tabpanel" : undefined}
        className={cn("grid gap-[18px] sm:grid-cols-2", !narrow && "lg:grid-cols-4")}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.figure
              layout
              key={`${item.title}-${items.indexOf(item)}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.03 }}
              className="group m-0 flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-tint-50">
                {item.image ? (
                  <button
                    type="button"
                    className={cn("absolute inset-0 cursor-zoom-in", !(item.representative ?? isStockImage(item.image.src)) && "p-4")}
                    aria-label={`View larger: ${item.title}`}
                    onClick={() => setOpen(photos.findIndex((photo) => photo.image === item.image))}
                  >
                    <span className="relative block size-full overflow-hidden">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(min-width: 1101px) 280px, 50vw"
                        className={cn(
                          "transition-transform duration-500 group-hover:scale-104",
                          (item.representative ?? isStockImage(item.image.src)) ? "object-cover" : "object-contain",
                        )}
                      />
                    </span>
                    <StockBadge src={item.image.src} show={item.representative} label={item.tag} />
                  </button>
                ) : (
                  <PhotoPlaceholder icon={kindIcon(item.label)} tone={placeholderTone(i)} />
                )}
              </div>
              <figcaption className="flex grow flex-col gap-1.5 border-t border-line p-5">
                {item.label ? (
                  <span className="self-start rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-extrabold tracking-[.1em] text-accent-700 uppercase">
                    {item.label}
                  </span>
                ) : null}
                <b className="font-display text-[17px] leading-[1.3] font-normal text-heading">{item.title}</b>
                {item.text ? <span className="text-[13.5px] text-muted">{item.text}</span> : null}
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
      <Lightbox items={photos} index={open} onChange={setOpen} />
    </>
  );
}
