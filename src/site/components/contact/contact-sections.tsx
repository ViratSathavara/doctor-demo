import Image from "next/image";
import type { ReactNode } from "react";
import type {
  ContactHeroSection,
  ContactInfoSection,
  DirectionsSection,
  ImageTextSection,
  SiteSettings,
  SocialLink,
} from "@site/types/content";
import { Icon, type IconName } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, h2Class, leadClass, Section } from "@site/components/common/ui";
import { ContactForm } from "@site/components/forms/contact-form";
import { PageHero } from "@site/components/page/page-hero";
import { cn } from "@site/lib/utils/cn";
import { placeEmbedUrl, placeQuery } from "@site/lib/utils/maps";
import { whatsappNumber } from "@site/lib/utils/whatsapp";

/** `contact` on Contact Us: banner with call / WhatsApp / email cards beside the call-back form. */
export function ContactHero({ data, site }: { data: ContactHeroSection; site: SiteSettings }) {
  const channels: { icon: IconName; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: "phone", label: data.callLabel, value: site.phone, href: site.phoneHref },
    { icon: "whatsapp", label: data.whatsappLabel, value: site.phone, href: site.whatsappHref, external: true },
    { icon: "mail", label: data.emailLabel, value: site.email, href: site.emailHref },
  ];

  return (
    <PageHero
      crumbs={[{ label: "Home", href: "/" }, { label: data.breadcrumb }]}
      title={data.title}
      lead={data.lead}
      aside={
        <ContactForm form={data.form} whatsappNumber={whatsappNumber(site.whatsappHref, site.phone)} clinicName={site.name} />
      }
    >
      <ul className="flex flex-col gap-3">
        {channels
          .filter((channel) => channel.label && channel.value && channel.href)
          .map((channel) => (
            <li key={channel.icon}>
              <a
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener" : undefined}
                className="group flex max-w-[440px] items-center gap-4 rounded-[20px] border border-white/10 bg-white/5 p-3.5 pr-5 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-250 group-hover:scale-108">
                  <Icon name={channel.icon} size={21} strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <small className="block text-[12.5px] font-bold text-on-dark-2">{channel.label}</small>
                  <b className="block truncate text-[17px]">{channel.value}</b>
                </span>
                <Icon
                  name="arrow-up-right"
                  size={18}
                  strokeWidth={2.2}
                  className="ml-auto shrink-0 text-accent-light transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
      </ul>
    </PageHero>
  );
}

function InfoCard({ icon, title, className, children }: { icon: IconName; title: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-xl bg-white p-7 shadow-sm", className)}>
      <h2 className="flex items-center gap-3 text-[24px]">
        <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-tint-200 text-primary">
          <Icon name={icon} size={20} />
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

/** `contact_info`: address (from site info), timings and the 24-hour emergency line. */
export function ContactInfo({ data, site }: { data: ContactInfoSection; site: SiteSettings }) {
  return (
    <Section tone="tint" compact>
      <Container className="grid gap-[18px] lg:grid-cols-3">
        <Reveal>
          <InfoCard icon="map-pin" title={data.address.title} className="h-full">
            <address className="text-[15.5px] leading-[1.7] text-body-soft not-italic">
              <b className="block text-heading">{site.name}</b>
              {site.address}
            </address>
            {data.address.buttonLabel ? (
              <a href={data.address.href} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "sm", "mt-auto self-start")}>
                {data.address.buttonLabel}
                <Icon name="arrow-up-right" size={15} strokeWidth={2.2} />
              </a>
            ) : null}
          </InfoCard>
        </Reveal>
        <Reveal delay={0.08}>
          <InfoCard icon="clock" title={data.timings.title} className="h-full">
            <table className="w-full text-[14.5px]">
              <tbody>
                {data.timings.rows.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th scope="row" className={cn("py-2.5 pr-3 text-left font-bold", row.highlight ? "text-danger-700" : "text-heading")}>
                      {row.label}
                    </th>
                    <td className={cn("py-2.5 text-right", row.highlight ? "font-extrabold text-danger-700" : "text-muted")}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfoCard>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-danger/20 bg-danger-50 p-7">
            <h2 className="flex items-center gap-3 text-[24px] text-danger-700">
              <span className="relative grid size-11 shrink-0 place-items-center rounded-sm bg-danger text-white">
                <span className="absolute inset-0 animate-pulse-ring rounded-sm border-2 border-danger/50" aria-hidden />
                <Icon name="phone" size={20} strokeWidth={2} />
              </span>
              {data.emergency.title}
            </h2>
            <RichText html={data.emergency.text} className="rt text-[15px] leading-[1.7] text-body-soft" />
            {site.phone ? (
              <a href={site.phoneHref} className="mt-auto font-display text-[30px] leading-none text-danger-700 hover:underline">
                {site.phone}
              </a>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/** `directions`: route buttons (Google Maps links from the CMS) beside the map. */
export function Directions({ data, site }: { data: DirectionsSection; site: SiteSettings }) {
  return (
    <Section id="location">
      <Container>
        <SectionHead heading={data} />
        <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
          <Reveal className="flex flex-col gap-2.5">
            {data.routes.map((origin, i) => (
              <a
                key={origin.label}
                href={origin.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center gap-3.5 rounded-[20px] border p-3.5 pr-4 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  i === 0 ? "border-primary bg-primary text-white" : "border-line bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-full",
                    i === 0 ? "bg-white/14 text-white" : "bg-accent-50 text-accent-700",
                  )}
                >
                  <Icon name={i === 0 ? "target" : "map-pin"} size={19} />
                </span>
                <span className="min-w-0 grow">
                  <b className={cn("block text-[15.5px]", i === 0 ? "text-white" : "text-heading")}>{origin.label}</b>
                  <small className={cn("text-[13px]", i === 0 ? "text-on-primary" : "text-muted")}>{origin.note}</small>
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[12.5px] font-extrabold",
                    i === 0 ? "bg-accent text-accent-ink" : "bg-tint-100 text-primary group-hover:bg-primary group-hover:text-white",
                  )}
                >
                  {origin.button}
                </span>
              </a>
            ))}
            {data.landmark ? <p className="mt-1 text-[13.5px] text-muted">{data.landmark}</p> : null}
          </Reveal>
          {site.address ? (
            <Reveal delay={0.1} className="min-h-[360px] overflow-hidden rounded-xl border border-line bg-tint-100">
              <iframe
                className="size-full min-h-[360px] border-0"
                title={`Map – ${site.name}`}
                src={placeEmbedUrl(placeQuery(site))}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

/** `image_text`: photo beside a checklist with a button and a call link. */
export function BeforeVisit({ data, site }: { data: ImageTextSection; site: SiteSettings }) {
  return (
    <Section tone="tint">
      <Container>
        <Reveal className="grid items-center gap-10 overflow-hidden rounded-xl bg-white p-6 shadow-md md:p-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-[40px] bg-primary">
            {data.image ? (
              <Image src={data.image.src} alt={data.image.alt} fill sizes="340px" className="object-cover object-[50%_30%]" />
            ) : null}
          </div>
          <div className="flex flex-col gap-5">
            <h2 className={h2Class()}>
              <RichTitle text={data.title} />
            </h2>
            <RichText html={data.lead} className={cn("rt", leadClass)} />
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {data.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-md bg-tint-100 px-4 py-3.5 text-[15px] font-bold text-heading">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                    <Icon name="check" size={13} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-1">
              {data.primaryCta.label ? (
                <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass("primary")}>
                  {data.primaryCta.label}
                  <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                </SmartLink>
              ) : null}
              {data.callLabel && site.phone ? (
                <a href={site.phoneHref} className={buttonClass("outline")}>
                  <Icon name="phone" size={17} strokeWidth={2} />
                  {data.callLabel} {site.phone}
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/** `social_links`: "Follow us" band (the links come from Footer → Social). */
export function SocialBand({ title, social }: { title: string; social: SocialLink[] }) {
  if (!title || !social.length) return null;
  return (
    <section className="relative overflow-hidden bg-accent py-12 text-accent-ink">
      <div className="glow-stats pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-[clamp(26px,3vw,36px)] text-accent-ink">{title}</h2>
        <div className="flex flex-wrap gap-2.5">
          {social.map((item) => (
            <SmartLink
              key={item.platform}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              className={buttonClass("whiteTeal", "sm")}
            >
              <Icon name={item.platform} size={18} />
              {item.label}
            </SmartLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
