import Image from "next/image";
import type { ReactNode } from "react";
import type { ArticleSettings, FooterContent, Post, SiteSettings } from "@site/types/content";
import { CountUp } from "@site/components/common/count-up";
import { Icon } from "@site/components/common/icon";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container } from "@site/components/common/ui";
import { Breadcrumbs } from "@site/components/page/breadcrumbs";
import { FaqList } from "@site/components/sections/faq-list";
import { cn } from "@site/lib/utils/cn";
import { formatDate } from "@site/lib/utils/format";
import { blogHref } from "./blog-sections";

/**
 * Typography for WordPress article HTML. Classes from the CMS aren't compiled
 * by Tailwind, so every element is styled from this wrapper instead.
 */
const prose = cn(
  "text-[17px] leading-[1.8] text-body-soft md:text-[18px] [&>*+*]:mt-[18px]",
  // Headings (h2s carry ids for the table of contents).
  "[&_h2]:mt-11 [&_h2]:scroll-mt-28 [&_h2]:text-[clamp(26px,2.6vw,32px)] [&_h2]:leading-[1.2]",
  "[&_h3]:mt-7 [&_h3]:text-[22px]",
  "[&_strong]:font-extrabold [&_strong]:text-heading [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-3",
  // Bullet lists: accent check marks.
  "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ul>li]:relative [&_ul>li]:pl-8 [&_ul>li]:text-[17px] [&_ul>li]:leading-[1.7]",
  "[&_ul>li]:before:absolute [&_ul>li]:before:top-0 [&_ul>li]:before:left-0.5 [&_ul>li]:before:font-black [&_ul>li]:before:text-accent-700 [&_ul>li]:before:content-['✓']",
  // Numbered lists: tint step badges (references keep plain numbers).
  "[&_ol:not(.references)]:flex [&_ol:not(.references)]:flex-col [&_ol:not(.references)]:gap-3.5 [&_ol:not(.references)]:[counter-reset:step]",
  "[&_ol:not(.references)>li]:relative [&_ol:not(.references)>li]:min-h-[34px] [&_ol:not(.references)>li]:pl-[50px] [&_ol:not(.references)>li]:text-[17px] [&_ol:not(.references)>li]:leading-[1.7] [&_ol:not(.references)>li]:[counter-increment:step]",
  "[&_ol:not(.references)>li]:before:absolute [&_ol:not(.references)>li]:before:top-0 [&_ol:not(.references)>li]:before:left-0 [&_ol:not(.references)>li]:before:grid [&_ol:not(.references)>li]:before:size-[34px] [&_ol:not(.references)>li]:before:place-items-center [&_ol:not(.references)>li]:before:rounded-[10px] [&_ol:not(.references)>li]:before:bg-tint-200 [&_ol:not(.references)>li]:before:text-[15px] [&_ol:not(.references)>li]:before:font-extrabold [&_ol:not(.references)>li]:before:text-primary [&_ol:not(.references)>li]:before:content-[counter(step)]",
  "[&_ol.references]:list-decimal [&_ol.references]:pl-5 [&_ol.references]:text-[15px] [&_ol.references]:leading-[1.6] [&_ol.references]:text-muted [&_ol.references>li+li]:mt-2",
  // Info box: tint card with an "i" badge; its first paragraph is the title.
  "[&_blockquote]:relative [&_blockquote]:min-h-[88px] [&_blockquote]:rounded-[18px] [&_blockquote]:border [&_blockquote]:border-line [&_blockquote]:bg-tint-50 [&_blockquote]:py-[22px] [&_blockquote]:pr-6 [&_blockquote]:pl-[86px] [&_blockquote]:text-[16px] [&_blockquote]:leading-[1.7]",
  "[&_blockquote]:before:absolute [&_blockquote]:before:top-[22px] [&_blockquote]:before:left-[26px] [&_blockquote]:before:grid [&_blockquote]:before:size-11 [&_blockquote]:before:place-items-center [&_blockquote]:before:rounded-[12px] [&_blockquote]:before:bg-primary [&_blockquote]:before:font-display [&_blockquote]:before:text-[20px] [&_blockquote]:before:text-white [&_blockquote]:before:content-['i']",
  "[&_blockquote_p:first-child]:font-display [&_blockquote_p:first-child]:text-[18px] [&_blockquote_p:first-child]:text-heading [&_blockquote_p+p]:mt-1.5",
  // Tables (WordPress wraps them in <figure class="wp-block-table">).
  "[&_figure]:overflow-x-auto [&_figure]:rounded-[18px] [&_figure]:border [&_figure]:border-line",
  "[&_table]:w-full [&_table]:min-w-[480px] [&_table]:border-collapse [&_table]:text-[15.5px] [&_table]:leading-[1.55]",
  "[&_th]:px-[18px] [&_th]:py-3.5 [&_th]:text-left [&_th]:align-top [&_td]:px-[18px] [&_td]:py-3.5 [&_td]:align-top [&_tr]:border-b [&_tr]:border-line [&_tbody_tr:last-child]:border-0",
  "[&_thead_th]:bg-primary-800 [&_thead_th]:font-display [&_thead_th]:font-normal [&_thead_th]:text-white [&_thead_th:last-child]:text-accent-light [&_tbody_th]:font-extrabold [&_tbody_th]:text-heading [&_tbody_tr:nth-child(even)]:bg-tint-50",
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
);

