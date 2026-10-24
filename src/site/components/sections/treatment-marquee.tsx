/** Scrolling band of treatment names (list rendered twice for a seamless loop). */
export function TreatmentMarquee({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="marquee-pause overflow-hidden border-t border-white/6 bg-primary-900 py-[22px] text-white" aria-hidden>
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-[30px] pr-[30px] font-display text-xl whitespace-nowrap italic after:text-base after:text-accent after:not-italic after:content-['✦'] md:text-[26px]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
