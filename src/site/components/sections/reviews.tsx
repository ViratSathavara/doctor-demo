import Image from "next/image";
import type { CSSProperties } from "react";
import type { Review, ReviewsSection } from "@site/types/content";
import { Stars } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { cn } from "@site/lib/utils/cn";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, Eyebrow, h2Class, leadClass, Section } from "@site/components/common/ui";

const AVATAR_COLORS = ["var(--color-primary)", "var(--color-accent-700)", "var(--color-amber)"];

function ReviewCard({ review, index, hidden }: { review: Review; index: number; hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex w-[290px] shrink-0 flex-col gap-3.5 rounded-lg border border-line p-6 transition-[border-color,box-shadow] duration-300 hover:border-transparent hover:shadow-md md:w-[340px]"
    >
      <div className="flex items-center justify-between">
        <Stars count={review.rating} size={20} />
        <span className="font-display text-[42px] leading-[.6] text-primary opacity-35">“</span>
      </div>
      <p className="line-clamp-6 grow text-[14.5px] leading-[1.65] text-body-soft">{review.text}</p>
      <div className="flex items-center gap-3 border-t border-line pt-3.5">
        <span
          className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full font-display text-base text-white"
          style={{ background: review.avatarColor ?? AVATAR_COLORS[index % AVATAR_COLORS.length] }}
        >
          {review.initial}
          {/* Covers the initial; if Google's photo fails to load the initial stays visible. */}
          {review.avatar ? (
            <Image
              src={review.avatar}
              alt=""
              fill
              sizes="40px"
              unoptimized
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          ) : null}
        </span>
        <span>
          <b className="block text-[14.5px] font-extrabold text-heading">{review.name}</b>
          <small className="text-[12.5px] text-muted">
            {review.time} · {review.source}
          </small>
        </span>
      </div>
    </div>
  );
}

/** Single auto-scrolling row of every review; rendered twice for a seamless loop. */
function ReviewTrack({ items }: { items: Review[] }) {
  return (
    <div
      className="flex w-max animate-marquee gap-[18px]"
      style={{ "--marquee-duration": "60s" } as CSSProperties}
    >
      {[...items, ...items].map((review, i) => (
        <ReviewCard review={review} index={i % items.length} hidden={i >= items.length} key={`${review.id}-${i}`} />
      ))}
    </div>
  );
}

export function Reviews({ data, tone }: { data: ReviewsSection; tone?: "white" | "tint" }) {
  return (
    <Section id="reviews" tone={tone}>
      <Container>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-10">
          <div className="flex max-w-[680px] flex-col gap-3.5">
            {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
            <h2 className={h2Class()}>
              <RichTitle text={data.title} />
            </h2>
            <RichText html={data.lead} className={cn("rt", leadClass)} />
            <div className="mt-3 flex flex-wrap gap-2.5">
              <SmartLink href={data.readLink.href} target={data.readLink.target} className={buttonClass("primary", "sm")}>
                {data.readLink.label}
              </SmartLink>
              <SmartLink
                href={data.writeLink.href}
                target={data.writeLink.target}
                className={buttonClass("borderOutline", "sm")}
              >
                {data.writeLink.label}
              </SmartLink>
            </div>
          </div>
          {data.rating > 0 ? <div className="flex items-center gap-4 rounded-lg border border-line bg-white px-5 py-3.5 shadow-sm">
            <b className="font-display font-normal text-[44px] leading-none text-heading">{data.rating}</b>
            <span>
              <Stars count={Math.round(data.rating)} size={18} />
              <small className="mt-0.5 block text-[13px] font-bold text-muted">
                {data.ratingLabel || (data.ratingCount > 0 ? `Google · ${data.ratingCount} reviews` : "")}
              </small>
            </span>
          </div> : null}
        </Reveal>
      </Container>
      {data.items.length ? (
        <Reveal className="marquee-pause overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ReviewTrack items={data.items} />
        </Reveal>
      ) : null}
    </Section>
  );
}
