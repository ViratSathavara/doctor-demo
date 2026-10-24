import Image from "next/image";
import type { BlogHeroSection, BlogListSection, Cf7Form, PostAuthor, PostSummary, SiteSettings } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, DecoRing, TONE_CHIP } from "@site/components/common/ui";
import { NewsletterForm } from "@site/components/layout/newsletter-form";
import { PageHero } from "@site/components/page/page-hero";
import { withBasePath } from "@site/lib/utils/base-path";
import { cn } from "@site/lib/utils/cn";
import { formatDate } from "@site/lib/utils/format";

/** Listing URL with filters, e.g. blogHref({ category: "pcos" }) → "/blogs?category=pcos". */
export function blogHref(params: { q?: string; category?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/blogs?${query}` : "/blogs";
}

/** `page_hero` with a search box and the "medically reviewed" note (Blogs). */
export function BlogHero({ data: hero, query }: { data: BlogHeroSection; query: string }) {
  return (
    <PageHero crumbs={[{ label: "Home", href: "/" }, { label: hero.breadcrumb }]} title={hero.title} lead={hero.lead}>
      {/* GET form: works without JavaScript and keeps searches shareable. */}
      <form role="search" action={withBasePath("/blogs")} className="flex w-full max-w-[620px] gap-2 rounded-full border border-white/16 bg-white p-1.5 shadow-float">
        <label className="flex min-w-0 grow items-center gap-2.5 pl-4 text-muted">
          <span className="sr-only">{hero.searchButton}</span>
          <Icon name="search" size={19} strokeWidth={2} className="shrink-0 text-primary" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={hero.searchPlaceholder}
            className="h-11 min-w-0 grow border-0 bg-transparent text-[15px] text-body outline-none"
          />
        </label>
        <button type="submit" className={buttonClass("primary", "sm")}>
          {hero.searchButton}
        </button>
      </form>
      {hero.note.text ? (
        <div className="flex items-center gap-3 self-start rounded-full border border-white/12 bg-white/6 py-1.5 pr-5 pl-1.5 text-[13.5px] font-bold text-on-dark">
          <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-primary">
            {hero.note.image ? <Image src={hero.note.image.src} alt="" fill sizes="36px" className="object-cover object-top" /> : null}
          </span>
          <Icon name="shield-check" size={17} className="shrink-0 text-accent-light" />
          {hero.note.text}
        </div>
      ) : null}
    </PageHero>
  );
}

export function FeaturedPost({ post, label, readLabel, author }: { post: PostSummary; label: string; readLabel: string; author: PostAuthor }) {
  return (
    <Reveal>
      <SmartLink
        href={post.href}
        className="group grid overflow-hidden rounded-xl border border-line bg-white shadow-md transition-shadow hover:shadow-lg lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
      >
        <div className={cn("relative grid min-h-[260px] place-items-center overflow-hidden lg:min-h-[400px]", TONE_CHIP[post.thumb.tone])}>
          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              sizes="(min-width: 1101px) 640px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-104"
            />
          ) : (
            <Icon name={post.thumb.icon} size={96} strokeWidth={1} />
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
          <span className="flex flex-wrap gap-2">
            {label ? (
              <span className="rounded-full bg-primary px-3 py-1.5 text-[11.5px] font-extrabold tracking-[.08em] text-white uppercase">{label}</span>
            ) : null}
            {post.category ? (
              <span className="rounded-full bg-accent-50 px-3 py-1.5 text-[11.5px] font-extrabold tracking-[.08em] text-accent-700 uppercase">
                {post.category}
              </span>
            ) : null}
          </span>
          <h2 className="text-[clamp(26px,2.8vw,36px)] leading-[1.15] transition-colors group-hover:text-primary">{post.title}</h2>
          {post.excerpt ? <p className="text-[16px] leading-[1.7] text-muted">{post.excerpt}</p> : null}
          <span className="mt-2 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-tint-200">
              {author.image ? <Image src={author.image.src} alt="" fill sizes="44px" className="object-cover object-top" /> : null}
            </span>
            <span className="grow">
              <b className="block text-[14.5px] text-heading">{author.name}</b>
              <small className="text-[13px] text-muted">{[formatDate(post.date), post.readTime].filter(Boolean).join(" · ")}</small>
            </span>
            <span className={buttonClass("primary", "sm")}>
              {readLabel}
              <Icon name="arrow-right" size={15} strokeWidth={2.2} />
            </span>
          </span>
        </div>
      </SmartLink>
    </Reveal>
  );
}

/** Category chips above the grid; links so filters are shareable and work without JavaScript. */
export function CategoryChips({
  categories,
  active,
  query,
  allLabel,
}: {
  categories: { slug: string; name: string; count: number }[];
  active: string;
  query: string;
  allLabel: string;
}) {
  const chip = (on: boolean) =>
    cn(
      "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-bold transition-colors",
      on ? "border-primary bg-primary text-white shadow-primary" : "border-line bg-white text-body hover:border-primary hover:text-primary",
    );
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
      <SmartLink href={blogHref({ q: query })} className={chip(!active)} aria-current={!active ? "page" : undefined}>
        {allLabel}
      </SmartLink>
      {categories.map((category) => (
        <SmartLink
          key={category.slug}
          href={blogHref({ q: query, category: category.slug })}
          className={chip(active === category.slug)}
          aria-current={active === category.slug ? "page" : undefined}
        >
          {category.name}
        </SmartLink>
      ))}
    </nav>
  );
}

export function Pagination({ page, pages, query, category }: { page: number; pages: number; query: string; category: string }) {
  if (pages < 2) return null;
  const item = "grid size-11 place-items-center rounded-full border text-[14.5px] font-bold transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap justify-center gap-2">
      {page > 1 ? (
        <SmartLink href={blogHref({ q: query, category, page: page - 1 })} className={cn(item, "border-line bg-white hover:border-primary")} aria-label="Previous page">
          <Icon name="arrow-right" size={16} strokeWidth={2.2} className="rotate-180" />
        </SmartLink>
      ) : null}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <SmartLink
          key={n}
          href={blogHref({ q: query, category, page: n })}
          aria-current={n === page ? "page" : undefined}
          className={cn(item, n === page ? "border-primary bg-primary text-white" : "border-line bg-white hover:border-primary hover:text-primary")}
        >
          {n}
        </SmartLink>
      ))}
      {page < pages ? (
        <SmartLink href={blogHref({ q: query, category, page: page + 1 })} className={cn(item, "border-line bg-white hover:border-primary")} aria-label="Next page">
          <Icon name="arrow-right" size={16} strokeWidth={2.2} />
        </SmartLink>
      ) : null}
    </nav>
  );
}

const sideCard = "flex flex-col gap-4 rounded-lg border border-line bg-white p-6";
const sideTitle = "font-display text-[21px] font-normal text-heading";

export function BlogSidebar({
  data,
  author,
  site,
  categories,
  mostRead,
  activeCategory,
  newsletterForm,
}: {
  data: BlogListSection["sidebar"];
  author: PostAuthor;
  site: SiteSettings;
  categories: { slug: string; name: string; count: number }[];
  mostRead: PostSummary[];
  activeCategory: string;
  /** The footer's newsletter form (Contact Form 7); without it the sign-up box is hidden. */
  newsletterForm?: Cf7Form;
}) {
  const { doctor, newsletter } = data;
  return (
    <aside className="flex flex-col gap-5">
      {doctor.title ? (
        <div className="relative isolate flex flex-col gap-4 overflow-hidden rounded-lg bg-primary-800 p-6 text-white">
          <div className="glow-book pointer-events-none absolute inset-0 -z-10" aria-hidden />
          <DecoRing className="-top-[60px] -right-[60px] size-[170px]" />
          <div className="flex items-center gap-3.5">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-primary">
              {author.image ? <Image src={author.image.src} alt={author.name} fill sizes="64px" className="object-cover object-top" /> : null}
            </span>
            <b className="font-display text-[21px] leading-[1.2] font-normal">{doctor.title}</b>
          </div>
          {doctor.text ? <p className="text-[14.5px] text-on-dark">{doctor.text}</p> : null}
          {doctor.cta.label ? (
            <SmartLink href={doctor.cta.href} target={doctor.cta.target} className={buttonClass("accent", "block")}>
              {doctor.cta.label}
            </SmartLink>
          ) : null}
          {doctor.callLabel && site.phone ? (
            <a href={site.phoneHref} className={buttonClass("ghostLight", "block")}>
              <Icon name="phone" size={17} strokeWidth={2} />
              {doctor.callLabel} {site.phone}
            </a>
          ) : null}
        </div>
      ) : null}

      {categories.length ? (
        <div className={sideCard}>
          <h2 className={sideTitle}>{data.categoriesTitle}</h2>
          <ul className="flex flex-col gap-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <SmartLink
                  href={blogHref({ category: category.slug })}
                  className={cn(
                    "flex items-center justify-between rounded-[12px] px-3 py-2.5 text-[14.5px] font-bold transition-colors",
                    activeCategory === category.slug ? "bg-tint-200 text-primary" : "text-body hover:bg-tint-100 hover:text-primary",
                  )}
                >
                  {category.name}
                  <span className="grid min-w-7 place-items-center rounded-full bg-tint-100 px-2 py-0.5 text-[12px] text-primary">
                    {category.count}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mostRead.length ? (
        <div className={sideCard}>
          <h2 className={sideTitle}>{data.mostReadTitle}</h2>
          <ol className="flex flex-col gap-1">
            {mostRead.map((post, i) => (
              <li key={post.slug}>
                <SmartLink href={post.href} className="group flex gap-3.5 rounded-[12px] p-2 transition-colors hover:bg-tint-100">
                  <span className="font-display text-[26px] leading-none text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <b className="block text-[14.5px] leading-[1.35] text-heading transition-colors group-hover:text-primary">{post.title}</b>
                    {post.readTime ? <small className="text-[12.5px] text-muted">{post.readTime}</small> : null}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {newsletter.title && newsletterForm ? (
        <div className={cn(sideCard, "bg-tint-100")}>
          <div>
            <h2 className={sideTitle}>{newsletter.title}</h2>
            {newsletter.text ? <p className="mt-1 text-[14px] text-muted">{newsletter.text}</p> : null}
          </div>
          <NewsletterForm
            placeholder={newsletterForm.fields.find((field) => field.type === "email")?.placeholder ?? ""}
            button={newsletterForm.submitLabel}
            form={newsletterForm}
            light
          />
        </div>
      ) : null}

      {data.topics.length ? (
        <div className={sideCard}>
          <h2 className={sideTitle}>{data.topicsTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic) => (
              <SmartLink
                key={topic.label}
                href={blogHref({ q: topic.search })}
                className="rounded-full bg-tint-100 px-3 py-1.5 text-[13px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {topic.label}
              </SmartLink>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
