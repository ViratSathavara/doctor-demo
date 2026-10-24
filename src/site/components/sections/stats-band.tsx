import type { StatItem } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Reveal } from "@site/components/common/reveal";
import { Container, DecoRing } from "@site/components/common/ui";

/** Teal band of headline numbers; numeric values count up when revealed. */
export function StatsBand({ items }: { items: StatItem[] }) {
  if (!items.length) return null;
  return (
    <section className="relative overflow-hidden bg-accent py-16 text-accent-ink">
      <div className="glow-stats pointer-events-none absolute inset-0" aria-hidden />
      <DecoRing className="-top-[180px] -right-[120px] size-[420px] animate-spin-slow border-dashed" color="border-accent-ink/14" />
      <Container className="relative grid grid-cols-2 gap-6 gap-y-9 lg:grid-cols-4">
        {items.map((stat, i) => (
          <Reveal className="border-l-[1.5px] border-accent-ink/35 pl-[22px]" delay={i * 0.1} key={stat.label}>
            <b className="block font-display font-normal text-[40px] leading-none md:text-[52px]">
              <CountUp value={stat.value} delay={0.1 + i * 0.1} />
            </b>
            <span className="text-[15.5px] font-bold">{stat.label}</span>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
