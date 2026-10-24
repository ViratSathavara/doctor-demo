import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PageContent } from "@site/types/content";
import { getGlobal, getTreatmentPage, getTreatmentSlugs } from "@site/lib/content";
import { pageMetadata } from "@site/lib/seo";
import { JsonLd } from "@site/components/common/json-ld";
import { findSection, PageSections } from "@site/components/page/page-sections";

/*
 * Treatment pages (IVF, ICSI and any added later): children of the WordPress
 * "Treatments" page, served at /treatments/<slug>. Sections, SEO and schema
 * all come from WordPress; an unknown or unpublished slug is a 404.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    return (await getTreatmentSlugs()).map((slug) => ({ slug }));
  } catch {
    return []; // WordPress unreachable at build time: pages render on first request instead.
  }
}

/** Home › Treatments › <hero breadcrumb or page title>. There is no main Treatments page, so that crumb isn't a link. */
function crumbsFor(page: PageContent) {
  const label = findSection(page.sections, "page_hero")?.data.breadcrumb || page.title;
  return [{ label: "Home", href: "/" }, { label: "Treatments" }, { label }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [page, global] = await Promise.all([getTreatmentPage(slug), getGlobal()]);
  return page ? pageMetadata(page.seo, global, page.title) : {};
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, global] = await Promise.all([getTreatmentPage(slug), getGlobal()]);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={page.schema} />
      <PageSections
        sections={page.sections}
        site={global.site}
        footer={global.footer}
        query={{ q: "", category: "", page: "" }}
        crumbs={crumbsFor(page)}
      />
    </>
  );
}
