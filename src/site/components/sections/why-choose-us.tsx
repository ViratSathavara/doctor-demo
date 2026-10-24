import type { WhyChooseUsSection } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { RichText } from "@site/components/common/rich-text";
import { buttonClass, Container, Section } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

export function WhyChooseUs({ data }: { data: WhyChooseUsSection }) {
  return (
    <Section tone="dark" id="why-choose-us" className="overflow-hidden">
      <div className="glow-why pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <SectionHead heading={data} light>
          <SmartLink href={data.cta.href} target={data.cta.target} className={buttonClass("white")}>
            {data.cta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </SectionHead>
        <div className="grid gap-[18px] md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, i) => {
            const hl = item.highlight;
            return (
              <Reveal
                key={item.title}
                delay={(i % 3) * 0.08}
                className={cn(
                  "group relative flex flex-col gap-3.5 overflow-hidden rounded-lg border p-[30px] transition-[translate,background-color,border-color] duration-250 hover:-translate-y-1",
                  hl ? "border-accent bg-accent" : "border-white/9 bg-white/[.045] hover:border-white/16 hover:bg-white/8",
                )}
              >
                <span
                  className={cn(
                    "absolute top-3 right-[22px] font-display text-[64px] leading-none transition-transform duration-500 group-hover:-translate-y-1",
                    hl ? "text-accent-ink/14" : "text-white/8",
                  )}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-[14px] transition-transform duration-250 group-hover:scale-110",
                    hl ? "bg-accent-ink/14 text-accent-ink" : "bg-accent/16 text-accent-light",
                  )}
                >
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className={cn("mt-2.5 text-[22px]", hl ? "text-accent-ink" : "text-white")}>{item.title}</h3>
                <RichText html={item.description} className={cn("rt rt-light text-[15px]", hl ? "text-accent-ink" : "text-on-dark-3")} />
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
