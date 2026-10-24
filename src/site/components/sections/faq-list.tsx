"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Faq } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { RichText } from "@site/components/common/rich-text";
import { cn } from "@site/lib/utils/cn";

/** Numbered accordion; one item open at a time, the first open by default. */
export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-answer-${i}`;
        return (
          <div className="border-b border-line" key={item.question}>
            <button
              type="button"
              className="group flex w-full cursor-pointer items-center gap-[18px] border-0 bg-transparent px-1 py-6 text-left"
              aria-expanded={isOpen}
              aria-controls={isOpen ? panelId : undefined}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="min-w-6 text-[13px] font-extrabold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span className="grow font-display text-lg leading-[1.3] text-heading transition-colors group-hover:text-primary md:text-[21px]">
                {item.question}
              </span>
              <span
                className={cn(
                  "grid size-[38px] shrink-0 place-items-center rounded-full border transition-[rotate,background-color,color,border-color] duration-300",
                  isOpen ? "rotate-45 border-primary bg-primary text-white" : "border-line text-primary group-hover:border-primary",
                )}
              >
                <Icon name="plus" size={16} strokeWidth={2.4} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <RichText
                    html={item.answer}
                    className="rt pr-2 pb-[22px] pl-[46px] text-[15.5px] leading-[1.75] text-body-soft md:pr-[60px] md:pb-6"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
