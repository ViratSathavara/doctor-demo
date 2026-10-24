"use client";

import { motion } from "motion/react";
import { useId, useState, type FocusEvent, type ReactNode } from "react";
import { cn } from "@site/lib/utils/cn";

/*
 * Glass tab system — use for EVERY tab strip / segmented control on the site.
 *
 * One frosted pill marks the selected item, slides to whichever item is
 * hovered or focused (text colour moves with it), and glides back to the
 * selected item when the pointer leaves. `GlassTabs` is the ready-made tab
 * list; `useGlassHighlight` + `GlassPill` + `glassTrackClass` build custom
 * strips (e.g. the header nav, which mixes links and menu buttons).
 */

type Tone = "light" | "dark";

/** Frosted track behind the items. `dark` = on a dark/accent background. */
export const glassTrackClass = (tone: Tone = "light") =>
  cn(
    "rounded-full border backdrop-blur-xl backdrop-saturate-150",
    tone === "light"
      ? "border-white/80 bg-tint-100/70 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),0_10px_30px_-14px_color-mix(in_srgb,var(--color-primary-900)_30%,transparent)]"
      : "border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
  );

/** Text colour of an item depending on whether the pill is on it. */
export const glassItemClass = (on: boolean, tone: Tone = "light") =>
  cn(
    "relative transition-colors duration-300",
    on ? (tone === "light" ? "text-white" : "text-accent-800") : tone === "light" ? "text-body" : "text-white",
  );

/** The sliding pill. Render it inside the highlighted item only; `layoutId` makes it glide, `instant` makes it jump. */
export function GlassPill({ layoutId, tone = "light", instant = false }: { layoutId: string; tone?: Tone; instant?: boolean }) {
  return (
    <motion.span
      layoutId={layoutId}
      className={cn(
        "absolute inset-0 rounded-full ring-1 ring-inset",
        tone === "light"
          ? "bg-linear-to-b from-primary to-primary-700 shadow-primary ring-white/25"
          : "bg-linear-to-b from-white to-tint-100 shadow-sm ring-white/60",
      )}
      transition={instant ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
      aria-hidden
    >
      <span className="absolute inset-x-2 top-px h-1/2 rounded-full bg-linear-to-b from-white/30 to-transparent" />
    </motion.span>
  );
}

/**
 * Hover/focus tracking for a glass strip. `highlighted` is the hovered or
 * focused key, else `fallback` (the selected item). Spread `track` on the
 * container and `item(key)` on each item.
 */
export function useGlassHighlight<K extends string | number>(fallback: K | undefined) {
  const [hovered, setHovered] = useState<K | null>(null);
  return {
    highlighted: hovered ?? fallback,
    hovered,
    track: {
      onMouseLeave: () => setHovered(null),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
      },
    },
    item: (key: K) => ({
      onMouseEnter: () => setHovered(key),
      onFocus: () => setHovered(key),
    }),
  };
}

export type GlassHighlight<K extends string | number = string> = ReturnType<typeof useGlassHighlight<K>>;

/** Accessible tab list with the glass pill. Pair with a panel using `tabId(i)` / `panelId`. */
export function GlassTabs({
  items,
  value,
  onChange,
  label,
  idPrefix,
  tone = "light",
  size = "md",
  scroll = false,
  className,
}: {
  items: { label: ReactNode; key: string }[];
  value: number;
  onChange: (index: number) => void;
  /** aria-label of the tablist. */
  label: string;
  /** Prefix for tab ids (`${idPrefix}-tab-${i}`) and the panel id (`${idPrefix}-panel`). */
  idPrefix: string;
  tone?: Tone;
  size?: "sm" | "md";
  /** One row that scrolls sideways (themed scrollbar under the track) instead of wrapping. */
  scroll?: boolean;
  className?: string;
}) {
  const layoutId = `glass-tabs-${useId()}`;
  const { highlighted, track, item } = useGlassHighlight<number>(value);

  const list = (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex gap-1.5 p-1.5",
        scroll ? "flex-nowrap" : "flex-wrap justify-center",
        glassTrackClass(tone),
        !scroll && className,
      )}
      {...track}
    >
      {items.map((tab, i) => (
        <button
          type="button"
          role="tab"
          key={tab.key}
          id={`${idPrefix}-tab-${i}`}
          aria-selected={value === i}
          aria-controls={`${idPrefix}-panel`}
          onClick={(e) => {
            onChange(i);
            if (scroll) e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
          }}
          {...item(i)}
          className={cn(
            "cursor-pointer rounded-full border-0 bg-transparent font-bold",
            scroll && "shrink-0 whitespace-nowrap",
            size === "md" ? "h-[42px] px-4 text-sm md:h-12 md:px-6 md:text-[15px]" : "h-8 px-3.5 text-[13px]",
            glassItemClass(highlighted === i, tone),
          )}
        >
          {highlighted === i ? <GlassPill layoutId={layoutId} tone={tone} /> : null}
          <span className="relative">{tab.label}</span>
        </button>
      ))}
    </div>
  );

  if (!scroll) return list;
  return <div className={cn("scrollbar-soft max-w-full overflow-x-auto pb-1.5", className)}>{list}</div>;
}
