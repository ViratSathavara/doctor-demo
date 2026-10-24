import type { ReactNode } from "react";
import type { BookingSection, SiteSettings } from "@site/types/content";
import { Icon, type IconName } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { RichText } from "@site/components/common/rich-text";
import { RichTitle } from "@site/components/common/rich-title";
import { Container, Eyebrow, Section } from "@site/components/common/ui";
import { AppointmentForm } from "@site/components/forms/appointment-form";
import { placeEmbedUrl, placeQuery } from "@site/lib/utils/maps";

export function Booking({ data, site }: { data: BookingSection; site: SiteSettings }) {
  const contacts: { icon: IconName; label: string; value: ReactNode }[] = [
    { icon: "map-pin", label: data.labels.address, value: site.address },
    { icon: "phone", label: data.labels.phone, value: <a href={site.phoneHref}>{site.phone}</a> },
    { icon: "mail", label: data.labels.email, value: site.email },
    { icon: "clock", label: data.labels.hours, value: site.hours },
  ];

  return (
    <Section tone="tint" id="book">
      <Container>
        <Reveal className="grid overflow-hidden rounded-xl border border-line bg-white shadow-lg lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="relative isolate flex flex-col gap-5 overflow-hidden bg-primary-800 px-[22px] py-[30px] text-white md:p-12">
            <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
            <Eyebrow light>{data.eyebrow}</Eyebrow>
            <h2 className="text-[clamp(29px,3.25vw,40px)] text-white [&_em]:text-accent [&_em]:italic">
              <RichTitle text={data.title} />
            </h2>
            <RichText html={data.lead} className="rt rt-light text-[16.5px] text-on-dark" />
            <div className="flex flex-col gap-3.5 pt-1">
              {contacts.map((item, i) => (
                <Reveal key={item.label} delay={0.1 + i * 0.07} y={14} className="flex items-center gap-3.5">
                  <span className="grid size-[46px] shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-accent-light">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <span>
                    <small className="block text-[11.5px] font-extrabold tracking-[.1em] text-on-dark-2 uppercase">
                      {item.label}
                    </small>
                    <b className="text-[15.5px] font-bold">{item.value}</b>
                  </span>
                </Reveal>
              ))}
            </div>
            {site.address ? (
              <iframe
                className="mt-auto h-[210px] w-full rounded-[20px] border-0 bg-primary-soft"
                title={`Map – ${site.name}`}
                src={placeEmbedUrl(placeQuery(site))}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : null}
          </div>
          <AppointmentForm form={data.form} />
        </Reveal>
      </Container>
    </Section>
  );
}
