import Image from "next/image";
import type {
  Breadcrumb,
  DoctorProfileSection,
  InfrastructureSection,
  MedicalTeamSection,
  PageHeroSection,
  RecognitionSection,
  StorySection,
  ValuesSection,
} from "@site/types/content";
import { Icon, type IconName } from "@site/components/common/icon";
import { PhotoPlaceholder, placeholderTone } from "@site/components/common/photo-placeholder";
import { Reveal } from "@site/components/common/reveal";
import { StockBadge } from "@site/components/common/stock-badge";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import {
  buttonClass,
  Container,
  DecoRing,
  Eyebrow,
  h2Class,
  leadClass,
  linkArrowClass,
  Section,
  TONE_CHIP,
} from "@site/components/common/ui";
import { ZoomIn } from "@site/components/common/zoom-in";
import { HeroPoints, PageHero } from "./page-hero";
import { InfrastructureGrid } from "./infrastructure-grid";
import { RecognitionGrid } from "./recognition-grid";
import { VideoPlayer } from "@site/components/sections/video-player";
import { cn } from "@site/lib/utils/cn";

/*
 * Inner-page sections, one per WordPress layout (page_hero, story, values,
 * doctor_profile, medical_team, facilities, recognition). Any page may use
 * them; components/page/page-sections.tsx picks the one for each layout.
 */

