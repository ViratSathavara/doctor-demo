"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { JourneySection } from "@site/types/content";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { cn } from "@site/lib/utils/cn";

/** Numbered steps on a vertical line that fills primary→accent as you scroll through them. */
export function JourneyTimeline({ steps }: { steps: JourneySection["steps"] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={listRef} className="relative flex flex-col gap-[18px] pl-[52px] md:pl-16">
      <span className="absolute top-[22px] bottom-[22px] left-[18px] w-0.5 bg-line md:left-[21px]" aria-hidden />
      <motion.span
        className="absolute top-[22px] bottom-[22px] left-[18px] w-0.5 origin-top bg-linear-to-b from-primary to-accent md:left-[21px]"
        style={{ scaleY: progress }}
        aria-hidden
      />
      {steps.map((step, i) => {
        const odd = i % 2 === 0;
        return (
          <Reveal
            as="li"
            key={step.title}
            className="relative grid gap-x-5 gap-y-1.5 rounded-lg border border-line bg-white p-5 transition-[translate,box-shadow] duration-250 hover:translate-x-1.5 hover:shadow-md md:grid-cols-[minmax(0,1fr)_auto] md:px-[26px] md:py-6"
          >
            <span
              className={cn(
                "absolute top-[22px] -left-[52px] grid size-[38px] place-items-center rounded-full font-display text-sm text-white shadow-[0_0_0_6px_#fff] md:-left-16 md:size-11 md:text-base",
                odd ? "bg-primary" : "bg-accent-700",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[21px]">{step.title}</h3>
            <RichText html={step.description} className="rt text-[14.5px] text-muted md:col-start-1" />
            <span
              className={cn(
                "mt-1.5 justify-self-start rounded-full px-3 py-1.5 text-xs font-extrabold md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:self-center",
                odd ? "bg-tint-200 text-primary" : "bg-accent-50 text-accent-700",
              )}
            >
              {step.tag}
            </span>
          </Reveal>
        );
      })}
    </ol>
  );
}
