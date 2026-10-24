import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { publicSiteUrl } from "@site/lib/constants/site";
import { getGlobal } from "@site/lib/content";
import { BackToHomeBar } from "@shared/back-to-home-bar";
import { hospital } from "@config/hospital";
import "./globals.css";

// Identical to ivf-website's font setup, self-hosted by next/font. Fraunces is
// loaded without the optical-size axis on purpose: that gives the sturdier
// heading cut used on ivf-website (with `opsz`, big headings turn high-contrast).
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

/** Whole-site switch from WordPress: a safety net for pages that are not WordPress items (404, error…). Page-level robots override it. */
export async function generateMetadata(): Promise<Metadata> {
  const { seo, site } = await getGlobal();
  const hidden = seo.siteNoindex;
  const base = publicSiteUrl(seo);
  return {
    metadataBase: base ? new URL(base) : null,
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    robots: { index: !hidden, follow: !hidden },
    openGraph: { siteName: site.name },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const global = await getGlobal();
  return (
    <html lang="en" className={`${figtree.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <head>
        {/* White-label colours: every other shade derives from these two in globals.css. */}
        <style>{`:root{--color-primary:${hospital.theme.primary};--color-accent:${hospital.theme.accent}}`}</style>
      </head>
      <body suppressHydrationWarning>
        <BackToHomeBar href={global.header.backLink.href} label={global.header.backLink.label} />
        {children}
      </body>
    </html>
  );
}
