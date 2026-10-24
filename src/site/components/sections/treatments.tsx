import type { TreatmentsSection } from "@site/types/content";
import { SectionHead } from "@site/components/common/section-head";
import { Container, Section } from "@site/components/common/ui";
import { TreatmentTabs } from "./treatment-tabs";

export function Treatments({ data }: { data: TreatmentsSection }) {
  return (
    <Section id="treatments">
      <Container className="flex flex-col">
        <SectionHead heading={data} center leadClassName="max-w-[620px]" />
        <TreatmentTabs tabs={data.tabs} />
      </Container>
    </Section>
  );
}
