import { FormPopup } from "@site/components/forms/form-popup";
import { getGlobal } from "@site/lib/content";
import { AnnouncementBar } from "@site/components/layout/announcement-bar";
import { Header } from "@site/components/layout/header";
import { Footer } from "@site/components/layout/footer";
import { FloatingActions } from "@site/components/layout/floating-actions";
import { MotionProvider } from "@site/components/common/motion-provider";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const global = await getGlobal();

  return (
    <MotionProvider>
      <AnnouncementBar data={global.announcement} />
      <Header header={global.header} site={global.site} />
      <main id="main">{children}</main>
      <Footer footer={global.footer} site={global.site} brand={global.header.brand} />
      <FloatingActions data={global.floating} />
      <FormPopup />
    </MotionProvider>
  );
}
