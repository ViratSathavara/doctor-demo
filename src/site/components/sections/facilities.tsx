import Image from "next/image";
import type { FacilitiesSection } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { StockBadge } from "@site/components/common/stock-badge";
import { RichText } from "@site/components/common/rich-text";
import { Container, linkArrowClass, Section } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

const figure = "group relative m-0 overflow-hidden bg-tint-100";
const figImage = "object-cover transition-transform duration-600 group-hover:scale-106";

export function Facilities({ data }: { data: FacilitiesSection }) {
  const { featured } = data;
  return (
    <Section id="facilities">
      <Container>
        <SectionHead heading={data}>
          <SmartLink href={data.link.href} target={data.link.target} className={linkArrowClass}>
            {data.link.label}
            <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </SectionHead>
        <div className="grid auto-rows-[220px] gap-[18px] md:grid-cols-2 md:grid-rows-[320px_220px] lg:grid-cols-4 lg:grid-rows-[260px_260px]">
          <Reveal as="figure" className={cn(figure, "row-span-2 rounded-xl md:col-span-2")}>
            {featured.image.src ? (
              <Image
                src={featured.image.src}
                alt={featured.image.alt}
                fill
                sizes="(min-width: 1101px) 590px, 100vw"
                className={figImage}
              />
            ) : null}
            <StockBadge src={featured.image.src} className="top-5 left-5" />
            <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 rounded-[20px] bg-white/94 px-[22px] py-[18px] backdrop-blur-md">
              <div>
                <b className="block font-display font-normal text-[22px] text-heading">{featured.title}</b>
                <RichText html={featured.text} className="rt text-[14.5px] text-muted" />
              </div>
              <SmartLink
                href={featured.href}
                aria-label={featured.title}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition-[rotate,background-color] duration-300 group-hover:rotate-45 hover:bg-primary-700"
              >
                <Icon name="arrow-up-right" size={18} strokeWidth={2.2} />
              </SmartLink>
            </figcaption>
          </Reveal>
          {data.items.map((item, i) => (
            <Reveal as="figure" key={item.caption} delay={0.08 * (i + 1)} className={cn(figure, "rounded-lg")}>
              {item.image.src ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1101px) 290px, 50vw"
                  className={figImage}
                />
              ) : null}
              <StockBadge src={item.image.src} />
              <figcaption className="absolute bottom-3.5 left-3.5 rounded-full bg-white/92 px-3.5 py-2 text-[13px] font-extrabold text-heading backdrop-blur-sm">
                {item.caption}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
