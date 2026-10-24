import type { CSSProperties, ReactNode } from "react";
import type { Breadcrumb, RichText as RichTitleText } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { Container, DecoRing } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";
import { Breadcrumbs } from "./breadcrumbs";

// CSS entrances (animate-rise), as in the home hero: visible on first paint.
export const riseDelay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/**
 * Dark primary hero shared by the inner pages: breadcrumbs, optional eyebrow,
 * h1 (accent words in <em>), lead, then `children` (lists, buttons…). An
 * `aside` (photo, form…) turns it into two columns on desktop.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  aside,
  asideClassName,
  overlap,
  children,
}: {
  crumbs: Breadcrumb[];
  eyebrow?: string;
  title: RichTitleText;
  lead?: string;
  aside?: ReactNode;
  asideClassName?: string;
  /** Extra bottom space for a card that overlaps the hero's lower edge. */
  overlap?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-primary-800 pt-10 text-white md:pt-14",
        overlap ? "pb-24 md:pb-28" : "pb-16 md:pb-20",
      )}
    >
      <div className="glow-hero pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <DecoRing className="-bottom-[260px] -left-[200px] size-[520px]" />
      <DecoRing className="-top-[220px] -right-[160px] size-[480px] animate-spin-slow border-dashed" color="border-accent-light/12" />
      <Container
        className={cn(
          "relative grid items-center gap-10",
          aside && "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12",
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="animate-rise">
            <Breadcrumbs items={crumbs} />
          </div>
          {eyebrow ? (
            <span
              className="inline-flex animate-rise items-center gap-3 text-[12.5px] font-extrabold tracking-[.18em] text-accent-light uppercase before:h-[1.5px] before:w-7 before:bg-current before:opacity-70 before:content-['']"
              style={riseDelay(60)}
            >
              {eyebrow}
            </span>
          ) : null}
          <h1
            className="animate-rise text-[clamp(36px,4.6vw,60px)] leading-[1.04] tracking-[-0.03em] text-white [&_em]:text-accent [&_em]:italic"
            style={riseDelay(100)}
          >
            <RichTitle text={title} />
          </h1>
          {lead ? (
            <div className="max-w-[600px] animate-rise" style={riseDelay(200)}>
              <RichText html={lead} className="rt rt-light text-[18px] leading-[1.7] text-on-dark" />
            </div>
          ) : null}
          {children ? (
            <div className="flex animate-rise flex-col gap-6" style={riseDelay(300)}>
              {children}
            </div>
          ) : null}
        </div>
        {aside ? (
          <div className={cn("relative animate-rise", asideClassName)} style={riseDelay(200)}>
            {aside}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

/** Checklist used in heroes (white text, accent ticks). */
export function HeroPoints({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15.5px] font-semibold text-on-dark">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
            <Icon name="check" size={13} strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