/** `crumbs` replaces the default "Home › breadcrumb" trail (e.g. Home › Treatments › IVF Treatment). */
export function PageHeroBanner({ data, crumbs }: { data: PageHeroSection; crumbs?: Breadcrumb[] }) {
  return (
    <PageHero
      crumbs={crumbs ?? [{ label: "Home", href: "/" }, { label: data.breadcrumb }]}
      title={data.title}
      lead={data.lead}
      asideClassName="flex justify-center lg:h-[620px] lg:items-center"
      aside={
        <div className="relative mx-auto w-[min(430px,86%)]">
          <span
            className="absolute -inset-x-[30px] -top-[26px] -bottom-[18px] rounded-[60px] border border-white/14"
            aria-hidden
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] bg-primary shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
            {data.image ? (
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
          {data.tag.title ? (
            <div className="absolute bottom-0 left-4 flex animate-float items-center gap-3 rounded-[18px] bg-white/96 px-4 py-3 text-body shadow-float md:-left-6">
              <span className="grid size-10 place-items-center rounded-sm bg-accent-50 text-accent-700">
                <Icon name="heart" size={20} strokeWidth={2} />
              </span>
              <span>
                <b className="block font-display text-[17px] leading-[1.1] font-normal text-heading">{data.tag.title}</b>
                <small className="text-xs font-semibold text-muted">{data.tag.text}</small>
              </span>
            </div>
          ) : null}
        </div>
      }
    >
      <HeroPoints items={data.points} />
      {data.primaryCta.label || data.secondaryCta.label ? (
        <div className="flex flex-wrap gap-3.5">
          {data.primaryCta.label ? (
            <SmartLink href={data.primaryCta.href} target={data.primaryCta.target} className={buttonClass("accent")}>
              {data.primaryCta.label}
              <Icon name="arrow-right" size={18} strokeWidth={2.2} />
            </SmartLink>
          ) : null}
          {data.secondaryCta.label ? (
            <SmartLink href={data.secondaryCta.href} target={data.secondaryCta.target} className={buttonClass("ghostLight")}>
              {data.secondaryCta.label}
            </SmartLink>
          ) : null}
        </div>
      ) : null}
    </PageHero>
  );
}

export function Story({ data }: { data: StorySection }) {
  const { tour } = data;
  return (
    <Section id="story">
      <Container className={cn("grid items-start gap-12", tour && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[72px]")}>
        <Reveal className="flex flex-col gap-5">
          {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
          <h2 className={h2Class()}>
            <RichTitle text={data.title} />
          </h2>
          {data.highlight ? (
            <RichText
              html={data.highlight}
              className="rt border-l-[3px] border-accent pl-5 font-display text-[22px] leading-[1.45] text-primary italic"
            />
          ) : null}
          <RichText html={data.text} className="rt flex flex-col gap-5 text-[16.5px] leading-[1.75] text-body-soft" />
        </Reveal>
        {tour ? (
        <Reveal delay={0.1} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-md">
          <div className="relative">
            <VideoPlayer id={tour.youtubeId} label={`Play video: ${tour.title}`} large />
            {tour.duration ? (
              <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {tour.duration}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-3.5 p-6 md:p-8">
            <h3 className="text-[24px]">{tour.title}</h3>
            <RichText html={tour.text} className="rt text-[15px] leading-[1.7] text-muted" />
            {tour.points.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {tour.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[14.5px] font-bold text-heading">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-700">
                      <Icon name="check" size={13} strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
            {tour.link.label ? (
              <SmartLink href={tour.link.href} target={tour.link.target} className={cn(linkArrowClass, "mt-1 self-start")}>
                <Icon name="youtube" size={18} />
                {tour.link.label}
                <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
              </SmartLink>
            ) : null}
          </div>
        </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}

/** Large value cards alternate primary / accent. */
const VALUE_CARD_STYLES = [
  { card: "bg-primary-900 text-white", chip: "bg-accent/16 text-accent-light", title: "text-white", text: "text-on-dark", glow: true },
  { card: "bg-accent text-accent-ink", chip: "bg-accent-ink/12", title: "text-accent-ink", text: "", glow: false },
];

export function Values({ data }: { data: ValuesSection }) {
  return (
    <Section tone="tint" id="values">
      <Container>
        <SectionHead heading={data} center />
        {data.cards.length ? (
          <div className="grid gap-[18px] md:grid-cols-2">
            {data.cards.map((card, i) => {
              const style = VALUE_CARD_STYLES[i % VALUE_CARD_STYLES.length];
              return (
                <Reveal
                  key={`${card.title}-${i}`}
                  delay={(i % 2) * 0.1}
                  className={cn("relative isolate flex flex-col gap-3 overflow-hidden rounded-xl p-8 md:p-10", style.card)}
                >
                  {style.glow ? (
                    <div className="glow-doctor pointer-events-none absolute inset-0 -z-10" aria-hidden />
                  ) : (
                    <DecoRing className="-top-[70px] -right-[70px] size-[220px] animate-spin-slow border-dashed" color="border-accent-ink/18" />
                  )}
                  <span className={cn("grid size-12 place-items-center rounded-[14px]", style.chip)}>
                    <Icon name={card.icon} size={22} />
                  </span>
                  <h3 className={cn("mt-2 text-[28px]", style.title)}>{card.title}</h3>
                  <RichText html={card.text} className={cn("rt rt-light text-[16.5px] leading-[1.7]", style.text)} />
                </Reveal>
              );
            })}
          </div>
        ) : null}
        <div className={cn("grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5", data.cards.length > 0 && "mt-[18px]")}>
          {data.items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={0.08 * i}
              y={18}
              className="group flex flex-col gap-2.5 rounded-lg bg-white p-6 shadow-sm transition-[translate,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={cn(
                  "grid size-[42px] place-items-center rounded-sm transition-transform duration-250 group-hover:scale-110",
                  TONE_CHIP[i % 2 ? "accent" : "primary"],
                )}
              >
                <Icon name={item.icon} size={20} />
              </span>
              <b className="font-display text-[19px] font-normal text-heading">{item.title}</b>
              <span className="text-[14.5px] leading-[1.6] text-muted">{item.text}</span>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function DoctorProfile({ data }: { data: DoctorProfileSection }) {
  // An unpublished doctor comes back as `doctor: null`: no name, no section.
  if (!data.name) return null;
  return (
    <Section id="leadership">
      <Container className="grid items-center gap-12 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-[72px]">
        <Reveal className="relative mx-auto w-full max-w-[440px]">
          <span
            className="absolute -bottom-5 -left-5 -z-10 size-[140px] bg-[radial-gradient(var(--color-primary)_1.5px,transparent_1.5px)] bg-size-[14px_14px] opacity-25"
            aria-hidden
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] bg-primary">
            {data.image ? (
              <ZoomIn className="absolute inset-0">
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  sizes="(min-width: 1101px) 440px, 100vw"
                  className="object-cover object-[50%_30%]"
                />
              </ZoomIn>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className={h2Class()}>{data.name}</h2>
            <span className="text-[18px] font-bold text-accent-700">{data.role}</span>
          </div>
          <RichText html={data.bio} className={cn("rt", leadClass)} />
          {data.message ? (
            <blockquote className="relative rounded-lg bg-tint-100 px-6 py-5 pl-14 font-display text-[19px] leading-[1.5] text-heading italic">
              <span className="absolute top-3 left-5 font-display text-[54px] leading-none text-primary opacity-40" aria-hidden>
                “
              </span>
              <RichText html={data.message} className="rt" />
            </blockquote>
          ) : null}
          {data.details.length ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              {data.details.map((detail) => (
                <div key={detail.label} className="rounded-md border border-line px-5 py-4">
                  <dt className="text-[12px] font-extrabold tracking-[.12em] text-accent-700 uppercase">{detail.label}</dt>
                  <dd className="mt-1 text-[15.5px] font-bold text-heading">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {data.cta.label ? (
            <SmartLink href={data.cta.href} target={data.cta.target} className={buttonClass("primary", "md", "self-start max-sm:w-full max-sm:whitespace-normal")}>
              {data.cta.label}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </SmartLink>
          ) : null}
        </Reveal>
      </Container>
    </Section>
  );
}

/** Icon for a team member without a photo, picked from their role. */
function roleIcon(role: string): IconName {
  const r = role.toLowerCase();
  if (r.includes("embryolog") || r.includes("androlog") || r.includes("lab")) return "flask";
  if (r.includes("anaesth") || r.includes("anesth")) return "heart";
  if (r.includes("nurs") || r.includes("counsel")) return "user";
  return "stethoscope";
}

export function MedicalTeam({ data }: { data: MedicalTeamSection }) {
  if (!data.members.length) return null;
  return (
    <Section tone="tint" id="team">
      <Container>
        <SectionHead heading={data} />
        <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {data.members.map((member, i) => (
            <Reveal
              key={`${member.role}-${i}`}
              delay={(i % 3) * 0.1}
              className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-[translate,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3]">
                {member.image ? (
                  <>
                    <Image src={member.image.src} alt={member.image.alt} fill sizes="(min-width: 1101px) 380px, 100vw" className="object-cover object-top" />
                    <StockBadge src={member.image.src} show={member.representative} />
                  </>
                ) : (
                  <PhotoPlaceholder icon={roleIcon(member.role)} tone={placeholderTone(i)} />
                )}
              </div>
              <div className="flex grow flex-col gap-2 p-6">
                <span className="text-[12px] font-extrabold tracking-[.14em] text-accent-700 uppercase">{member.role}</span>
                <h3 className="text-[22px]">{member.name}</h3>
                {member.qualifications ? <span className="text-[14px] font-bold text-primary">{member.qualifications}</span> : null}
                <RichText html={member.text} className="rt text-[14.5px] leading-[1.65] text-muted" />
                {member.details.length ? (
                  <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-[13.5px]">
                    {member.details.map((detail) => (
                      <div key={detail.label} className="contents">
                        <dt className="font-extrabold text-heading">{detail.label}</dt>
                        <dd className="text-muted">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** `facilities` on inner pages: photo tiles on a dark band, with an optional tour button. */
export function Infrastructure({ data }: { data: InfrastructureSection }) {
  if (!data.items.length) return null;
  return (
    <Section tone="dark" id="infrastructure" className="overflow-hidden">
      <div className="glow-why pointer-events-none absolute inset-0" aria-hidden />
      <Container className="relative">
        <SectionHead heading={data} light leadClassName="text-on-dark-2">
          {data.link.label && data.link.href !== "#" ? (
            <SmartLink href={data.link.href} target={data.link.target} className={buttonClass("ghostLight", "sm")}>
              {data.link.label}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </SmartLink>
          ) : null}
        </SectionHead>
        <InfrastructureGrid items={data.items} />
      </Container>
    </Section>
  );
}

/** `recognition`: awards, registrations and memberships with filter tabs. */
export function Recognition({ data }: { data: RecognitionSection }) {
  if (!data.items.length) return null;
  return (
    <Section id="recognition">
      <Container>
        <SectionHead heading={data} center />
        <RecognitionGrid allLabel={data.allLabel} filters={data.filters} items={data.items} />
      </Container>
    </Section>
  );
}
