import type { JourneySection } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { cn } from "@site/lib/utils/cn";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, Eyebrow, h2Class, leadClass, Section } from "@site/components/common/ui";
import { JourneyTimeline } from "./journey-timeline";

export function Journey({ data }: { data: JourneySection }) {
  return (
    <Section id="journey">
      <Container className="grid gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[72px]">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-[120px] lg:self-start">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className={h2Class()}>
            <RichTitle text={data.title} />
          </h2>
          <RichText html={data.lead} className={cn("rt", leadClass)} />
          <SmartLink
            href={data.download.href}
            target={data.download.target}
            className={buttonClass("primary", "md", "self-start")}
          >
            <Icon name="download" size={18} strokeWidth={2} />
            {data.download.label}
          </SmartLink>
          <div className="mt-2 flex items-start gap-3.5 rounded-lg bg-tint-100 p-[22px]">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-white text-primary">
              <Icon name="clock" size={20} />
            </span>
            <RichText html={data.note} className="rt text-[14.5px] text-muted" />
          </div>
        </Reveal>
        <JourneyTimeline steps={data.steps} />
      </Container>
    </Section>
  );
}
