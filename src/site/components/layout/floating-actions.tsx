import type { FloatingActions as FloatingActionsData } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { cn } from "@site/lib/utils/cn";

const fab =
  "group relative grid size-[58px] place-items-center rounded-full text-white shadow-[0_12px_30px_rgb(0_0_0/0.25)] transition-transform duration-200 hover:scale-108";
const tip =
  "pointer-events-none absolute right-[70px] translate-x-1.5 rounded-full bg-primary-900 px-3 py-[7px] text-[13px] font-bold whitespace-nowrap text-white opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100";

/** Mobile contact dock; desktop keeps the floating corner buttons. */
export function FloatingActions({ data }: { data: FloatingActionsData }) {
  return (
    <>
    <div className="h-[calc(76px+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
    <div className="fixed inset-x-0 bottom-0 z-45 grid grid-cols-2 gap-3 border-t border-line bg-white px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-header md:hidden" aria-label="Contact the clinic">
      <a href={data.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-whatsapp px-3 text-sm leading-tight font-bold text-white" aria-label={data.whatsapp.label}>
        <Icon name="whatsapp" size={22} className="shrink-0" />
        <span className="break-words">WhatsApp</span>
      </a>
      <a href={data.call.href} className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-primary px-3 text-sm leading-tight font-bold text-white" aria-label={data.call.label}>
        <Icon name="phone" size={20} className="shrink-0" />
        <span>Call us</span>
      </a>
    </div>
    <div className="fixed right-[22px] bottom-[22px] z-45 hidden animate-rise flex-col gap-3 [animation-delay:1.2s] md:flex">
      <a href={data.whatsapp.href} target="_blank" rel="noopener noreferrer" className={cn(fab, "bg-whatsapp")} aria-label={data.whatsapp.label}>
        <span className="absolute -inset-1 animate-pulse-ring rounded-full border-2 border-whatsapp" aria-hidden />
        <span className={tip}>{data.whatsapp.label}</span>
        <Icon name="whatsapp" size={26} />
      </a>
      <a href={data.call.href} className={cn(fab, "bg-primary")} aria-label={data.call.label}>
        <span className={tip}>{data.call.label}</span>
        <Icon name="phone" size={22} strokeWidth={2} />
      </a>
    </div>
    </>
  );
}
