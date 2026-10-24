import Image from "next/image";
import type { DoctorProfile, SiteSettings, TimelineItem } from "@site/types/content";
import { Icon, Stars } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, DecoRing, leadClass } from "@site/components/common/ui";
import { PageHero } from "@site/components/page/page-hero";
import { RecognitionGrid } from "@site/components/page/recognition-grid";
import { cn } from "@site/lib/utils/cn";

const blockTitle = "text-[clamp(26px,2.8vw,34px)]";

export function DoctorHero({ doctor, site }: { doctor: DoctorProfile; site: SiteSettings }) {
  return (
    <PageHero
      crumbs={[{ label: "Home", href: "/" }, { label: "Our Doctors" }, { label: doctor.name }]}
      title={doctor.name}
      lead={doctor.intro}
      overlap
      asideClassName="lg:order-first"
      aside={
        <div className="relative mx-auto w-[min(420px,88%)] pb-6">
          <span
            className="absolute top-1/2 left-1/2 aspect-square w-[124%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-accent-light/25"
            aria-hidden
          />
          <span className="absolute top-4 -right-4 -bottom-2 left-4 rounded-[40px] bg-accent opacity-95" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] bg-primary shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
            {doctor.pageImage.src ? (
              <Image
                src={doctor.pageImage.src}
                alt={doctor.pageImage.alt}
                fill
                preload
                sizes="(min-width: 1101px) 420px, 88vw"
                className="object-cover object-[50%_28%]"
              />
            ) : null}
          </div>
          {doctor.photoBadge ? (
            <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/12 bg-primary-900 px-4 py-2.5 text-[13.5px] font-bold whitespace-nowrap text-white shadow-float">
              <span className="relative size-2.5 rounded-full bg-accent-light">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent-light/70" aria-hidden />
              </span>
              {doctor.photoBadge}
            </div>
          ) : null}
        </div>
      }
    >
      <div className="-mt-3 flex flex-col gap-1.5">
        {doctor.pageRole ? <span className="text-[19px] font-bold text-accent">{doctor.pageRole}</span> : null}
        {doctor.qualifications ? <span className="text-[14.5px] text-on-dark-2">{doctor.qualifications}</span> : null}
      </div>
      {doctor.chips.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {doctor.chips.map((chip) => (
            <li key={chip} className="rounded-full border border-white/16 bg-white/5 px-3.5 py-2 text-[13.5px] font-bold">
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
      {doctor.rating.value ? (
        <div className="flex flex-wrap items-center gap-3">
          <b className="font-display text-[30px] leading-none font-normal">{doctor.rating.value}</b>
          <Stars count={5} size={18} />
          <span className="text-[14px] text-on-dark-2">{doctor.rating.label}</span>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {doctor.primaryCta.label ? <SmartLink href={doctor.primaryCta.href} target={doctor.primaryCta.target} className={buttonClass("accent")}>
          {doctor.primaryCta.label}
          <Icon name="arrow-right" size={16} strokeWidth={2.2} />
        </SmartLink> : null}
        {doctor.callLabel && site.phoneHref ? (
          <a href={site.phoneHref} className={buttonClass("ghostLight")}>
            <Icon name="phone" size={17} strokeWidth={2} />
            {doctor.callLabel}
          </a>
        ) : null}
        {doctor.whatsappLabel && site.whatsappHref ? (
          <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass("ghostLight")}>
            <Icon name="whatsapp" size={18} strokeWidth={2} />
            {doctor.whatsappLabel}
          </a>
        ) : null}
      </div>
      {doctor.email ? <a href={`mailto:${doctor.email}`} className="text-[14px] text-on-dark underline">{doctor.email}</a> : null}
      {doctor.social?.length ? <div className="flex gap-3">{doctor.social.map(link => <SmartLink key={link.platform} href={link.href} aria-label={link.label}><Icon name={link.platform} size={18} /></SmartLink>)}</div> : null}
      {doctor.registration ? <span className="text-[13px] text-on-dark-muted">{doctor.registration}</span> : null}
    </PageHero>
  );
}

/** White bar of quick facts overlapping the bottom of the hero. */
export function QuickFacts({ facts }: { facts: DoctorProfile["facts"] }) {
  if (!facts.length) return null;
  return (
    <Container className="relative z-2 -mt-14">
      <Reveal className="grid overflow-hidden rounded-lg bg-white shadow-lg sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, i) => (
          <div
            key={fact.label}
            className={cn(
              "flex flex-col gap-1 border-line px-6 py-5",
              i > 0 && "max-sm:border-t",
              i % 2 === 1 && "sm:border-l",
              i >= 2 && "sm:max-lg:border-t",
              i > 0 && "lg:border-l",
            )}
          >
            <span className="text-[12px] font-extrabold tracking-[.12em] text-accent-700 uppercase">{fact.label}</span>
            <b className="font-display text-[19px] font-normal text-heading">{fact.value}</b>
          </div>
        ))}
      </Reveal>
    </Container>
  );
}

/** `html` comes from the trusted WordPress editor (paragraphs, bold, links, quotes). */
export function DoctorAbout({ data }: { data: DoctorProfile["about"] }) {
  if (!data.html) return null;
  return (
    <Reveal className="flex flex-col gap-5">
      <h2 className={blockTitle} id="about-doctor">
        {data.title}
      </h2>
      <div
        className="flex flex-col gap-5 text-[16.5px] leading-[1.75] text-body-soft [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:font-display [&_blockquote]:text-[21px] [&_blockquote]:leading-[1.45] [&_blockquote]:text-primary [&_blockquote]:italic [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-heading"
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    </Reveal>
  );
}

export function Expertise({ data }: { data: DoctorProfile["expertise"] }) {
  if (!data.items.length) return null;
  return (
    <div id="expertise" className="flex scroll-mt-28 flex-col gap-6">
      <Reveal className="flex flex-col gap-2">
        <h2 className={blockTitle}>{data.title}</h2>
        <RichText html={data.lead} className={cn("rt", leadClass)} />
      </Reveal>
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.06} y={16}>
            <SmartLink
              href={item.href}
              className="group flex h-full flex-col gap-2 rounded-lg border border-line bg-white p-5 transition-[translate,box-shadow,border-color] duration-250 hover:-translate-y-1 hover:border-transparent hover:shadow-md"
            >
              <span className="grid size-11 place-items-center rounded-sm bg-tint-200 text-primary transition-transform duration-250 group-hover:scale-110 group-hover:-rotate-6">
                <Icon name={item.icon} size={20} />
              </span>
              <b className="mt-1 font-display text-[18px] leading-[1.25] font-normal text-heading transition-colors group-hover:text-primary">
                {item.title}
              </b>
              <span className="text-[14px] leading-[1.6] text-muted">{item.text}</span>
            </SmartLink>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <Reveal className="flex flex-col gap-5">
      <h2 className={blockTitle}>{title}</h2>
      <ol className="relative flex flex-col gap-5 border-l-2 border-line pl-6">
        {items.map((item, i) => (
          <li key={`${item.title}-${i}`} className="relative">
            <span className="absolute top-1.5 -left-[33px] size-4 rounded-full border-[3px] border-white bg-accent shadow-[0_0_0_2px_var(--color-accent)]" aria-hidden />
            <span className="text-[12.5px] font-extrabold tracking-[.08em] text-accent-700 uppercase">{item.period}</span>
            <b className="block font-display text-[19px] font-normal text-heading">{item.title}</b>
            <span className="text-[14.5px] text-muted">{item.place}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function Background({ doctor }: { doctor: DoctorProfile }) {
  if (!doctor.education.items.length && !doctor.experience.items.length) return null;
  return (
    <div id="education" className="grid gap-10 rounded-xl bg-tint-100 p-6 md:grid-cols-2 md:p-9">
      <Timeline {...doctor.education} />
      <Timeline {...doctor.experience} />
    </div>
  );
}

export function Certificates({ data }: { data: DoctorProfile["certificates"] }) {
  if (!data.items.length) return null;
  return (
    <div id="awards" className="flex flex-col gap-6">
      <Reveal>
        <h2 className={blockTitle}>{data.title}</h2>
      </Reveal>
      <RecognitionGrid narrow filters={[]} items={data.items.map((item) => ({ ...item, type: "", label: "" }))} />
    </div>
  );
}

/** Sticky booking card beside the profile. */
export function BookingCard({ data, site }: { data: DoctorProfile["booking"]; site: SiteSettings }) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-[110px]" aria-label={data.title}>
      <div className="relative isolate flex flex-col gap-5 overflow-hidden rounded-xl bg-primary-800 p-7 text-white shadow-lg">
        <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <DecoRing className="-top-[80px] -right-[80px] size-[200px] animate-spin-slow border-dashed" color="border-accent-light/20" />
        <div>
          {data.title ? <h2 className="text-[26px] text-white">{data.title}</h2> : null}
          {data.subtitle ? <p className="mt-1 text-[14.5px] text-on-dark-2">{data.subtitle}</p> : null}
        </div>
        {data.opd.length ? (
          <table className="w-full text-[14px]">
            <tbody>
              {data.opd.map((row) => (
                <tr key={row.label} className="border-b border-white/10 last:border-0">
                  <th scope="row" className="py-2.5 pr-3 text-left font-bold text-on-dark-2">
                    {row.label}
                  </th>
                  <td className="py-2.5 text-right font-bold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {data.fee.value ? (
          <div className="flex items-center justify-between rounded-md bg-white/8 px-4 py-3">
            <span className="text-[14px] text-on-dark-2">{data.fee.label}</span>
            <b className="font-display text-[22px] font-normal">{data.fee.value}</b>
          </div>
        ) : null}
        <div className="flex flex-col gap-2.5">
          {data.primaryCta.label ? <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass("accent", "block")}>
            {data.primaryCta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </SmartLink> : null}
          {data.callLabel && site.phoneHref ? (
            <a href={site.phoneHref} className={buttonClass("ghostLight", "block")}>
              <Icon name="phone" size={17} strokeWidth={2} />
              {data.callLabel}
            </a>
          ) : null}
          {data.whatsappLabel && site.whatsappHref ? (
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClass("ghostLight", "block")}>
              <Icon name="whatsapp" size={18} strokeWidth={2} />
              {data.whatsappLabel}
            </a>
          ) : null}
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg border border-line bg-white p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-700">
          <Icon name="map-pin" size={18} />
        </span>
        <span className="text-[14px] leading-[1.6] text-muted">
          <b className="block text-[15px] text-heading">{site.name}</b>
          {site.address}
          {data.mapLabel ? (
            <a href="#location" className="mt-1 block font-extrabold text-primary">
              {data.mapLabel}
            </a>
          ) : null}
        </span>
      </div>
    </aside>
  );
}
