"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "@site/lib/navigation-hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeaderContent, MegaMenuKey, SiteSettings } from "@site/types/content";
import { GlassPill, glassItemClass, glassTrackClass, useGlassHighlight } from "@site/components/common/glass-tabs";
import { Icon } from "@site/components/common/icon";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container } from "@site/components/common/ui";
import { cn } from "@site/lib/utils/cn";
import { Brand } from "./brand";
import { DoctorsMega, TreatmentsMega } from "./mega-menus";

const navItem =
  "group relative flex h-10 cursor-pointer items-center gap-1 rounded-full border-0 bg-transparent px-2.5 text-sm font-bold whitespace-nowrap 2xl:px-3 2xl:text-[14.5px]";

/** CMS menu URLs that redirect to a differently named route (see redirects in next.config.mjs). */
const ROUTE_ALIASES: Record<string, string> = { "/doctor": "/doctors", "/blog": "/blogs", "/contact": "/contact-us" };

/** Pages that also count as active for another menu URL (the gallery is shown for "Success Stories"). */
const ACTIVE_ALSO: Record<string, string> = { "/blogs": "/blog" };

/** Routes a mega menu tab stands for, so it is active there even when its CMS link is "#". */
const MEGA_ROUTES: Record<MegaMenuKey, string[]> = { doctors: ["/doctors", "/doctor"], treatments: ["/treatments"] };

const underRoute = (pathname: string, route: string) => pathname === route || pathname.startsWith(`${route}/`);

/** "/" and "/#top" mark Home; other hash links on the home page are sections, not pages. */
function isActive({ href, mega }: { href: string; mega?: MegaMenuKey }, pathname: string) {
  if (mega && MEGA_ROUTES[mega].some((route) => underRoute(pathname, route))) return true;
  const [path, hash] = href.split("#");
  if (!path && hash !== undefined && hash !== "top") return false;
  const route = ROUTE_ALIASES[path] ?? (path || "/");
  if (route === "/") return pathname === "/" && (!hash || hash === "top");
  return [route, ACTIVE_ALSO[route]].some((r) => r && underRoute(pathname, r));
}

/**
 * Sticky header with desktop mega menus and the mobile drawer.
 * Menus open on hover or click and close on Escape, outside click, leaving
 * the header, or hovering a plain link. A single glass pill marks the current
 * page, slides to whichever item is hovered, and glides back on leave; the
 * bar shrinks slightly once the page scrolls.
 */
