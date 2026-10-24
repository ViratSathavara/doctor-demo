import { cn } from "@site/lib/utils/cn";
import { Icon, type IconName } from "./icon";

const TONES = {
  primary: { bg: "bg-linear-to-br from-primary to-primary-800", ring: "border-white/15", disc: "bg-white/6", icon: "bg-white/12 ring-white/25 text-white", label: "text-white/75" },
  accent: { bg: "bg-linear-to-br from-accent to-accent-800", ring: "border-white/20", disc: "bg-white/8", icon: "bg-white/15 ring-white/30 text-white", label: "text-white/80" },
  tint: { bg: "bg-linear-to-br from-tint-200 to-tint-50", ring: "border-primary/12", disc: "bg-primary/5", icon: "bg-white/70 ring-primary/15 text-primary", label: "text-primary/70" },
} as const;

export type PlaceholderTone = keyof typeof TONES;

/** Tone by position, so a row of placeholders doesn't look identical. */
export const placeholderTone = (i: number): PlaceholderTone => (["primary", "accent", "tint"] as const)[i % 3];

/**
 * Branded artwork shown until a real photo is uploaded: a gradient tile with
 * soft rings and a large icon. Deliberately not a photo, so it never passes
 * for a real person, room or certificate.
 */
export function PhotoPlaceholder({
  icon = "building",
  label,
  tone = "primary",
  className,
}: {
  icon?: IconName;
  /** Small caption at the bottom (e.g. the role). */
  label?: string;
  tone?: PlaceholderTone;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div className={cn("relative isolate flex size-full items-center justify-center overflow-hidden", t.bg, className)} aria-hidden>
      <span className={cn("absolute -top-12 -right-12 -z-10 size-48 rounded-full border", t.ring)} />
      <span className={cn("absolute -top-4 -right-4 -z-10 size-32 rounded-full border border-dashed", t.ring)} />
      <span className={cn("absolute -bottom-20 -left-14 -z-10 size-60 rounded-full", t.disc)} />
      <span className={cn("grid size-24 place-items-center rounded-full ring-1 backdrop-blur-sm", t.icon)}>
        <Icon name={icon} size={40} strokeWidth={1.4} />
      </span>
      {label ? (
        <span className={cn("absolute inset-x-4 bottom-4 text-center text-[11.5px] font-extrabold tracking-[.16em] uppercase", t.label)}>
          {label}
        </span>
      ) : null}
    </div>
  );
}
