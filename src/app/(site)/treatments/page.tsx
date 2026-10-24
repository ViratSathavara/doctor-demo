import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGlobal, getPage } from "@site/lib/content";
import { TREATMENTS_SLUG } from "@site/lib/wordpress/pages";
import { pageMetadata } from "@site/lib/seo";
import { JsonLd } from "@site/components/common/json-ld";
import { PageSections } from "@site/components/page/page-sections";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getPage(TREATMENTS_SLUG), getGlobal()]);
  return page ? pageMetadata(page.seo, global, page.title) : {};
}

/** Treatments: every section comes from the WordPress "Treatments" page (page_hero → treatments → cta). */
export default async function TreatmentsPage() {
  const [page, global] = await Promise.all([getPage(TREATMENTS_SLUG), getGlobal()]);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={page.schema} />
      <PageSections sections={page.sections} site={global.site} footer={global.footer} query={{ q: "", category: "", page: "" }} />
    </>
  );
}
