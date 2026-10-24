"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { DoctorsMegaMenu, TreatmentsMegaMenu } from "@site/types/content";
import { GlassPill, glassItemClass, type GlassHighlight } from "@site/components/common/glass-tabs";
import { Icon } from "@site/components/common/icon";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Eyebrow } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

/**
 * Dropdown panel under the header. Kept in the DOM while closed (inert +
 * invisible) so its links stay crawlable; opening fades and lifts it in.
 * Clicking any link inside closes it.
 */
function MegaPanel({
  open,
  onNavigate,
  className,
  children,
}: {
  open: boolean;
  onNavigate: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-menu
      inert={!open}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onNavigate();
      }}
      className={cn(
        "absolute top-[calc(100%-6px)] left-1/2 z-50 max-h-[calc(100dvh-100px)] w-[min(1180px,calc(100vw-48px))] -translate-x-1/2 overflow-y-auto overscroll-contain transition-[opacity,translate,visibility] duration-250 ease-out-expo max-xl:hidden",
        open ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
      )}
    >
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-line bg-white shadow-mega transition-transform duration-300 ease-out-expo",
          open ? "scale-100" : "scale-[.98]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

const colTitle =
  "mb-2 flex items-center gap-2.5 border-b border-line-soft pb-3 text-[12.5px] font-extrabold tracking-[.08em] text-primary uppercase";
/*
 * Sub-items share the header's glass highlight: hovering one renders the
 * same `nav-pill` element, so the primary pill travels from the open tab down to
 * the item (and back up when the pointer leaves the list).
 */
const itemBase = "relative -mx-2.5 rounded-[10px] px-2.5 py-2 text-[15px]";
const pill = (on: boolean) => (on ? <GlassPill layoutId="nav-pill" /> : null);

type MegaProps<T> = { data: T; open: boolean; glass: GlassHighlight; onNavigate: () => void };