/** Centered light header: breadcrumbs, category pill, title, standfirst, meta row; the cover image overlaps the body below. */
export function ArticleHero({ post, blog }: { post: Post; blog: ArticleSettings }) {
  const { article, author } = blog;
  const divider = <span className="hidden h-[34px] w-px bg-line-strong sm:block" aria-hidden />;
  return (
    <section className="relative isolate bg-tint-100 pt-10 md:pt-12">
      <Container>
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-[18px] text-center">
        <Breadcrumbs
          light={false}
          className="justify-center"
          items={[
            { label: "Home", href: "/" },
            { label: "Health Blog", href: "/blogs" },
            ...(post.category ? [{ label: post.category, href: blogHref({ category: post.categorySlug }) }] : []),
            { label: post.title },
          ]}
        />
        {post.category ? (
          <span className="rounded-full bg-white px-3.5 py-[7px] text-[12.5px] font-extrabold tracking-[.12em] text-primary uppercase">
            {post.category}
          </span>
        ) : null}
        <h1 className="text-[clamp(34px,4.6vw,52px)] leading-[1.12]">{post.title}</h1>
        {post.lead ? <p className="max-w-[760px] text-[17px] leading-[1.6] text-muted md:text-[19px]">{post.lead}</p> : null}
        <div className="flex flex-wrap items-center justify-center gap-x-[22px] gap-y-3 pt-1.5 text-[14.5px]">
          {author.name ? (
            <span className="flex items-center gap-3 text-left">
              <span className="relative size-[46px] shrink-0 overflow-hidden rounded-full border-2 border-accent bg-primary">
                {author.image.src ? <Image src={author.image.src} alt="" fill sizes="46px" className="object-cover object-top" /> : null}
              </span>
              <span>
                <small className="block text-[12.5px] font-bold text-muted">{article.writtenBy}</small>
                <a href="#author-bio" className="text-[15.5px] font-extrabold text-heading hover:text-primary">
                  {author.name}
                </a>
              </span>
            </span>
          ) : null}
          {post.reviewed && article.reviewedLabel ? (
            <>
              {divider}
              <span className="flex items-center gap-2 rounded-full bg-accent-50 px-3.5 py-2 font-extrabold text-accent-700">
                <Icon name="shield-check" size={16} />
                {article.reviewedLabel}
              </span>
            </>
          ) : null}
          {divider}
          <span className="font-bold text-muted">
            {[[article.updatedLabel, formatDate(post.modified)].filter(Boolean).join(" "), post.readTime].filter(Boolean).join(" · ")}
          </span>
        </div>
        </div>
      </Container>
      {post.image ? (
        <Container wide className="relative z-2 mt-10 -mb-16 md:-mb-[130px]">
          <figure className="relative m-0 h-[240px] overflow-hidden rounded-[28px] bg-tint-200 shadow-lg sm:h-[340px] md:h-[420px]">
            <Image src={post.image.src} alt={post.image.alt} fill preload sizes="(min-width: 1281px) 1280px, 100vw" className="object-cover" />
          </figure>
        </Container>
      ) : (
        <div className="h-12" />
      )}
    </section>
  );
}

