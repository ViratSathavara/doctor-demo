"use client";

import { useEffect, useRef, useState } from "react";
import type { BookingSection, ContactFormContent } from "@site/types/content";
import { basePath, legacyBasePath, withoutBasePath } from "@site/lib/utils/base-path";
import { AppointmentForm } from "./appointment-form";
import { ContactForm } from "./contact-form";

type Kind = "booking" | "contact";
type Data = { kind: "booking"; form: BookingSection["form"] } | { kind: "contact"; form: ContactFormContent; clinicName: string; whatsappNumber: string };

/** Shared by navigation, section CTAs and links inside CMS HTML. */
export function FormPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (![basePath, legacyBasePath].some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) return;
      const path = withoutBasePath(url.pathname).replace(/\/$/, "");
      // Menu links (header, drawer, mega menus, footer) to the Contact page still open the page; CTA links open the form.
      const contactPage = (path === "/contact-us" || path === "/contact") && !anchor.closest("nav, footer, [data-menu]");
      const formKind = ["#book", "#booking", "#appointment"].includes(url.hash) ? "booking"
        : ["#enquiry", "#contact", "#contact-form", "#callback"].includes(url.hash) || contactPage ? "contact" : null;
      if (!formKind) return;
      event.preventDefault();
      trigger.current = anchor;
      setData(null);
      setError("");
      setKind(formKind);
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, []);

  useEffect(() => {
    if (!kind) return;
    const modal = dialog.current!;
    modal.showModal();
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      modal.close();
      document.documentElement.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [kind]);

  useEffect(() => {
    if (!kind) return;
    const controller = new AbortController();
    fetch(`${basePath}/api/forms?kind=${kind}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        if (!controller.signal.aborted) setData(result);
      })
      .catch((e: Error) => { if (!controller.signal.aborted) setError(e.message || "Unable to load the form."); });
    return () => controller.abort();
  }, [kind, retry]);

  return (
    <dialog ref={dialog} aria-labelledby="popup-form-title" onCancel={() => setKind(null)} onClick={(e) => {
      if (e.target !== e.currentTarget) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) setKind(null);
    }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl border-0 bg-white p-0 text-body shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm">
      <div className="flex max-h-[90dvh] flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-6 py-4">
        <h2 id="popup-form-title" className="text-xl font-bold">{kind === "booking" ? "Book an appointment" : "Contact us"}</h2>
        <button type="button" autoFocus aria-label="Close form" onClick={() => setKind(null)} className="grid size-11 place-items-center rounded-full bg-tint-50 text-2xl text-primary focus-visible:outline-2">×</button>
      </div>
      <div className="mr-1.5 mb-4 min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-color:var(--color-line-strong)_transparent] [scrollbar-width:thin]">
      {kind && (error ? <div role="alert" className="p-8"><p>{error}</p><button type="button" className="mt-4 font-bold text-primary underline" onClick={() => { setError(""); setRetry((n) => n + 1); }}>Try again</button></div>
        : !data ? <div role="status" className="flex items-center justify-center gap-3 p-12"><span aria-hidden className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />Loading form…</div>
        : data.kind === "booking" ? <AppointmentForm form={data.form} /> : <ContactForm form={data.form} clinicName={data.clinicName} whatsappNumber={data.whatsappNumber} id="popup-enquiry" />)}
      </div>
      </div>
    </dialog>
  );
}
