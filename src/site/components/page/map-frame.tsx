"use client";

import { useState } from "react";
import { cn } from "@site/lib/utils/cn";
import { placeEmbedUrl } from "@site/lib/utils/maps";

const VIEWS = [
  { key: "m", label: "Map" },
  { key: "k", label: "Satellite" },
] as const;

type View = (typeof VIEWS)[number]["key"];

/** Pinned map (see placeEmbedUrl) with a Map / Satellite switch. */
export function MapFrame({ query, title, className }: { query: string; title: string; className?: string }) {
  const [view, setView] = useState<View>("m");

  return (
    <div className={cn("relative isolate overflow-hidden bg-tint-100", className)}>
      <iframe
        key={view}
        className="absolute inset-0 -z-10 size-full border-0"
        title={title}
        src={placeEmbedUrl(query, view)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div role="group" aria-label="Map view" className="absolute top-4 left-4 flex rounded-full bg-white p-1 shadow-md">
        {VIEWS.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={view === option.key}
            onClick={() => setView(option.key)}
            className={cn(
              "h-10 cursor-pointer rounded-full px-5 text-[14.5px] font-bold transition-colors",
              view === option.key ? "bg-primary text-white shadow-primary" : "text-heading hover:text-primary",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
