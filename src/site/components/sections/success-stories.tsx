import type { SuccessStoriesSection, VideoTestimonial } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { RichText } from "@site/components/common/rich-text";
import { buttonClass, Container, Section } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";
import { VideoPlayer } from "./video-player";

function Video({ video, large }: { video: VideoTestimonial; large?: boolean }) {
  return (
    <div className="relative flex h-full flex-col gap-3.5">
      <VideoPlayer
        id={video.youtubeId}
        label={`Play patient testimonial video ${video.position}`}
        large={large}
        fill={large}
      />
      {/* Fixed slot number (from the CMS order), so editors can see which card is which. */}
      <span
        className={cn(
          "pointer-events-none absolute top-3 left-3 z-10 grid place-items-center rounded-full border border-white/25 bg-primary-900/60 font-display text-white shadow-sm backdrop-blur-md",
          large ? "size-11 text-base" : "size-9 text-sm",
        )}
        aria-hidden
      >
        {String(video.position).padStart(2, "0")}
      </span>
      <span className="flex items-center justify-between gap-3">
        <span>
          <b className={cn("block font-display font-normal text-heading", large ? "text-2xl" : "text-lg")}>
            {video.name}
          </b>
          <small className="text-[13.5px] text-muted">{video.location}</small>
        </span>
        {video.tag ? <span className="text-[12.5px] font-extrabold text-primary">{video.tag}</span> : null}
      </span>
    </div>
  );
}

/**
 * Videos arrive sorted by their CMS `order` number (see the home mapper):
 * #1 is the large video, #2–3 sit beside it, and #4 onwards fill rows of three.
 */
export function SuccessStories({ data }: { data: SuccessStoriesSection }) {
  const [first, ...rest] = data.videos;
  const side = rest.slice(0, 2);
  const rows = rest.slice(2);

  return (
    <Section tone="tint" id="success-stories">
      <Container>
        <SectionHead heading={data}>
          <SmartLink href={data.channel.href} target={data.channel.target} className={buttonClass("primary")}>
            <Icon name="play" size={18} />
            {data.channel.label}
          </SmartLink>
        </SectionHead>
        {first ? (
          <div className={cn("grid gap-6", side.length > 0 && "lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]")}>
            {/* Stretches to the height of the side column, so there is no gap under it. */}
            <Reveal className="h-full">
              <Video video={first} large />
            </Reveal>
            {side.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:flex lg:flex-col lg:gap-[22px]">
                {side.map((video, i) => (
                  <Reveal key={video.position} delay={0.1 + i * 0.1}>
                    <Video video={video} />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* {rows.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((video, i) => <Reveal key={video.position} delay={(i % 3) * 0.1}><Video video={video} /></Reveal>)}
          </div>
        ) : null} */}
        <RichText html={data.note} className="rt mt-[34px] text-center text-[13px] text-muted" />
      </Container>
    </Section>
  );
}
