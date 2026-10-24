import Image from "next/image";
import type { PostSummary } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { SmartLink } from "@site/components/common/smart-link";
import { TONE_CHIP } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";
import { formatDate } from "@site/lib/utils/format";

/** Blog card: featured image (or tinted icon thumb), category, date · read time, title. */
export function PostCard({ post, showExcerpt, readLabel = "Read more" }: { post: PostSummary; showExcerpt?: boolean; readLabel?: string }) {
  return (
    <SmartLink
      href={post.href}
      className="group flex h-full flex-col rounded-lg border border-line bg-white p-3 transition-[translate,box-shadow] duration-250 hover:-translate-y-1 hover:shadow-md"
    >
      <div className={cn("relative grid h-[210px] place-items-center overflow-hidden rounded-[18px]", TONE_CHIP[post.thumb.tone])}>
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(min-width: 1101px) 370px, 100vw"
            className="object-cover transition-transform duration-600 group-hover:scale-105"
          />
        ) : (
          <Icon
            name={post.thumb.icon}
            size={64}
            strokeWidth={1.1}
            className="transition-transform duration-500 group-hover:scale-112 group-hover:-rotate-4"
          />
        )}
        {post.category ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-[11px] py-1.5 text-[11.5px] font-extrabold tracking-[.08em] text-accent-700 uppercase">
            {post.category}
          </span>
        ) : null}
      </div>
      <div className="flex grow flex-col gap-2.5 px-3 pt-[18px] pb-3">
        <small className="text-[13px] text-muted">{[formatDate(post.date), post.readTime].filter(Boolean).join(" · ")}</small>
        <h3 className="text-[21px] leading-[1.3] transition-colors group-hover:text-primary">{post.title}</h3>
        {showExcerpt && post.excerpt ? <p className="text-[14.5px] leading-[1.6] text-muted">{post.excerpt}</p> : null}
        <span className="mt-auto inline-flex items-center gap-2 pt-1.5 text-sm font-extrabold text-primary">
          {readLabel}
          <Icon
            name="arrow-up-right"
            size={16}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </SmartLink>
  );
}
