import type { BlogListSection, Cf7Form, SiteSettings } from "@site/types/content";
import { filterPosts } from "@site/lib/utils/blog";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, Section } from "@site/components/common/ui";
import { BlogSidebar, blogHref, CategoryChips, FeaturedPost, Pagination } from "./blog-sections";
import { PostCard } from "./post-card";

/** Cards per listing page (two per row). */
const PAGE_SIZE = 10;

/** Fixed UI text (WordPress has no field for it). */
const NO_RESULTS = "No articles found. Try another word or category.";

/** Listing filters from the URL: `?q=` search, `?category=` slug, `?page=` number. */
export interface BlogListQuery {
  q: string;
  category: string;
  page: string;
}

/**
 * `blog_list`: featured post, filterable / paginated cards and the sidebar.
 * Search and filters are GET links, so they work without JavaScript and stay shareable.
 */
export function BlogList({
  data,
  query,
  site,
  newsletterForm,
}: {
  data: BlogListSection;
  query: BlogListQuery;
  site: SiteSettings;
  newsletterForm?: Cf7Form;
}) {
  const { q, category } = query;
  const filtering = Boolean(q || category);
  const all = data.featured ? [data.featured, ...data.posts.filter((post) => post.slug !== data.featured?.slug)] : data.posts;

  // The featured card shows on the unfiltered first page; it is not repeated in the grid.
  const featured = filtering ? undefined : data.featured;
  const matches = filterPosts(all, { q, category }).filter((post) => post !== featured);
  const pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(query.page, 10) || 1), pages);
  const visible = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {featured && page === 1 ? (
        <Section className="pb-0 md:pb-0">
          <Container>
            <FeaturedPost post={featured} label={data.featuredLabel} readLabel={data.readLabel} author={data.author} />
          </Container>
        </Section>
      ) : null}
      <Section id="articles" className="scroll-mt-24">
        <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex min-w-0 flex-col gap-8">
            <CategoryChips categories={data.categories} active={category} query={q} allLabel={data.allLabel} />
            {q ? (
              <p className="-mt-3 text-[15px] text-muted">
                {matches.length} {matches.length === 1 ? "result" : "results"} for “<b className="text-heading">{q}</b>”
              </p>
            ) : null}
            {visible.length ? (
              <div className="grid gap-[22px] md:grid-cols-2">
                {visible.map((post, i) => (
                  <Reveal key={post.slug} delay={(i % 2) * 0.08}>
                    <PostCard post={post} showExcerpt readLabel={data.readMoreLabel || undefined} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-line-strong bg-tint-50 p-8">
                <p className="text-[16px] font-bold text-heading">{NO_RESULTS}</p>
                <SmartLink href={blogHref({})} className={buttonClass("outline", "sm")}>
                  {data.allLabel}
                </SmartLink>
              </div>
            )}
            <Pagination page={page} pages={pages} query={q} category={category} />
          </div>
          <BlogSidebar
            data={data.sidebar}
            author={data.author}
            site={site}
            categories={data.categories}
            mostRead={data.mostRead}
            activeCategory={category}
            newsletterForm={newsletterForm}
          />
        </Container>
      </Section>
    </>
  );
}
