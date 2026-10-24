import type { GynecologySection } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, DecoRing, linkArrowClass, Section } from "@site/components/common/ui";

export function Gynecology({ data }: { data: GynecologySection }) {
  return (
    <Section tone="tint" id="gynecology">
      <Container>
        <SectionHead heading={data}>
          <SmartLink href={data.link.href} target={data.link.target} className={linkArrowClass}>
            {data.link.label}
            <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </SectionHead>
        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <SmartLink
                href={item.href}
                className="group flex h-full items-start gap-[18px] rounded-lg border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-250 hover:-translate-y-1 hover:border-transparent hover:shadow-md"
              >
                <span className="grid size-[52px] shrink-0 place-items-center rounded-full bg-primary text-white transition-[background-color,rotate] duration-250 group-hover:-rotate-8 group-hover:bg-accent-700">
                  <Icon name={item.icon} size={22} />
                </span>
                <span>
                  <h3 className="mb-1.5 text-[19px]">{item.title}</h3>
                  <p className="text-[14.5px] leading-[1.55] text-muted">{item.description}</p>
                </span>
                <Icon
                  name="arrow-right"
                  size={20}
                  strokeWidth={2}
                  className="mt-1 ml-auto shrink-0 text-accent-700 transition-transform duration-250 group-hover:translate-x-1"
                />
              </SmartLink>
            </Reveal>
          ))}
        </div>
        <Reveal className="relative mt-7 flex flex-wrap items-center justify-between gap-[30px] overflow-hidden rounded-xl bg-accent-800 px-6 py-7 text-white md:px-10 md:py-[34px]">
          <DecoRing className="-top-[150px] right-[12%] size-[300px] animate-spin-slow border-dashed" color="border-white/14" />
          <DecoRing className="-right-[60px] -bottom-[110px] size-[200px]" color="border-white/14" />
          <span className="relative">
            <strong className="block font-display font-normal text-[28px] leading-[1.2]">{data.band.title}</strong>
            <RichText html={data.band.text} className="rt rt-light text-[15px] text-accent-100" />
          </span>
          <SmartLink
            href={data.band.cta.href}
            target={data.band.cta.target}
            className={buttonClass("whiteTeal", "md", "relative")}
          >
            {data.band.cta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </Reveal>
      </Container>
    </Section>
  );
}
