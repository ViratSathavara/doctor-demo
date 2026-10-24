import { cn } from "@site/lib/utils/cn";

/** Licensed stock photos live in /images/stock/ until the hospital's own photos replace them. */
export const isStockImage = (src: string | undefined) => Boolean(src?.includes("/images/stock/"));

/**
 * "Representative image" tag for stock photos, so they are not taken for the
 * hospital's own rooms. `show` is the CMS `representative` flag; without it
 * the tag follows the local /images/stock/ folder. `label` is the CMS text, when it has one.
 */
export function StockBadge({ src, show, label, className }: { src: string | undefined; show?: boolean; label?: string; className?: string }) {
  if (!(show ?? isStockImage(src))) return null;
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3 left-3 rounded-full bg-ink/60 px-2.5 py-1 text-[10.5px] font-bold tracking-[.04em] text-white backdrop-blur-sm",
        className,
      )}
    >
      {label || "Representative image"}
    </span>
  );
}
