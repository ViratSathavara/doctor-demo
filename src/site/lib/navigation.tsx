import NextLink from "next/link";
import type { ComponentProps } from "react";
import { withBasePath } from "./utils/base-path";

/**
 * next/link for a project that lives in a sub-folder of the shared app.
 * Components keep writing "/about"; this adds the configured base path, if any.
 * Client hooks (usePathname, useRouter) are in ./navigation-hooks.
 */

type LinkProps = ComponentProps<typeof NextLink>;

function prefixHref(href: LinkProps["href"]): LinkProps["href"] {
  if (typeof href === "string") return withBasePath(href);
  return href.pathname ? { ...href, pathname: withBasePath(href.pathname) } : href;
}

export default function Link({ href, ...props }: LinkProps) {
  return <NextLink href={prefixHref(href)} {...props} />;
}
