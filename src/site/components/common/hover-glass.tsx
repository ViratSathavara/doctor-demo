"use client";

import { motion } from "motion/react";
import { useState, type FocusEvent, type MouseEvent } from "react";
import { cn } from "@site/lib/utils/cn";

/*
 * Hover glass — companion to the glass tabs (glass-tabs.tsx) for link lists
 * that have no selected item (footer columns, mega-menu lists).
 *
 * One frosted highlight lives in the list container: it fades in under the
 * first hovered/focused link, glides between links (across columns too), and
 * fades out when the pointer leaves. Spread `track` on a `relative` container,
 * render <HoverGlass> as its first child, and spread `item(key)` on each link
 * (links need `relative` so they paint above the highlight).
 */

type Box = { x: number; y: number; w: number; h: number; fresh: boolean };

export function useHoverGlass<K extends string = string>() {
  const [active, setActive] = useState<K | null>(null);
  const [box, setBox] = useState<Box | null>(null);

  const show = (key: K) => (e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const container = e.currentTarget.closest("[data-hover-glass]");
    if (!container) return;
    const c = container.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    // `fresh`: appearing from nothing, so jump into place instead of sliding from the last spot.
    setBox({ x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height, fresh: active === null });
    setActive(key);
  };

  return {
    active,
    box,
    track: {
      "data-hover-glass": "",
      onMouseLeave: () => setActive(null),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
      },
    },
    item: (key: K) => ({ onMouseEnter: show(key), onFocus: show(key) }),
  };
}

const TONE = {
  /** On dark backgrounds (footer). */
  dark: "rounded-full border border-white/15 bg-linear-to-r from-accent/25 via-white/10 to-white/5 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_24px_-10px_rgb(0_0_0/0.55)] backdrop-blur-md",
  /** On white panels (mega menus). */
  light:
    "rounded-[10px] border border-white bg-linear-to-b from-white to-tint-100 shadow-[inset_0_1px_0_#fff,0_8px_20px_-10px_color-mix(in_srgb,var(--color-primary)_35%,transparent)] ring-1 ring-line",
} as const;

export function HoverGlass({
  state,
  tone = "light",
}: {
  state: Pick<ReturnType<typeof useHoverGlass>, "active" | "box">;
  tone?: keyof typeof TONE;
}) {
  const { active, box } = state;
  if (!box) return null;
  const glide = box.fresh ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 36 };

  return (
    <motion.span
      className={cn("pointer-events-none absolute top-0 left-0", TONE[tone])}
      initial={false}
      animate={{ x: box.x, y: box.y, width: box.w, height: box.h, opacity: active === null ? 0 : 1 }}
      transition={{ x: glide, y: glide, width: glide, height: glide, opacity: { duration: 0.2 } }}
      aria-hidden
    />
  );
}
