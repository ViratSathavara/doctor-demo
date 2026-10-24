"use client";

import { useEffect, useState } from "react";
import { cn } from "@site/lib/utils/cn";

/** "In this article" links; the section being read is highlighted. */
export function ArticleToc({ title, items }: { title: string; items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((el) => el !== null);
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const links = (
    <ol className="flex flex-col border-l-2 border-line">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              "-ml-0.5 block border-l-2 py-1.5 pl-4 text-[14px] leading-[1.4] font-bold transition-colors",
              active === item.id ? "border-primary text-primary" : "border-transparent text-muted hover:text-heading",
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <details className="group rounded-lg border border-line bg-tint-50 p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[18px] text-heading">
          {title}
          <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>
            +
          </span>
        </summary>
        <div className="mt-3">{links}</div>
      </details>
      <nav aria-label={title} className="flex flex-col gap-3 max-lg:hidden">
        <span className="text-[12px] font-extrabold tracking-[.14em] text-accent-700 uppercase">{title}</span>
        {links}
      </nav>
    </>
  );
}
