"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ImageAsset } from "@site/types/content";
import { cn } from "@site/lib/utils/cn";
import { Icon } from "./icon";

export interface LightboxItem {
  image: ImageAsset;
  title: string;
  note?: string;
}

const control =
  "grid size-12 cursor-pointer place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20";

/**
 * Full-screen photo viewer. `index` is the open photo (null = closed).
 * Escape closes, ←/→ step through `items`; page scroll is locked while open.
 */
export function Lightbox({
  items,
  index,
  onChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null && Boolean(items[index]);
  const item = open ? items[index] : null;
  const many = items.length > 1;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const step = (by: number) => onChange(((index ?? 0) + by + items.length) % items.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight" && many) step(1);
      if (e.key === "ArrowLeft" && many) step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, items.length, many, onChange]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          key="lightbox"
          className="fixed inset-0 z-70 flex flex-col bg-ink/92 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={item.title || "Photo viewer"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <div className="flex items-center justify-between gap-4 text-on-dark-2">
            <span className="text-[13.5px] font-bold">{many ? `${(index ?? 0) + 1} / ${items.length}` : null}</span>
            <button ref={closeRef} type="button" className={control} aria-label="Close" onClick={() => onChange(null)}>
              <Icon name="plus" size={22} strokeWidth={2.2} className="rotate-45" />
            </button>
          </div>
          <div className="relative flex min-h-0 grow items-center justify-center gap-3 py-4">
            {many ? (
              <button
                type="button"
                className={cn(control, "absolute left-0 z-10 md:static")}
                aria-label="Previous photo"
                onClick={() => onChange(((index ?? 0) - 1 + items.length) % items.length)}
              >
                <Icon name="arrow-right" size={20} strokeWidth={2.2} className="rotate-180" />
              </button>
            ) : null}
            <motion.div
              key={item.image.src}
              className="relative size-full max-w-[1100px]"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src={item.image.src} alt={item.image.alt} fill sizes="100vw" className="object-contain" />
            </motion.div>
            {many ? (
              <button
                type="button"
                className={cn(control, "absolute right-0 z-10 md:static")}
                aria-label="Next photo"
                onClick={() => onChange(((index ?? 0) + 1) % items.length)}
              >
                <Icon name="arrow-right" size={20} strokeWidth={2.2} />
              </button>
            ) : null}
          </div>
          {item.title ? (
            <p className="text-center text-white">
              <b className="block font-display text-xl font-normal">{item.title}</b>
              {item.note ? <span className="text-[14px] text-on-dark-2">{item.note}</span> : null}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