export function Header({ header, site }: { header: HeaderContent; site: SiteSettings }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setDrawerOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = drawerRef.current;
    const trigger = menuButtonRef.current;
    panel?.querySelector<HTMLButtonElement>("button")?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || document.querySelector("dialog[open]")) return;
      const controls = Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button, summary, [tabindex='0']") ?? [])
        .filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", trapFocus);
      if (panel?.contains(document.activeElement)) trigger?.focus();
    };
  }, [drawerOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1261px)");
    const onResize = () => {
      setDrawerOpen(false);
      setOpenMenu(null);
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  const closeDrawer = () => setDrawerOpen(false);
  const activeLabel = header.menu.find((item) => isActive(item, pathname))?.label;
  const openLabel = header.menu.find((item) => item.mega && item.mega === openMenu)?.label;
  // Glass pill: follows the pointer, stays on an open mega menu, else rests on the current page.
  const glass = useGlassHighlight<string>(openLabel ?? activeLabel);
  // A page change started outside the header (footer, page links) moves the pill
  // straight to the new tab; it glides again once the header is hovered or focused.
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [instant, setInstant] = useState(false);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setInstant(glass.hovered === null && openMenu === null);
    setDrawerOpen(false);
    setOpenMenu(null);
  } else if (instant && (glass.hovered !== null || openMenu !== null)) {
    setInstant(false);
  }
  const pill = (label: string) => (glass.highlighted === label ? <GlassPill layoutId="nav-pill" instant={instant} /> : null);
  const itemColor = (label: string) => glassItemClass(glass.highlighted === label);

  return (
    <>
      <header
        id="top"
        className={cn(
          "sticky top-0 z-40 border-b bg-white/88 backdrop-blur-[14px] backdrop-saturate-140 transition-[box-shadow,border-color] duration-300",
          scrolled ? "border-line shadow-header" : "border-transparent",
        )}
      >
        <Container
          wide
          ref={rootRef}
          onMouseLeave={closeMenu}
          className={cn(
            "relative flex items-center justify-between gap-3.5 transition-[height] duration-500 ease-out-expo 2xl:gap-5",
            scrolled ? "h-16 md:h-[72px]" : "h-[72px] md:h-[84px]",
          )}
        >
          <Brand brand={header.brand} onMouseEnter={closeMenu} />

          <nav
            className={cn("flex items-center gap-0.5 p-[5px] max-xl:hidden", glassTrackClass())}
            aria-label="Main"
            {...glass.track}
          >
            {header.menu.map((item) => {
              const active = item.label === activeLabel;
              return item.mega ? (
                // Label links to the menu item's page; hovering (or the chevron button) opens the mega menu.
                <div
                  key={item.label}
                  className={cn(
                    navItem,
                    "cursor-default gap-0 pr-1.5 2xl:pr-2",
                    // Pill travelled down into this tab's menu: keep the tab tinted.
                    glass.highlighted !== item.label && openMenu === item.mega
                      ? "relative text-primary transition-colors duration-300"
                      : itemColor(item.label),
                  )}
                  onFocus={glass.item(item.label).onFocus}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    glass.item(item.label).onMouseEnter();
                    setOpenMenu(item.mega!);
                  }}
                >
                  {pill(item.label)}
                  <SmartLink
                    href={item.href}
                    target={item.target}
                    aria-current={active ? "page" : undefined}
                    onClick={(event) => {
                      if (!item.href || item.href === "#") {
                        event.preventDefault();
                        setOpenMenu((current) => current === item.mega ? null : item.mega!);
                      } else closeMenu();
                    }}
                    className="relative"
                  >
                    {item.label}
                  </SmartLink>
                  <button
                    type="button"
                    className="group relative grid size-6 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-current"
                    aria-expanded={openMenu === item.mega}
                    aria-label={`${item.label} menu`}
                    onClick={() => setOpenMenu((current) => (current === item.mega ? null : item.mega!))}
                  >
                    <Icon
                      name="chevron-down"
                      size={14}
                      strokeWidth={2.4}
                      className="transition-transform duration-200 group-aria-expanded:rotate-180"
                    />
                  </button>
                </div>
              ) : (
                <SmartLink
                  href={item.href}
                  key={item.label}
                  className={cn(navItem, itemColor(item.label))}
                  aria-current={active ? "page" : undefined}
                  onFocus={glass.item(item.label).onFocus}
                  onMouseEnter={() => {
                    glass.item(item.label).onMouseEnter();
                    closeMenu();
                  }}
                >
                  {pill(item.label)}
                  <span className="relative">{item.label}</span>
                </SmartLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4" onMouseEnter={closeMenu}>
            <a href={site.phoneHref} className="flex items-center gap-2.5 max-3xl:hidden">
              <span className="grid size-[42px] place-items-center rounded-full bg-accent-50 text-accent-700">
                <Icon name="phone" size={18} strokeWidth={2} />
              </span>
              <span>
                <small className="block text-xs leading-[1.2] font-bold text-muted">{header.phoneLabel}</small>
                <b className="text-[15px] text-heading">{site.phone}</b>
              </span>
            </a>
            <SmartLink
              href={header.cta.href}
              target={header.cta.target}
              className={buttonClass("primary", "sm", "max-xl:hidden")}
            >
              {header.cta.label}
              <Icon name="arrow-right" size={16} strokeWidth={2.2} />
            </SmartLink>
            <button
              ref={menuButtonRef}
              className="grid size-[46px] cursor-pointer place-items-center rounded-full border border-line bg-white transition-colors hover:border-primary hover:text-primary xl:hidden"
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-navigation"
              onClick={() => setDrawerOpen(true)}
            >
              <Icon name="menu" size={22} strokeWidth={2} />
            </button>
          </div>

          <TreatmentsMega
            data={header.mega.treatments}
            open={openMenu === "treatments"}
            glass={glass}
            onNavigate={closeMenu}
          />
          <DoctorsMega data={header.mega.doctors} open={openMenu === "doctors"} glass={glass} onNavigate={closeMenu} />
        </Container>
      </header>

      <AnimatePresence>
        {drawerOpen ? (
          <div key="drawer" className="fixed inset-0 z-60 xl:hidden">
            <motion.div
              className="absolute inset-0 bg-ink/50 backdrop-blur-[3px]"
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              ref={drawerRef}
              id="mobile-navigation"
              className="absolute inset-y-0 right-0 flex h-dvh w-[min(380px,92vw)] max-w-full flex-col gap-3 overflow-hidden rounded-l-lg bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-[22px]"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              data-menu
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <button
                className="grid size-[44px] shrink-0 cursor-pointer place-items-center self-end rounded-full border border-line bg-white text-[22px] leading-none"
                type="button"
                aria-label="Close menu"
                onClick={closeDrawer}
              >
                ×
              </button>
              <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {header.menu.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                >
                  {item.mega ? (
                    <details className="group/mobile border-b border-line-soft">
                      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-[14px] px-3.5 py-3 text-base font-bold hover:bg-tint-100 [&::-webkit-details-marker]:hidden">
                        {item.label}
                        <Icon name="chevron-down" size={18} className="shrink-0 transition-transform group-open/mobile:rotate-180" />
                      </summary>
                      <div className="space-y-4 rounded-[14px] bg-tint-50 p-3">
                        {item.href && item.href !== "#" ? <SmartLink href={item.href} onClick={closeDrawer} className="block py-2 font-bold text-primary">{item.label} overview</SmartLink> : null}
                        {item.mega === "treatments" ? header.mega.treatments.columns.map((column) => (
                          <div key={column.title}>
                            <p className="mb-1 text-xs font-extrabold tracking-wide text-muted uppercase">{column.title}</p>
                            {column.links.map((link) => <SmartLink key={link.href + link.label} href={link.href} onClick={closeDrawer} className="flex min-h-11 items-center rounded-lg px-2 py-2 text-sm font-semibold hover:bg-tint-200">{link.label}</SmartLink>)}
                          </div>
                        )) : (
                          <>
                            <SmartLink href={header.mega.doctors.doctor.secondaryCta.href} onClick={closeDrawer} className="block py-2 font-bold text-primary">{header.mega.doctors.doctor.name}</SmartLink>
                            {header.mega.doctors.checklist.links.map((link) => <SmartLink key={link.href + link.label} href={link.href} target={link.target} onClick={closeDrawer} className="block rounded-lg px-2 py-3 text-sm hover:bg-tint-200">{link.label}</SmartLink>)}
                            {header.mega.doctors.team.members.map((member) => <SmartLink key={member.href + member.name} href={member.href} onClick={closeDrawer} className="block rounded-lg px-2 py-3 text-sm hover:bg-tint-200">{member.name}</SmartLink>)}
                          </>
                        )}
                      </div>
                    </details>
                  ) : <SmartLink
                    className="block rounded-[14px] px-3.5 py-[13px] text-base font-bold transition-colors hover:bg-tint-100 hover:text-primary"
                    href={item.href}
                    onClick={closeDrawer}
                    target={item.target}
                    aria-current={isActive(item, pathname) ? "page" : undefined}
                  >
                    {item.label}
                  </SmartLink>}
                </motion.div>
              ))}
              </nav>
              <motion.div
                className="flex shrink-0 flex-col gap-3 border-t border-line pt-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + header.menu.length * 0.04 }}
              >
                <SmartLink
                  href={header.cta.href}
                  target={header.cta.target}
                  className={buttonClass("primary", "block")}
                  onClick={closeDrawer}
                >
                  {header.cta.label}
                </SmartLink>
                {site.phoneHref && site.phone ? <a href={site.phoneHref} onClick={closeDrawer} className={buttonClass("outline", "block")}>
                  <Icon name="phone" size={18} className="shrink-0" />
                  <span className="min-w-0 text-sm whitespace-normal">Call {site.phone}</span>
                </a> : null}
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