export function TreatmentsMega({ data, open, glass, onNavigate }: MegaProps<TreatmentsMegaMenu>) {
  return (
    <MegaPanel open={open} onNavigate={onNavigate}>
      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_260px] gap-[26px] p-[30px]">
        <div className="col-span-4 grid grid-cols-4 gap-[26px]" {...glass.track}>
          {data.columns.map((column) => (
            <div className="flex flex-col gap-0.5" key={column.title}>
              <h4 className={colTitle}>
                <span className="grid size-[34px] place-items-center rounded-[10px] bg-tint-200">
                  <Icon name={column.icon} size={18} />
                </span>
                {column.title}
              </h4>
              {column.links.map((item) => {
                const key = `mega:${column.title}/${item.label}`;
                const on = glass.highlighted === key;
                return (
                  <SmartLink
                    href={item.href}
                    key={item.label}
                    {...glass.item(key)}
                    className={cn(itemBase, "flex items-center justify-between font-medium", glassItemClass(on))}
                  >
                    {pill(on)}
                    <span className="relative">{item.label}</span>
                    {item.badge ? (
                      <span className="relative rounded-full bg-accent-50 px-2 py-[3px] text-[11px] font-bold text-accent-700">
                        {item.badge}
                      </span>
                    ) : null}
                  </SmartLink>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative flex flex-col justify-between gap-[18px] overflow-hidden rounded-[20px] bg-linear-150 from-primary via-primary-700 via-55% to-primary-900 p-6 text-white">
          <div>
            <small className="block text-[11.5px] leading-[1.4] font-extrabold tracking-[.14em] text-accent-light uppercase">
              {data.promo.eyebrow}
            </small>
            <strong className="mt-2 block font-display font-normal text-[22px] leading-[1.25]">{data.promo.title}</strong>
            <p className="mt-2 text-sm text-on-dark">{data.promo.text}</p>
          </div>
          <SmartLink href={data.promo.cta.href} target={data.promo.cta.target} className={buttonClass("white", "sm")}>
            {data.promo.cta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2} />
          </SmartLink>
        </div>
      </div>
      <div className="flex h-14 items-center justify-between border-t border-line-soft bg-tint-50 px-[30px] text-sm text-muted">
        <span>{data.footerNote}</span>
        <div className="flex gap-6">
          {data.footerLinks.map((item, i) => (
            <SmartLink
              href={item.href}
              target={item.target}
              key={item.label}
              className={cn("font-bold hover:underline", i === 0 ? "text-primary" : "text-accent-700")}
            >
              {item.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </MegaPanel>
  );
}

export function DoctorsMega({ data, open, glass, onNavigate }: MegaProps<DoctorsMegaMenu>) {
  const { doctor, checklist, team, opd } = data;
  return (
    <MegaPanel open={open} onNavigate={onNavigate} className="grid grid-cols-[520px_minmax(0,1fr)] gap-[30px] p-[26px]">
      <div className="flex gap-5 rounded-[20px] bg-tint-200 p-[18px]">
        <div className="relative h-[270px] w-[180px] shrink-0 overflow-hidden rounded-[40px] bg-primary">
          {doctor.image.src ? (
            <Image
              src={doctor.image.src}
              alt={doctor.image.alt || doctor.name}
              fill
              sizes="180px"
              className="object-cover object-[50%_26%]"
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-[9px] pt-1.5">
          <Eyebrow small>{doctor.eyebrow}</Eyebrow>
          <b className="font-display font-normal text-[25px] leading-[1.1] text-heading">{doctor.name}</b>
          <span className="text-[15px] font-semibold text-primary">{doctor.role}</span>
          <span className="text-[13px] text-muted">{doctor.qualifications}</span>
          <div className="flex flex-wrap gap-1.5">
            {doctor.chips.map((chip) => (
              <span className="rounded-full bg-white px-[11px] py-[5px] text-xs font-semibold text-primary-700" key={chip}>
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-auto flex gap-2">
            <SmartLink href={doctor.primaryCta.href} className={buttonClass("primary", "sm", "grow")}>
              {doctor.primaryCta.label}
            </SmartLink>
            <SmartLink href={doctor.secondaryCta.href} className={buttonClass("outline", "sm")}>
              {doctor.secondaryCta.label}
            </SmartLink>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[30px]" {...glass.track}>
        <div className="flex flex-col gap-0.5">
          <h4 className={colTitle}>{checklist.title}</h4>
          {checklist.links.map((item) => {
            const key = `mega:check/${item.label}`;
            const on = glass.highlighted === key;
            return (
              <SmartLink
                href={item.href}
                target={item.target}
                key={item.label}
                {...glass.item(key)}
                className={cn(itemBase, "flex items-center gap-2.5 font-medium", glassItemClass(on))}
              >
                {pill(on)}
                <Icon
                  name="check"
                  size={16}
                  strokeWidth={2.2}
                  className={cn("relative transition-colors duration-300", on ? "text-accent-light" : "text-accent-700")}
                />
                <span className="relative">{item.label}</span>
              </SmartLink>
            );
          })}
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className={colTitle}>{team.title}</h4>
          {team.members.map((member) => {
            const key = `mega:team/${member.name}`;
            const on = glass.highlighted === key;
            return (
              <SmartLink
                href={member.href}
                key={member.name}
                {...glass.item(key)}
                className={cn(itemBase, "flex flex-col gap-0.5", glassItemClass(on))}
              >
                {pill(on)}
                <b className="relative font-semibold">{member.name}</b>
                <small className={cn("relative transition-colors duration-300", on ? "text-on-dark" : "text-muted")}>
                  {member.note}
                </small>
              </SmartLink>
            );
          })}
          <div className="mt-auto rounded-[14px] bg-accent-50 px-4 py-3.5">
            <small className="block text-[11.5px] font-extrabold tracking-[.1em] text-accent-700 uppercase">
              {opd.label}
            </small>
            <b className="text-sm text-accent-900">{opd.value}</b>
          </div>
        </div>
      </div>
    </MegaPanel>
  );
}
