import { Fragment } from "react";
import type { FooterContent } from "@site/types/content";
import { RichText } from "@site/components/common/rich-text";
import { SmartLink } from "@site/components/common/smart-link";

type FooterBottomContent = Pick<FooterContent, "copyright" | "legalLinks" | "disclaimer" | "credit">;

/** Every bottom-bar label and destination comes from WordPress. */
export function FooterBottom({ footer }: { footer: FooterBottomContent }) {
  const { copyright, legalLinks, disclaimer, credit } = footer;
  const hasLegal = Boolean(copyright || legalLinks.length);
  const hasCredit = Boolean(credit.text || credit.link.label);
  if (!hasLegal && !disclaimer && !hasCredit) return null;

  return (
    <>
      {hasLegal || disclaimer ? (
        <div className="flex flex-col flex-wrap items-start justify-between gap-5 border-t border-footer-line py-6 text-[13.5px] text-on-dark-muted md:flex-row md:items-center">
          {hasLegal ? (
            <span>
              {copyright ? <span>{copyright}</span> : null}
              {legalLinks.map((item, i) => (
                <Fragment key={`${item.label}-${i}`}>
                  {copyright || i > 0 ? <span aria-hidden="true">{" · "}</span> : null}
                  {item.href && item.href !== "#" ? (
                    <SmartLink href={item.href} target={item.target} className="underline underline-offset-3">
                      {item.label}
                    </SmartLink>
                  ) : <span>{item.label}</span>}
                </Fragment>
              ))}
            </span>
          ) : null}
          <RichText html={disclaimer} className="rt rt-light max-w-[520px]" />
        </div>
      ) : null}
      {hasCredit ? (
        <p className="border-t border-footer-line py-3 text-center text-[13px] text-on-dark-muted">
          {credit.text ? <span>{credit.text}{credit.link.label ? " " : ""}</span> : null}
          {credit.link.label ? credit.link.href ? (
            <a
              href="https://www.olbuz.in/healthcare-marketing"
              target="_blank"
              rel={credit.rel}
              translate="no"
              className="notranslate font-bold text-white underline decoration-white/30 underline-offset-3 transition-colors hover:text-accent-light hover:decoration-accent-light"
            >
              OLBUZ.IN
            </a>
          ) : <span translate="no" className="notranslate font-bold text-white">{credit.link.label}</span> : null}
        </p>
      ) : null}
    </>
  );
}
