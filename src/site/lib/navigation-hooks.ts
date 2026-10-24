"use client";

import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { useMemo } from "react";
import { withBasePath, withoutBasePath } from "./utils/base-path";

/** next/navigation hooks that hide the configured base path: paths in and out look like "/about". */

export function usePathname() {
  return withoutBasePath(useNextPathname());
}

export function useRouter() {
  const router = useNextRouter();
  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) => router.push(withBasePath(href), options),
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
        router.replace(withBasePath(href), options),
      prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) =>
        router.prefetch(withBasePath(href), options),
    }),
    [router],
  );
}
