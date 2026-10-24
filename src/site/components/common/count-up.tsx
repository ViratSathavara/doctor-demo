"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { parseCount } from "@site/lib/utils/format";

/**
 * Counts "1000+" up from 0 when scrolled into view, keeping the suffix.
 * The CMS value is server-rendered (and restored at the end), so crawlers and
 * no-JS visitors see the real text; values like "4.9★" render as-is.
 */
export function CountUp({ value, delay = 0, duration = 1.8 }: { value: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduce = useReducedMotion();
  const parsed = parseCount(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce || !parsed) return;
    const controls = animate(0, parsed.end, {
      delay,
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${parsed.suffix}`;
      },
      onComplete: () => {
        node.textContent = value;
      },
    });
    return () => controls.stop();
    // `parsed` is derived from `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
