"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import type { TreatmentTab } from "@site/types/content";
import { GlassTabs } from "@site/components/common/glass-tabs";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { RichText } from "@site/components/common/rich-text";
import { buttonClass, DecoRing } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/** A service whose page isn't published yet (empty CMS link) renders as a plain card, without a link. */
function ServiceCard({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return href === "#" ? <div className={className}>{children}</div> : <SmartLink href={href} className={className}>{children}</SmartLink>;
}

/** Category tabs (glass pill) + service cards + feature panel that cross-fade on switch. */
export function TreatmentTabs({ tabs }: { tabs: TreatmentTab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  if (!tab) return null;

  return (
    <>
      <Reveal className="mx-auto mb-10 self-center">
        <GlassTabs
          items={tabs.map((t) => ({ key: t.label, label: t.label }))}
          value={active}
          onChange={setActive}
          label="Treatment categories"
          idPrefix="treatment"
        />
      </Reveal>

      <Reveal>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="treatment-panel"
            role="tabpanel"
            aria-labelledby={`treatment-tab-${active}`}
            className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
          >
            {/* 4 cards: 2 columns; 3 or 6 cards: 3 columns (as in the design). */}
            <div
              className={cn(
                "grid content-start gap-[18px]",
                tab.services.length % 3 !== 0 ? "md:grid-cols-2" : "md:grid-cols-3",
              )}
            >
              {tab.services.map((service, n) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 + n * 0.05, ease }}
                >
                  <ServiceCard
                    href={service.href}
                    className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-line bg-white p-[26px] transition-[translate,box-shadow,border-color] duration-250 before:absolute before:-top-[60px] before:-right-[60px] before:size-[140px] before:rounded-full before:bg-tint-100 before:transition-transform before:duration-350 before:content-[''] hover:-translate-y-1 hover:border-transparent hover:shadow-md hover:before:scale-150 md:min-h-[220px]"
                  >
                    <span className="relative flex items-center justify-between">
                      <span className="font-display text-[15px] text-accent">
                        {String(n + 1).padStart(2, "0")}
                      </span>
                      <span className="grid size-10 place-items-center rounded-full border border-line bg-white text-primary transition-[background-color,color,rotate,border-color] duration-250 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                        <Icon name="arrow-up-right" size={16} strokeWidth={2.2} />
                      </span>
                    </span>
                    <h3 className="relative mt-3.5 text-[21px]">{service.title}</h3>
                    <p className="relative text-[14.5px] text-muted">{service.description}</p>
                  </ServiceCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-linear-155 from-primary via-primary-700 via-55% to-primary-900 p-[34px] text-white lg:min-h-[460px]"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              <DecoRing className="-top-[90px] -right-[90px] size-[260px] animate-spin-slow border-dashed" />
              <DecoRing className="-top-[150px] -right-[150px] size-[380px]" color="border-white/7" />
              <span className="relative grid size-[52px] place-items-center rounded-md bg-white/12 text-accent-light">
                <Icon name={tab.feature.icon} size={24} />
              </span>
              <small className="relative text-xs font-extrabold tracking-[.16em] text-accent-light uppercase">
                {tab.feature.eyebrow}
              </small>
              <strong className="relative font-display font-normal text-[30px] leading-[1.15]">{tab.feature.title}</strong>
              <RichText html={tab.feature.text} className="rt rt-light relative text-[15.5px] text-on-primary" />
              <div className="relative mt-auto flex flex-col gap-2.5">
                <SmartLink
                  href={tab.feature.primaryCta.href}
                  target={tab.feature.primaryCta.target}
                  className={buttonClass("white")}
                >
                  {tab.feature.primaryCta.label}
                </SmartLink>
                <SmartLink
                  href={tab.feature.secondaryCta.href}
                  target={tab.feature.secondaryCta.target}
                  className={buttonClass("ghostLight")}
                >
                  {tab.feature.secondaryCta.label}
                </SmartLink>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </>
  );
}
