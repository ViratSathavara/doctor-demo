import type { Announcement } from "@site/types/content";
import { SmartLink } from "@site/components/common/smart-link";
import { Container } from "@site/components/common/ui";

export function AnnouncementBar({ data }: { data: Announcement }) {
  return (
    <div className="bg-accent-800 text-[12.5px] text-white md:text-[13.5px]">
      <Container wide className="flex min-h-[42px] items-center justify-between gap-4 py-2 leading-[1.5]">
        <span className="min-w-0 break-words">
          {data.tag ? (
            <span className="mr-2.5 inline-block rounded-full bg-white px-[9px] py-[3px] text-[10.5px] leading-none font-extrabold tracking-[.08em] text-accent-800">
              {data.tag}
            </span>
          ) : null}
          {data.text}
          {data.link ? (
            <>
              {" "}
              <SmartLink
                href={data.link.href}
                target={data.link.target}
                className="font-extrabold whitespace-nowrap underline underline-offset-3"
              >
                {data.link.label}
              </SmartLink>
            </>
          ) : null}
        </span>
        {data.hours ? <span className="shrink-0 opacity-95 max-md:hidden">{data.hours}</span> : null}
      </Container>
    </div>
  );
}