/**
 * Article HTML from WordPress (trusted editors), styled by `prose`. As in the
 * design, `cta` goes about two-thirds of the way through the sections and
 * `beforeReferences` (the FAQs) just before a "References" section.
 */
export function ArticleBody({ html, cta, beforeReferences }: { html: string; cta?: ReactNode; beforeReferences?: ReactNode }) {
  if (!html) return null;
  // Split before each <h2>: [intro, section, section, …].
  const chunks = html.split(/(?=<h2[\s>])/i);
  const refIndex = chunks.findIndex((chunk, i) => i > 0 && /^<h2[^>]*id="references"/i.test(chunk));
  const sections = (refIndex > 0 ? refIndex : chunks.length) - 1;
  const ctaIndex = sections > 1 ? 1 + Math.ceil((sections * 2) / 3) : chunks.length;
  const join = (from: number, to: number) => chunks.slice(from, to).join("");

  const parts: ReactNode[] = [];
  const push = (content: string, key: string) =>
    content.trim() && parts.push(<div key={key} className={prose} dangerouslySetInnerHTML={{ __html: content }} />);

  const contentEnd = refIndex > 0 ? refIndex : chunks.length;
  push(join(0, Math.min(ctaIndex, contentEnd)), "a");
  if (cta) parts.push(<div key="cta">{cta}</div>);
  if (ctaIndex < contentEnd) push(join(ctaIndex, contentEnd), "b");
  if (beforeReferences) parts.push(<div key="faqs">{beforeReferences}</div>);
  if (refIndex > 0) push(join(refIndex, chunks.length), "refs");
  return <>{parts}</>;
}

export function InlineCta({ data }: { data: NonNullable<Post["inlineCta"]> }) {
  return (
    <SmartLink
      href={data.cta.href}
      target={data.cta.target}
      className="group relative isolate flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-lg bg-primary-800 p-6 text-white md:p-8"
    >
      <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <span>
        <b className="block font-display text-[22px] font-normal">{data.title}</b>
        {data.text ? <span className="text-[14.5px] text-on-dark">{data.text}</span> : null}
      </span>
      <span className={buttonClass("accent", "sm")}>
        {data.cta.label}
        <Icon name="arrow-right" size={15} strokeWidth={2.2} />
      </span>
    </SmartLink>
  );
}

export function ArticleFaqs({ title, items }: { title: string; items: Post["faqs"] }) {
  if (!items.length) return null;
  return (
    <section id="faqs" className="flex scroll-mt-28 flex-col gap-4">
      <h2 className="text-[clamp(26px,2.6vw,32px)]">{title}</h2>
      <FaqList items={items} />
    </section>
  );
}

export function Disclaimer({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="rounded-lg bg-amber-50 px-5 py-4 text-[14px] leading-[1.65] text-amber">
      <strong className="font-extrabold">Medical disclaimer:</strong> {text}
    </p>
  );
}

