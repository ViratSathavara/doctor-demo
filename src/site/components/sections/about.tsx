import Image from "next/image";
import type { AboutSection, Tone } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SmartLink } from "@site/components/common/smart-link";
import { StockBadge } from "@site/components/common/stock-badge";
import {
  buttonClass,
  Container,
  DecoRing,
  Eyebrow,
  h2Class,
  leadClass,
  Section,
  TONE_CHIP,
} from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

const TONE_TEXT: Record<Tone, string> = { primary: "text-primary", accent: "text-accent-700", amber: "text-amber" };

const figure = "group relative m-0 overflow-hidden rounded-xl bg-accent-50";
const figImage = "object-cover transition-transform duration-600 group-hover:scale-105";
const caption =
  "absolute bottom-3.5 left-3.5 rounded-full bg-white/92 px-3.5 py-2 text-[13px] font-extrabold text-heading backdrop-blur-sm";

export function About({ data }: { data: AboutSection }) {
  const { primaryImage, secondaryImage } = data;
  return (
    <Section tone="tint" id="about">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
        <Reveal className="relative isolate grid grid-cols-[1.25fr_1fr] grid-rows-[200px_180px] gap-4 md:grid-rows-[250px_240px]">
          <span
            className="absolute -bottom-[26px] -left-[26px] -z-10 size-[120px] bg-[radial-gradient(var(--color-primary)_1.5px,transparent_1.5px)] bg-size-[14px_14px] opacity-25"
            aria-hidden
          />
          <figure className={cn(figure, "row-span-2 rounded-[40px]")}>
            {primaryImage.image.src ? (
              <Image
                src={primaryImage.image.src}
                alt={primaryImage.image.alt}
                fill
                sizes="(min-width: 1101px) 320px, 55vw"
                className={figImage}
              />
            ) : null}
            <StockBadge src={primaryImage.image.src} className="top-8 left-1/2 -translate-x-1/2 whitespace-nowrap" />
            <figcaption className={caption}>{primaryImage.caption}</figcaption>
          </figure>
          <figure className={figure}>
            {secondaryImage.image.src ? (
              <Image
                src={secondaryImage.image.src}
                alt={secondaryImage.image.alt}
                fill
                sizes="(min-width: 1101px) 260px, 45vw"
                className={figImage}
              />
            ) : null}
            <figcaption className={caption}>{secondaryImage.caption}</figcaption>
          </figure>
          <div className="relative flex flex-col justify-end overflow-hidden rounded-xl bg-accent p-[26px] text-accent-ink">
            <DecoRing className="-top-[60px] -right-[60px] size-[180px] animate-spin-slow border-dashed" color="border-accent-ink/18" />
            <b className="font-display font-normal text-5xl leading-none">
              <CountUp value={data.stat.value} />
            </b>
            <span className="text-[15px] font-bold">{data.stat.label}</span>
          </div>
        </Reveal>

        <Reveal className="flex flex-col gap-[22px]" delay={0.1}>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className={h2Class()}>
            <RichTitle text={data.title} />
          </h2>
          <RichText html={data.lead} className={cn("rt", leadClass)} />
          <div className="grid gap-3.5 md:grid-cols-2">
            {data.cards.map((card, i) => (
              <Reveal
                key={card.title}
                delay={0.15 + i * 0.08}
                y={18}
                className="flex flex-col gap-2 rounded-lg bg-white p-[22px] shadow-sm transition-[translate,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-md"
              >
                <span className={cn("grid size-[42px] place-items-center rounded-sm", TONE_CHIP[card.tone])}>
                  <Icon name={card.icon} size={20} />
                </span>
                <b className={cn("font-display font-normal text-[19px]", TONE_TEXT[card.tone])}>{card.title}</b>
                <RichText html={card.text} className="rt text-[14.5px] text-muted" />
              </Reveal>
            ))}
          </div>
          <SmartLink href={data.cta.href} target={data.cta.target} className={buttonClass("dark", "md", "self-start")}>
            {data.cta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </Reveal>
      </Container>
    </Section>
  );
}
