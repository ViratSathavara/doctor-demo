import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGlobal, getPage } from "@site/lib/content";
import { pageMetadata } from "@site/lib/seo";
import { param } from "@site/lib/utils/blog";
import { JsonLd } from "@site/components/common/json-ld";
import { PageSections } from "@site/components/page/page-sections";

/*
 * Any WordPress page built from sections — About, Success Stories, Blogs,
 * Contact Us, and pages added later — at /<slug>. Routes with their own
 * folder take precedence.
 *
 * Rendered per request (the blog listing reads ?q / ?category / ?page), so
 * nothing is built ahead; the WordPress responses stay cached for 5 minutes.
 * Don't add generateStaticParams (not even `[]`): a path rendered as static
 * that then reads searchParams fails at runtime ("static to dynamic") with a 500.
 */
export const revalidate = 300;

export async function generateMetadata({ params, searchParams }: PageProps<"/[slug]">): Promise<Metadata> {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const [page, global] = await Promise.all([getPage(slug), getGlobal()]);
  if (!page) return {};
  const metadata = pageMetadata(page.seo, global, page.title);
  // Searched / filtered / paginated blog listings point to the listing and stay out of the index.
  const filtered = slug === "blogs" && Boolean(param(search.q) || param(search.category) || param(search.page));
  return filtered ? { ...metadata, robots: { index: false, follow: false } } : metadata;
}

export default async function WordPressPage({ params, searchParams }: PageProps<"/[slug]">) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const [page, global] = await Promise.all([getPage(slug), getGlobal()]);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={page.schema} />
      <PageSections
        sections={page.sections}
        site={global.site}
        footer={global.footer}
        query={{ q: param(search.q), category: param(search.category), page: param(search.page) }}
      />
    </>
  );
}
