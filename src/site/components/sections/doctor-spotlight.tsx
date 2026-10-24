import Image from "next/image";
import type { DoctorSection } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { RichText } from "@site/components/common/rich-text";
import { buttonClass, Container, Eyebrow, Section } from "@site/components/common/ui";
import { ZoomIn } from "@site/components/common/zoom-in";

export function DoctorSpotlight({ data }: { data: DoctorSection }) {
  return (
    <Section id="doctor">
      <Container>
        <Reveal className="relative isolate grid overflow-hidden rounded-xl bg-primary-900 text-white lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="glow-doctor pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <div className="flex min-w-0 flex-col gap-[22px] px-[22px] py-7 md:p-10 lg:p-[60px]">
            <Eyebrow light>{data.eyebrow}</Eyebrow>
            <div className="flex flex-col gap-2">
              <h2 className="text-[clamp(34px,4vw,48px)] text-white">{data.name}</h2>
              <span className="text-[19px] font-bold text-accent">{data.role}</span>
              <span className="text-[14.5px] text-on-dark-2">{data.qualifications}</span>
            </div>
            <RichText html={data.bio} className="rt rt-light text-[17px] leading-[1.75] text-on-dark" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {data.stats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={0.15 + i * 0.08}
                  y={16}
                  className={`min-w-0 rounded-md border border-white/8 bg-white/6 p-4 transition-colors duration-250 hover:border-white/16 hover:bg-white/10 ${data.stats.length % 2 === 1 && i === data.stats.length - 1 ? "max-md:col-span-2" : ""}`}
                >
                  <b className="block break-words font-display font-normal text-[21px] md:text-[26px]">
                    <CountUp value={stat.value} />
                  </b>
                  <span className="text-[13.5px] text-on-dark-2">{stat.label}</span>
                </Reveal>
              ))}
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              {data.chips.map((chip) => (
                <span
                  className="max-w-full rounded-full border border-white/16 px-3.5 py-2 text-[13px] leading-relaxed font-bold break-words transition-colors hover:border-accent-light/50 hover:text-accent-light"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
              <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass("accent")}>
                {data.primaryCta.label}
                <Icon name="arrow-right" size={16} strokeWidth={2.2} />
              </SmartLink>
              <SmartLink
                href={data.secondaryCta.href}
                target={data.secondaryCta.target}
                className={buttonClass("ghostLight")}
              >
                {data.secondaryCta.label}
              </SmartLink>
            </div>
          </div>
          <div className="relative px-6 pb-6 max-lg:order-first lg:py-6 lg:pr-6 lg:pl-0">
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-[40px] bg-primary after:absolute after:inset-0 after:bg-linear-to-b after:from-transparent after:from-55% after:to-primary-900/55 after:content-[''] md:min-h-[460px] lg:min-h-[640px]">
              {data.image.src ? (
                <ZoomIn className="absolute inset-0">
                  <Image
                    src={data.image.src}
                    alt={data.image.alt}
                    fill
                    sizes="(min-width: 1101px) 436px, 100vw"
                    className="object-cover object-[50%_26%]"
                  />
                </ZoomIn>
              ) : null}
            </div>
            <div className="absolute inset-x-9 bottom-9 z-2 md:inset-x-11 md:bottom-11">
              <div className="flex animate-float items-center gap-3.5 rounded-md bg-white/95 px-[18px] py-4 text-heading shadow-md">
                <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-accent-50 text-accent-700">
                  <Icon name="clock" size={20} strokeWidth={2} />
                </span>
                <span>
                  <small className="block text-[12.5px] font-bold text-muted">{data.opd.label}</small>
                  <b className="text-[15.5px]">{data.opd.value}</b>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
