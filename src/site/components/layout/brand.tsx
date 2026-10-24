import type { ComponentProps } from "react";
import type { Brand as BrandContent } from "@site/types/content";
import { SmartLink } from "@site/components/common/smart-link";
import { cn } from "@site/lib/utils/cn";

/** Logo mark + two-line word mark (hospital.config.ts -> wordmark). `onDark` is the footer version. */
export function Brand({
  brand,
  href = "/#top",
  label,
  onDark,
  className,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { brand: BrandContent; href?: string; label?: string; onDark?: boolean }) {
  return (
    <SmartLink href={href} className={cn("flex items-center gap-3", className)} aria-label={label} {...props}>
      {brand.logo.src && (
        // eslint-disable-next-line @next/next/no-img-element -- small SVG mark, no optimisation needed
        <img src={brand.logo.src} alt="" width={48} height={48} className="size-12 shrink-0" />
      )}
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[24px] font-semibold tracking-[0.08em]", onDark ? "text-white" : "text-primary-900")}>
          {brand.name}
        </span>
        <span className={cn("mt-1.5 text-[10.5px] font-bold tracking-[0.3em]", onDark ? "text-accent-light" : "text-accent")}>
          {brand.tagline}
        </span>
      </span>
    </SmartLink>
  );
}
