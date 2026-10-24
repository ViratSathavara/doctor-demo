import Link from "@site/lib/navigation";
import type { ComponentProps } from "react";
import { withBasePath } from "@site/lib/utils/base-path";

type Props = Omit<ComponentProps<"a">, "href"> & { href: string };

/**
 * Internal routes go through next/link; hash links ("/#book", "#"), tel:,
 * mailto: and external URLs render a plain <a> so in-page anchors keep the
 * browser's native smooth scrolling. External new-tab links get rel="noopener noreferrer".
 */
export function SmartLink({ href, target, rel, ...props }: Props) {
  target ??= /^(https?:)?\/\//i.test(href) ? "_blank" : undefined;
  const safeRel = target === "_blank" ? Array.from(new Set(`${rel ?? ""} noopener noreferrer`.trim().split(/\s+/))).join(" ") : rel;
  const isInternalRoute = href.startsWith("/") && !href.startsWith("//") && !href.includes("#");
  if (isInternalRoute) return <Link href={href} target={target} rel={safeRel} {...props} />;
  return <a href={withBasePath(href)} target={target} rel={safeRel} {...props} />;
}
