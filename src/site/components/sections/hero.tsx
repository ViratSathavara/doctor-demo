"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import type { HeroSection } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, DecoRing, TONE_CHIP } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

// Entrances here are CSS (animate-rise) so the hero — the LCP element — is
// visible on first paint instead of waiting for hydration.
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const archShape = "rounded-[40px]";

export function Hero({ data }: { data: HeroSection }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ringsY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary-800 pt-12 text-white md:pt-[72px]">
      <div className="glow-hero pointer-events-none absolute inset-0" aria-hidden />
      <motion.div style={{ y: ringsY }} className="pointer-events-none absolute inset-0" aria-hidden>
        <DecoRing className="-bottom-[260px] -left-[200px] size-[520px]" />
        <DecoRing className="-bottom-[380px] -left-[320px] size-[760px]" color="border-white/6" />
      </motion.div>

      <Container>
        <div className="relative grid items-center gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-[26px] lg:pb-10">
            <span className="inline-flex max-w-full animate-rise items-center gap-2.5 self-start rounded-full border border-white/16 bg-white/5 py-2 pr-4 pl-2 text-[11px] leading-relaxed font-extrabold tracking-[.1em] text-accent-light uppercase sm:text-[12.5px] sm:tracking-[.14em]">
              <i className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink not-italic">
                <Icon name="check" size={13} strokeWidth={3} />
              </i>
              <span className="min-w-0 break-words">{data.badge}</span>
            </span>
            <h1
              className="animate-rise text-[clamp(38px,5vw,66px)] leading-[1.02] font-normal tracking-[-0.03em] text-white [&_em]:font-normal [&_em]:text-accent [&_em]:italic"
              style={delay(100)}
            >
              <RichTitle text={data.title} />
            </h1>
            <div className="max-w-[560px] animate-rise" style={delay(250)}>
              <RichText html={data.lead} className="rt rt-light text-[18.5px] leading-[1.7] text-on-dark" />
            </div>
            <div className="flex animate-rise flex-wrap gap-3.5" style={delay(350)}>
              <SmartLink
                href={data.primaryCta.href}
                target={data.primaryCta.target}
                className={buttonClass("accent", "md", "max-md:flex-auto")}
              >
                {data.primaryCta.label}
                <Icon name="arrow-right" size={18} strokeWidth={2.2} />
              </SmartLink>
              <SmartLink
                href={data.videoCta.href}
                target={data.videoCta.target}
                className={buttonClass("ghostLight", "md", "max-md:flex-auto")}
              >
                <span className="relative grid size-[30px] -ml-3.5 place-items-center rounded-full bg-white text-primary">
                  <span
                    className="absolute -inset-1 animate-pulse-ring rounded-full border border-white/60"
                    aria-hidden
                  />
                  <Icon name="play" size={14} />
                </span>
                {data.videoCta.label}
              </SmartLink>
            </div>
            <div
              className="flex animate-rise flex-wrap gap-[22px] border-t border-white/12 pt-[22px] md:gap-[26px]"
              style={delay(500)}
            >
              {data.stats.map((stat) => (
                <div className="flex items-center gap-3" key={stat.label}>
                  <span className="grid size-11 place-items-center rounded-full border border-white/16 text-accent-light">
                    <Icon name={stat.icon} size={19} />
                  </span>
                  <span>
                    <b className="block font-display font-normal text-[30px] leading-none">
                      <CountUp value={stat.value} delay={0.5} />
                    </b>
                    <small className="text-[13.5px] text-on-dark-2">{stat.label}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center pt-10 pb-15 lg:h-[620px] lg:p-0">
            <div className="relative mt-5 aspect-[4/5] w-[min(430px,86%)]">
              {/* Orbit: slow dashed ring + static arch outlines */}
              <span
                className="absolute top-[46%] left-1/2 aspect-square w-[128%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-accent-light/25"
                aria-hidden
              />
              <span
                className="absolute -inset-x-[62px] -top-[54px] -bottom-10 rounded-[60px] border border-white/7"
                aria-hidden
              />
              <span
                className="absolute -inset-x-[30px] -top-[26px] -bottom-[18px] rounded-[60px] border border-white/14"
                aria-hidden
              />
              <div className="absolute inset-0 animate-rise" style={delay(150)}>
                <span
                  className={cn("absolute top-[18px] -right-[18px] -bottom-[18px] left-[18px] bg-accent opacity-95", archShape)}
                  aria-hidden
                />
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden bg-primary shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]",
                    archShape,
                  )}
                >
                  {data.image.src ? (
                    <Image
                      src={data.image.src}
                      alt={data.image.alt}
                      fill
                      preload
                      sizes="(min-width: 1101px) 430px, 86vw"
                      className="object-cover object-[50%_26%]"
                    />
                  ) : null}
                </div>
              </div>

              <div className="absolute -bottom-[26px] left-1/2 -translate-x-1/2">
                <SmartLink
                  href={data.doctorCard.href}
                  className="group flex animate-rise items-center gap-3 rounded-full border border-white/12 bg-primary-900 py-2.5 pr-3 pl-2.5 whitespace-nowrap text-white shadow-float"
                  style={delay(1000)}
                  aria-label={`View ${data.doctorCard.name} profile`}
                >
                  <span className="grid size-10 place-items-center rounded-full bg-primary font-display text-[15px]">
                    {data.doctorCard.initials}
                  </span>
                  <span>
                    <b className="block text-[14.5px] leading-[1.2]">{data.doctorCard.name}</b>
                    <small className="text-xs text-on-dark-2">{data.doctorCard.role}</small>
                  </span>
                  <span className="ml-1.5 grid size-9 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:rotate-45">
                    <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
                  </span>
                </SmartLink>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="relative z-2 mt-11 mb-16 grid overflow-hidden rounded-lg bg-white shadow-lg md:grid-cols-2 lg:grid-cols-4">
          {data.quickActions.map((action, i) => (
            <SmartLink
              href={action.link.href}
              target={action.link.target}
              key={action.title}
              className={cn(
                "group flex items-center gap-3.5 border-line px-[22px] py-6 text-body transition-colors hover:bg-tint-50",
                i > 0 && "max-md:border-t lg:border-l",
                i % 2 === 1 && "md:border-l",
                i >= 2 && "md:max-lg:border-t",
              )}
            >
              <span
                className={cn(
                  "grid size-[52px] shrink-0 place-items-center rounded-md transition-transform duration-250 group-hover:scale-106 group-hover:-rotate-6",
                  TONE_CHIP[action.tone],
                )}
              >
                <Icon name={action.icon} size={24} />
              </span>
              <span>
                <b className="block font-display font-normal text-[16.5px] leading-[1.25] text-heading">{action.title}</b>
                <small className="text-[13.5px] text-muted">{action.text}</small>
              </span>
            </SmartLink>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
