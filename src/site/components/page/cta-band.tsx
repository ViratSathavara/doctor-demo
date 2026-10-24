import type { CtaBand as CtaBandContent, SiteSettings } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, DecoRing, Section } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

/**
 * Closing call-to-action panel on inner pages. Call / WhatsApp use the site's
 * phone and WhatsApp link. `accent` (blog articles) sits on the tint band above it.
 */
export function CtaBand({ data, site, tone = "primary" }: { data: CtaBandContent; site: SiteSettings; tone?: "primary" | "accent" }) {
  if (!data.title && !data.text && !data.primaryCta.label && !data.callLabel && !data.whatsappLabel) return null;
  const accent = tone === "accent";
  return (
    <Section compact tone={accent ? "tint" : "white"} className={accent ? "pt-0 md:pt-0" : undefined}>
      <Container>
        <Reveal
          className={cn(
            "relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-xl px-6 py-10 text-white md:px-12 md:py-14 lg:flex-row lg:items-center",
            accent ? "bg-accent-800 [&_h2_em]:text-accent-light" : "bg-primary-900",
          )}
        >
          <div className={cn("pointer-events-none absolute inset-0 -z-10", accent ? "glow-stats" : "glow-why")} aria-hidden />
          <DecoRing className="-top-[90px] -right-[70px] size-[260px] animate-spin-slow border-dashed" color="border-accent-light/20" />
          <div className="flex max-w-[620px] flex-col gap-3">
            <h2 className="text-[clamp(28px,3.2vw,40px)] text-white [&_em]:text-accent [&_em]:italic">
              <RichTitle text={data.title} />
            </h2>
            <RichText html={data.text} className="rt rt-light text-[16.5px] leading-[1.7] text-on-dark" />
          </div>
          {/* One column of equal-width buttons, primary first. */}
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:min-w-[340px]">
            {data.primaryCta.label && data.primaryCta.href !== "#" ? <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass(accent ? "whiteTeal" : "accent")}>
              {data.primaryCta.label}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </SmartLink> : null}
            {data.callLabel && site.phone ? (
              <a href={site.phoneHref} className={buttonClass("ghostLight")}>
                <Icon name="phone" size={17} strokeWidth={2} />
                {data.callLabel} {site.phone}
              </a>
            ) : null}
            {data.whatsappLabel && site.whatsappHref ? (
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass("ghostLight")}>
                <Icon name="whatsapp" size={18} strokeWidth={2} />
                {data.whatsappLabel}
              </a>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
