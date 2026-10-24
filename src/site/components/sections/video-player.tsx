"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@site/lib/utils/cn";
import { youtubeId } from "@site/lib/utils/format";

/**
 * Lite YouTube embed: shows the thumbnail + play button and only loads the
 * iframe (youtube-nocookie) after a click. Invalid or placeholder IDs render
 * the empty "Add YouTube video ID" state from the design.
 */
export function VideoPlayer({
  id,
  label,
  large,
  fill,
}: {
  id: string;
  label: string;
  large?: boolean;
  /** On desktop, grow to fill the parent's height instead of keeping 16:9. */
  fill?: boolean;
}) {
  const videoId = youtubeId(id);
  const [playing, setPlaying] = useState(false);
  const frame = cn(
    "relative block aspect-video w-full overflow-hidden",
    large ? "rounded-xl" : "rounded-lg",
    fill && "lg:aspect-auto lg:min-h-[320px] lg:flex-1",
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {videoId && playing ? (
        <motion.div
          key="frame"
          className={cn(frame, "bg-black")}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </motion.div>
      ) : (
        <motion.button
          key="poster"
          type="button"
          aria-label={label}
          onClick={() => videoId && setPlaying(true)}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            frame,
            "group cursor-pointer border-0 bg-linear-150 from-primary-800 to-primary-900 bg-cover bg-center p-0",
            "before:absolute before:top-1/2 before:left-1/2 before:aspect-square before:w-[70%] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-white/8 before:content-['']",
          )}
          style={
            videoId
              ? {
                  backgroundImage: `linear-gradient(rgba(11,33,64,.15),rgba(11,33,64,.35)),url('https://i.ytimg.com/vi/${videoId}/hqdefault.jpg')`,
                }
              : undefined
          }
        >
          {videoId ? null : (
            <span className="absolute inset-x-0 bottom-4 text-center text-[13px] font-bold text-on-dark-2">
              [Add YouTube video ID]
            </span>
          )}
          <span
            className={cn(
              "absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-primary transition-transform duration-250 group-hover:scale-108",
              "after:absolute after:-inset-2.5 after:animate-pulse-ring after:rounded-full after:border-2 after:border-white/45 after:content-['']",
              large ? "size-[92px]" : "size-16",
            )}
          >
            <svg width={large ? 34 : 26} height={large ? 34 : 26} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5l11 7-11 7z" />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