export function AuthorBio({ author, social }: { author: ArticleSettings["author"]; social: FooterContent["social"] }) {
  if (!author.name) return null;
  return (
    <section
      id="author-bio"
      aria-label={author.eyebrow || "About the author"}
      className="mt-4 scroll-mt-28 overflow-hidden rounded-[26px] border border-line"
    >
      <div className="relative isolate flex flex-wrap items-center gap-[26px] overflow-hidden bg-primary-800 p-6 text-white md:p-[30px]">
        <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <span className="relative size-[110px] shrink-0 overflow-hidden rounded-full border-4 border-accent bg-primary md:size-[132px]">
          {author.image.src ? <Image src={author.image.src} alt={author.image.alt} fill sizes="132px" className="object-cover object-top" /> : null}
        </span>
        <span className="flex min-w-0 flex-col gap-1.5">
          {author.eyebrow ? (
            <small className="text-[12.5px] font-extrabold tracking-[.14em] text-accent-light uppercase">{author.eyebrow}</small>
          ) : null}
          <b className="font-display text-[28px] leading-tight font-normal">{author.name}</b>
          <span className="text-[16px] font-bold text-accent">{author.role}</span>
          {author.qualifications ? <span className="text-[14px] text-on-dark-2">{author.qualifications}</span> : null}
        </span>
      </div>
      <div className="flex flex-col gap-5 bg-white p-6 md:p-[30px]">
        <p className="text-[16.5px] leading-[1.75] text-body-soft">{author.bio}</p>
        {author.stats.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {author.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 rounded-[16px] bg-tint-100 px-[18px] py-4">
                <b className="font-display text-[24px] leading-none font-normal text-primary">
                  <CountUp value={stat.value} />
                </b>
                <small className="text-[13.5px] font-bold text-muted">{stat.label}</small>
              </div>
            ))}
          </div>
        ) : null}
        {author.chips.length ? (
          <div className="flex flex-wrap gap-2">
            {author.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-tint-200 px-3 py-[7px] text-[13px] font-bold text-primary-700">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex flex-wrap gap-2.5">
            {author.profile.label ? (
              <SmartLink href={author.profile.href} target={author.profile.target} className={buttonClass("outline", "sm")}>
                {author.profile.label}
              </SmartLink>
            ) : null}
            {author.book.label ? (
              <SmartLink href={author.book.href} target={author.book.target} className={buttonClass("primary", "sm")}>
                {author.book.label}
                <Icon name="arrow-right" size={15} strokeWidth={2.2} />
              </SmartLink>
            ) : null}
          </span>
          {social.length ? (
            <span className="flex gap-2">
              {social.map((item) => (
                <SmartLink
                  key={item.platform}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  aria-label={item.label}
                  className="grid size-10 place-items-center rounded-full border border-line bg-white text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Icon name={item.platform} size={17} />
                </SmartLink>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Sticky side column: talk-to-the-doctor card and related treatment links. */
export function ArticleAside({ post, blog, site }: { post: Post; blog: ArticleSettings; site: SiteSettings }) {
  const { author, article } = blog;
  const book = blog.book;
  return (
    <aside className="flex flex-col gap-5">
      {post.sidebarCta.title ? (
        <div className="overflow-hidden rounded-[22px] bg-primary-800 text-white">
          {author.image.src ? (
            <span className="relative block h-[170px] bg-primary">
              <Image src={author.image.src} alt={author.name} fill sizes="300px" className="object-cover object-[50%_28%]" />
            </span>
          ) : null}
          <div className="relative isolate flex flex-col gap-2.5 overflow-hidden p-5">
            <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
            <b className="font-display text-[19px] leading-tight font-normal">{post.sidebarCta.title}</b>
            {post.sidebarCta.text ? <span className="text-[14px] leading-[1.55] text-on-dark">{post.sidebarCta.text}</span> : null}
            {book.label && book.href !== "#" ? <SmartLink href={book.href} target={book.target} className={buttonClass("accent", "block", "mt-1")}>
              {book.label}
            </SmartLink> : null}
            {site.phone ? (
              <a href={site.phoneHref} className={buttonClass("ghostLight", "block")}>
                <Icon name="phone" size={17} strokeWidth={2} />
                {site.phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
      {post.relatedTreatments.length ? (
        <div className="flex flex-col gap-2 rounded-lg border border-line bg-white p-6">
          <b className="mb-1 font-display text-[20px] font-normal text-heading">{article.relatedTreatmentsTitle}</b>
          {post.relatedTreatments.map((item) => (
            <SmartLink
              key={item.label}
              href={item.href}
              target={item.target}
              className="group flex items-center justify-between rounded-[12px] px-3 py-2.5 text-[14.5px] font-bold text-body transition-colors hover:bg-tint-100 hover:text-primary"
            >
              {item.label}
              <Icon name="arrow-right" size={15} strokeWidth={2.2} className="text-primary transition-transform group-hover:translate-x-0.5" />
            </SmartLink>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
