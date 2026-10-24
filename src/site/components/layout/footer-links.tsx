"use client";

import type { ReactNode } from "react";
import type { FooterContent } from "@site/types/content";
import { HoverGlass, useHoverGlass } from "@site/components/common/hover-glass";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { cn } from "@site/lib/utils/cn";

/** Footer grid: brand column (children) + link columns sharing one gliding glass highlight. */
export function FooterLinks({ columns, children }: { columns: FooterContent["columns"]; children: ReactNode }) {
  const glass = useHoverGlass();

  return (
    <div
      className="relative grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
      {...glass.track}
    >
      <HoverGlass state={glass} tone="dark" />
      {children}
      {columns.map((column, i) => (
        <Reveal className="flex flex-col" delay={0.08 * (i + 1)} key={column.heading}>
          <h4 className="mb-3 font-display text-lg text-white">{column.heading}</h4>
          {column.links.map((item) => {
            const key = `${column.heading}/${item.label}`;
            return (
              <SmartLink
                href={item.href}
                target={item.target}
                key={item.label}
                {...glass.item(key)}
                className={cn(
                  "relative -mx-3 self-start rounded-full px-3 py-[7px] text-[14.5px] transition-colors duration-300",
                  glass.active === key ? "text-white" : "text-on-dark-2",
                )}
              >
                {item.label}
              </SmartLink>
            );
          })}
        </Reveal>
      ))}
    </div>
  );
}
