import type { FaqSection } from "@site/types/content";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, DecoRing, Eyebrow, h2Class, leadClass, Section } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";
import { FaqList } from "./faq-list";

export function Faqs({ data }: { data: FaqSection }) {
  return (
    <Section id="faq">
      <Container className="grid items-start gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[72px]">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-[120px]">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className={h2Class()}>
            <RichTitle text={data.title} />
          </h2>
          <RichText html={data.lead} className={cn("rt", leadClass)} />
          <div className="relative flex flex-col gap-3 overflow-hidden rounded-lg bg-tint-100 p-7">
            <DecoRing className="-top-[70px] -right-[70px] size-[200px]" color="border-primary/14" />
            <b className="font-display font-normal text-[22px] leading-[1.3] text-heading italic">{data.help.title}</b>
            <RichText html={data.help.text} className="rt text-[14.5px] text-muted" />
            <div className="relative mt-1.5 flex flex-wrap gap-2">
              <SmartLink href={data.help.call.href} target={data.help.call.target} className={buttonClass("primary", "sm")}>
                {data.help.call.label}
              </SmartLink>
              <SmartLink
                href={data.help.whatsapp.href}
                target={data.help.whatsapp.target}
                className={buttonClass("outline", "sm")}
              >
                {data.help.whatsapp.label}
              </SmartLink>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <FaqList items={data.items} />
        </Reveal>
      </Container>
    </Section>
  );
}
