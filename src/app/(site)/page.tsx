import type { Metadata } from "next";
import { getGlobal, getHomePage } from "@site/lib/content";
import { pageMetadata } from "@site/lib/seo";
import { JsonLd } from "@site/components/common/json-ld";
import { PageSections } from "@site/components/page/page-sections";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [home, global] = await Promise.all([getHomePage(), getGlobal()]);
  return pageMetadata(home.seo, global);
}

export default async function HomePage() {
  const [home, global] = await Promise.all([getHomePage(), getGlobal()]);
  return <>
    <JsonLd data={home.schema} />
    <PageSections sections={home.sections} site={global.site} footer={global.footer} query={{ q: "", category: "", page: "" }} />
  </>;
}
