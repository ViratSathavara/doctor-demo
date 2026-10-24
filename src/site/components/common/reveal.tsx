"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const TAGS = { div: motion.div, li: motion.li, figure: motion.figure } as const;

/** Fades and lifts its children into view once, when scrolled into the viewport. */
export function Reveal({
  as = "div",
  delay = 0,
  y = 28,
  className,
  children,
}: {
  as?: keyof typeof TAGS;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const Component = TAGS[as];
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  );
}
