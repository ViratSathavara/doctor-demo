import { Fragment } from "react";
import type { Breadcrumb } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { SmartLink } from "@site/components/common/smart-link";
import { cn } from "@site/lib/utils/cn";

/** Breadcrumb trail for inner-page heroes; the last item is the current page. */
export function Breadcrumbs({ items, light = true, className }: { items: Breadcrumb[]; light?: boolean; className?: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-[13.5px] font-bold", light ? "text-on-dark-2" : "text-muted", className)}>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? (
              <li aria-hidden className="opacity-60">
                <Icon name="chevron-down" size={13} strokeWidth={2.4} className="-rotate-90" />
              </li>
            ) : null}
            <li>
              {item.href ? (
                <SmartLink
                  href={item.href}
                  className={cn("transition-colors", light ? "hover:text-accent-light" : "hover:text-primary")}
                >
                  {item.label}
                </SmartLink>
              ) : (
                <span aria-current={i === items.length - 1 ? "page" : undefined} className={light ? "text-white" : "text-heading"}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
