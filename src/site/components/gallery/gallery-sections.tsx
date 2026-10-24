import Image from "next/image";
import type { GalleryHeroSection, HighlightItem } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, Section } from "@site/components/common/ui";
import { PageHero } from "@site/components/page/page-hero";
import { cn } from "@site/lib/utils/cn";

const COLLAGE = [
  "col-span-2 row-span-2 rounded-[40px]",
  "rounded-[24px]",
  "rounded-[24px]",
];

/** `page_hero` with a photo collage, stats and photo / video buttons (Success Stories). */
export function GalleryHero({ data }: { data: GalleryHeroSection }) {
  return (
    <PageHero
      crumbs={[{ label: "Home", href: "/" }, { label: data.breadcrumb }]}
      eyebrow={data.eyebrow}
      title={data.title}
      lead={data.lead}
      aside={
        data.images.length ? (
          <div className="relative mx-auto grid w-full max-w-[520px] grid-cols-3 grid-rows-2 gap-3.5 pb-8" aria-hidden>
            {data.images.slice(0, 3).map((image, i) => (
              <figure
                key={image.src}
                className={cn("relative m-0 aspect-square overflow-hidden bg-primary shadow-float", COLLAGE[i], i === 0 && "aspect-auto")}
              >
                <Image src={image.src} alt="" fill sizes="(min-width: 1101px) 340px, 60vw" className="object-cover" />
              </figure>
            ))}
            {data.badge ? (
              <div className="absolute bottom-0 left-4 flex animate-float items-center gap-3 rounded-full bg-white/96 py-2 pr-5 pl-2 text-[14px] font-extrabold text-heading shadow-float">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-white">
                  <Icon name="doctor" size={19} />
                </span>
                {data.badge}
              </div>
            ) : null}
          </div>
        ) : null
      }
    >
      <div className="flex flex-wrap gap-3.5">
        {data.primaryCta.label ? (
          <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass("accent")}>
            <Icon name="search" size={17} strokeWidth={2.2} />
            {data.primaryCta.label}
          </SmartLink>
        ) : null}
        {data.secondaryCta.label ? (
          <SmartLink href={data.secondaryCta.href} target={data.secondaryCta.target} className={buttonClass("ghostLight")}>
            <Icon name="play" size={15} />
            {data.secondaryCta.label}
          </SmartLink>
        ) : null}
      </div>
      {data.stats.length ? (
        <div className="flex flex-wrap gap-[26px] border-t border-white/12 pt-[22px]">
          {data.stats.map((stat) => (
            <div key={stat.label}>
              <b className="block font-display text-[30px] leading-none font-normal">
                <CountUp value={stat.value} delay={0.4} />
              </b>
              <small className="text-[13.5px] text-on-dark-2">{stat.label}</small>
            </div>
          ))}
        </div>
      ) : null}
    </PageHero>
  );
}

/** `highlights`: icon cards ("Privacy first", …). */
export function TrustCards({ items }: { items: HighlightItem[] }) {
  if (!items.length) return null;
  return (
    <Section tone="tint" compact aria-label="Our commitments">
      <Container className="grid gap-[18px] md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-sm">
            <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-accent-50 text-accent-700">
              <Icon name={item.icon} size={22} />
            </span>
            <span>
              <b className="block font-display text-[19px] font-normal text-heading">{item.title}</b>
              <span className="text-[14.5px] leading-[1.6] text-muted">{item.text}</span>
            </span>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
