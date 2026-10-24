import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoctor, getGlobal } from "@site/lib/content";
import { pageMetadata } from "@site/lib/seo";
import { JsonLd } from "@site/components/common/json-ld";
import { Container, Section } from "@site/components/common/ui";
import {
  Background,
  BookingCard,
  Certificates,
  DoctorAbout,
  DoctorHero,
  Expertise,
  QuickFacts,
} from "@site/components/doctor/doctor-sections";
import { PageSections } from "@site/components/page/page-sections";

/** wp-admin edits show within 5 minutes; a doctor added later renders without a rebuild. */
export const revalidate = 300;
export const dynamicParams = true;

const NO_QUERY = { q: "", category: "", page: "" };

// Demo site: nothing is prerendered at build time; each page renders on its first visit, then is cached.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const [doctor, global] = await Promise.all([getDoctor((await params).slug), getGlobal()]);
  if (!doctor) return {};
  return pageMetadata(doctor.seo, global, doctor.name, {
    type: "profile",
  });
}

/** Every part of the profile comes from WordPress (Doctors → <name>); see NEXTJS-DOCTOR-GUIDE.md. */
export default async function DoctorPage({ params }: PageProps<"/doctors/[slug]">) {
  const { slug } = await params;
  const [doctor, global] = await Promise.all([getDoctor(slug), getGlobal()]);
  if (!doctor) notFound();
  const { site, footer } = global;

  return (
    <>
      <JsonLd data={doctor.schema} />
      <DoctorHero doctor={doctor} site={site} />
      <QuickFacts facts={doctor.facts} />
      <Section className="pt-14 md:pt-20">
        <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-16">
            <DoctorAbout data={doctor.about} />
            <Expertise data={doctor.expertise} />
            <Background doctor={doctor} />
            <Certificates data={doctor.certificates} />
          </div>
          <BookingCard data={doctor.booking} site={site} />
        </Container>
      </Section>
      <PageSections sections={doctor.sections} site={site} footer={footer} query={NO_QUERY} />
    </>
  );
}
