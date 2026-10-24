import { Fragment, type ReactNode } from "react";
import type { Breadcrumb, FooterContent, PageSection, PageSectionLayout, SiteSettings } from "@site/types/content";
import { BlogList, type BlogListQuery } from "@site/components/blog/blog-list";
import { BlogHero } from "@site/components/blog/blog-sections";
import { BeforeVisit, ContactHero, ContactInfo, Directions, SocialBand } from "@site/components/contact/contact-sections";
import { GalleryHero, TrustCards } from "@site/components/gallery/gallery-sections";
import { GalleryTabs } from "@site/components/gallery/gallery-tabs";
import { About } from "@site/components/sections/about";
import { Blog } from "@site/components/sections/blog";
import { Booking } from "@site/components/sections/booking";
import { DoctorSpotlight } from "@site/components/sections/doctor-spotlight";
import { Facilities } from "@site/components/sections/facilities";
import { Faqs } from "@site/components/sections/faqs";
import { Gynecology } from "@site/components/sections/gynecology";
import { Hero } from "@site/components/sections/hero";
import { Journey } from "@site/components/sections/journey";
import { Reviews } from "@site/components/sections/reviews";
import { StatsBand } from "@site/components/sections/stats-band";
import { SuccessStories } from "@site/components/sections/success-stories";
import { TreatmentMarquee } from "@site/components/sections/treatment-marquee";
import { Treatments } from "@site/components/sections/treatments";
import { WhyChooseUs } from "@site/components/sections/why-choose-us";
import { CtaBand } from "./cta-band";
import { DoctorProfile, Infrastructure, MedicalTeam, PageHeroBanner, Recognition, Story, Values } from "./inner-sections";
import { Location } from "./location";

/** What sections may need besides their own data. */
export interface PageContext {
  site: SiteSettings;
  footer: FooterContent;
  /** Blog listing filters from the URL. */
  query: BlogListQuery;
  /** Replaces the default "Home › page" trail on the hero (e.g. Home › Treatments › IVF Treatment). */
  crumbs?: Breadcrumb[];
}

/** The component for one WordPress section. Home layouts reuse the Home components. */
function renderSection(section: PageSection, { site, footer, query, crumbs }: PageContext): ReactNode {
  switch (section.layout) {
    case "page_hero":
      return <PageHeroBanner data={section.data} crumbs={crumbs} />;
    case "gallery_hero":
      return <GalleryHero data={section.data} />;
    case "blog_hero":
      return <BlogHero data={section.data} query={query.q} />;
    case "stats":
      return <StatsBand items={section.data} />;
    case "story":
      return <Story data={section.data} />;
    case "values":
      return <Values data={section.data} />;
    case "doctor_profile":
      return <DoctorProfile data={section.data} />;
    case "medical_team":
      return <MedicalTeam data={section.data} />;
    case "home_facilities":
      return <Facilities data={section.data} />;
    case "facilities":
      return <Infrastructure data={section.data} />;
    case "recognition":
      return <Recognition data={section.data} />;
    case "reviews":
      return <Reviews data={section.data} tone="white" />;
    case "location":
      return <Location data={section.data} site={site} />;
    case "cta":
      return <CtaBand data={section.data} site={site} />;
    case "hero":
      return (
        <>
          <Hero data={section.data.hero} />
          <TreatmentMarquee items={section.data.marquee} />
        </>
      );
    case "treatments":
      return <Treatments data={section.data} />;
    case "about":
      return <About data={section.data} />;
    case "doctor":
      return section.data.name ? <DoctorSpotlight data={section.data} /> : null;
    case "journey":
      return <Journey data={section.data} />;
    case "gynecology":
      return <Gynecology data={section.data} />;
    case "why_choose":
      return <WhyChooseUs data={section.data} />;
    case "news":
      return <SuccessStories data={section.data} />;
    case "latest_blog":
      return <Blog data={section.data} posts={section.data.posts} />;
    case "faq":
      return <Faqs data={section.data} />;
    case "contact":
      return <Booking data={section.data} site={site} />;
    case "contact_hero":
      return <ContactHero data={section.data} site={site} />;
    case "gallery":
      return <GalleryTabs data={section.data} site={site} />;
    case "highlights":
      return <TrustCards items={section.data} />;
    case "blog_list":
      return <BlogList data={section.data} query={query} site={site} newsletterForm={footer.newsletter.form} />;
    case "contact_info":
      return <ContactInfo data={section.data} site={site} />;
    case "directions":
      return <Directions data={section.data} site={site} />;
    case "image_text":
      return <BeforeVisit data={section.data} site={site} />;
    case "social_links":
      return <SocialBand title={section.data.title} social={section.data.links} />;
    default: {
      // A layout added to PageSection without a component fails to compile here.
      const missing: never = section;
      void missing;
      return null;
    }
  }
}

/**
 * A WordPress page's sections, in the order editors arranged them. Editors
 * may add, remove or reorder any of the layouts; each renders its component.
 */
export function PageSections({ sections, ...context }: { sections: PageSection[] } & PageContext) {
  return sections.map((section, i) => <Fragment key={`${section.layout}-${i}`}>{renderSection(section, context)}</Fragment>);
}

/** The first section with this layout (typed), e.g. the page hero for the breadcrumb. */
export function findSection<L extends PageSectionLayout>(sections: PageSection[], layout: L) {
  return sections.find((section): section is Extract<PageSection, { layout: L }> => section.layout === layout);
}
