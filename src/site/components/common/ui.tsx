import type { ComponentProps, ReactNode } from "react";
import type { Tone } from "@site/types/content";
import { cn } from "@site/lib/utils/cn";

/** Centered page column (1200px; `wide` = 1480px for the header bars). */
export function Container({ wide, className, ...props }: ComponentProps<"div"> & { wide?: boolean }) {
  return (
    <div
      className={cn("mx-auto w-full px-4 md:px-6", wide ? "max-w-wide" : "max-w-shell", className)}
      {...props}
    />
  );
}

const SECTION_TONE = {
  white: "bg-white",
  tint: "bg-tint-100",
  dark: "bg-primary-800 text-white",
} as const;

/** Standard vertical rhythm for page sections; `compact` for bands and closing CTAs. */
export function Section({
  tone = "white",
  compact,
  className,
  ...props
}: ComponentProps<"section"> & { tone?: keyof typeof SECTION_TONE; compact?: boolean }) {
  return (
    <section
      className={cn("relative", compact ? "py-14 md:py-20" : "py-19 md:py-26", SECTION_TONE[tone], className)}
      {...props}
    />
  );
}

/** Small uppercase label with a leading rule. */
export function Eyebrow({
  center,
  light,
  small,
  className,
  children,
}: {
  center?: boolean;
  light?: boolean;
  small?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-extrabold tracking-[.18em] uppercase",
        small ? "text-[11.5px]" : "text-[12.5px]",
        "before:h-[1.5px] before:w-7 before:bg-current before:opacity-70 before:content-['']",
        light ? "text-accent-light" : "text-accent-700",
        center && "justify-center",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section h2 size; `<em>` accent words turn primary (accent on dark backgrounds). */
export const h2Class = (light?: boolean) =>
  cn(
    "text-[clamp(29px,3.6vw,43px)] [&_em]:italic",
    light ? "text-white [&_em]:text-accent" : "[&_em]:text-primary",
  );

export const leadClass = "text-[17px] leading-[1.7] text-muted";

/** Decorative outline circle used on dark/accent panels. Position and size via className. */
export function DecoRing({ className, color = "border-white/12" }: { className?: string; color?: string }) {
  return <span className={cn("pointer-events-none absolute rounded-full border", color, className)} aria-hidden />;
}

/** Icon chip colours shared by quick actions, about cards and blog thumbs. */
export const TONE_CHIP: Record<Tone, string> = {
  primary: "bg-tint-200 text-primary",
  accent: "bg-accent-50 text-accent-700",
  amber: "bg-amber-50 text-amber",
};

const BUTTON_VARIANT = {
  primary: "bg-primary text-white shadow-primary hover:bg-primary-700",
  accent: "bg-accent text-accent-ink shadow-accent",
  white: "bg-white text-primary",
  whiteTeal: "bg-white text-accent-800",
  dark: "bg-primary-900 text-white",
  ghostLight: "border-white/28 bg-white/4 text-white hover:bg-white/10",
  outline: "border-line bg-white text-heading hover:border-primary hover:text-primary",
  borderOutline: "border-line bg-white text-heading shadow-md hover:border-primary hover:text-primary",
} as const;

const BUTTON_SIZE = {
  md: "min-h-[54px] px-[26px] py-3 text-[15px]",
  sm: "min-h-11 px-5 py-2 text-sm",
  block: "min-h-14 w-full px-[26px] py-3 text-base",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT;

/** Pill button classes; the trailing icon nudges right on hover. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: keyof typeof BUTTON_SIZE = "md",
  className?: string,
) {
  return cn(
    "inline-flex min-w-0 cursor-pointer items-center justify-center gap-2.5 rounded-full border-[1.5px] text-center leading-snug font-bold whitespace-normal [&_svg]:shrink-0",
    !["ghostLight", "outline", "borderOutline"].includes(variant) && "border-transparent",
    "transition-[translate,box-shadow,background-color,color,border-color] duration-200 hover:-translate-y-0.5",
    "[&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-[3px]",
    "disabled:cursor-progress disabled:opacity-70 disabled:hover:translate-y-0",
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    className,
  );
}

/** Text link with an up-right arrow that lifts on hover. */
export const linkArrowClass =
  "inline-flex items-center gap-2 text-[15px] font-extrabold text-primary [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-0.5";
