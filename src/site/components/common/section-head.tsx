import type { ReactNode } from "react";
import type { SectionHeading } from "@site/types/content";
import { cn } from "@site/lib/utils/cn";
import { Reveal } from "./reveal";
import { RichText } from "./rich-text";
import { RichTitle } from "./rich-title";
import { Eyebrow, h2Class, leadClass } from "./ui";

/** Eyebrow + h2 (+ lead) block used at the top of most sections. */
export function SectionHead({
  heading,
  center,
  light,
  leadClassName,
  children,
}: {
  heading: SectionHeading;
  center?: boolean;
  /** On a dark background. */
  light?: boolean;
  leadClassName?: string;
  /** Right-hand action (button/link), or extra content under the copy. */
  children?: ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "relative mb-12 flex gap-10",
        center ? "flex-col items-center text-center" : "flex-wrap items-end justify-between",
      )}
    >
      <div className={cn("flex max-w-[680px] flex-col gap-3.5", center && "items-center")}>
        {heading.eyebrow ? (
          <Eyebrow center={center} light={light}>
            {heading.eyebrow}
          </Eyebrow>
        ) : null}
        <h2 className={h2Class(light)}>
          <RichTitle text={heading.title} />
        </h2>
        <RichText html={heading.lead} className={cn("rt", light && "rt-light", leadClass, leadClassName)} />
      </div>
      {children}
    </Reveal>
  );
}
