import { FooterBottom } from "./footer-bottom";
import type { Brand as BrandContent, FooterContent, SiteSettings } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SmartLink } from "@site/components/common/smart-link";
import { Container } from "@site/components/common/ui";
import { Brand } from "./brand";
import { FooterLinks } from "./footer-links";
import { NewsletterForm } from "./newsletter-form";

export function Footer({ footer, site, brand }: { footer: FooterContent; site: SiteSettings; brand: BrandContent }) {
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-on-dark-3">
      <div className="glow-footer pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-[30px] border-b border-footer-line py-12">
          <span>
            <b className="block font-display font-normal text-[28px] text-white">{footer.newsletter.title}</b>
            <span className="text-[15px] text-on-dark-2">{footer.newsletter.text}</span>
          </span>
          <NewsletterForm
            placeholder={footer.newsletter.placeholder}
            button={footer.newsletter.button}
            form={footer.newsletter.form}
          />
        </Reveal>

        <FooterLinks columns={footer.columns}>
          <Reveal className="flex flex-col gap-5">
            <Brand brand={brand} label={`${site.name} – Home`} onDark />
            <p className="text-[14.5px] leading-[1.7] text-on-dark-2">{footer.tagline}</p>
            <div className="flex gap-2.5">
              {footer.social.map((item) => (
                <SmartLink
                  href={item.href}
                  key={item.platform}
                  aria-label={item.label}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="grid size-11 place-items-center rounded-full border border-footer-line bg-footer-field text-white transition-[background-color,translate] duration-200 hover:-translate-y-[3px] hover:bg-primary"
                >
                  <Icon name={item.platform} size={18} />
                </SmartLink>
              ))}
            </div>
          </Reveal>
        </FooterLinks>

        <FooterBottom footer={footer} />
      </Container>
    </footer>
  );
}
