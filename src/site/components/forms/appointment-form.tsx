"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import type { BookingSection, Cf7Field } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { buttonClass } from "@site/components/common/ui";
import { submitCf7 } from "@site/lib/utils/cf7";
import { cn } from "@site/lib/utils/cn";

type Status = "idle" | "sending" | "sent" | "error";

const label = "flex flex-col gap-1.5 text-[13px] font-extrabold text-label";
const control =
  "w-full border border-line-strong bg-tint-50 px-5 text-[15px] outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] aria-invalid:border-danger";
const input = cn(control, "h-[52px] rounded-full");
const fieldError = "text-[12.5px] font-bold text-danger-700";

const notice = { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

/** Short single-line inputs sit two per row; selects, textareas and the consent box span the row. */
const isWide = (field: Cf7Field) => field.type === "select" || field.type === "textarea";

/**
 * Appointment request form, built from the Contact Form 7 definition in
 * WordPress and posted straight to CF7. Validation and the success message
 * come from CF7's response.
 */
export function AppointmentForm({ form }: { form: BookingSection["form"] }) {
  const { cf7 } = form;
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const el = event.currentTarget;
    const data = new FormData(el);
    const values: Record<string, string> = {};
    for (const field of cf7.fields) {
      const value = data.get(field.name);
      if (field.type === "acceptance") {
        if (value) values[field.name] = "1";
      } else values[field.name] = String(value ?? "").trim();
    }

    setStatus("sending");
    try {
      const result = await submitCf7(cf7, values);
      setInvalid(result.invalid);
      setMessage(result.message);
      if (!result.ok) {
        setStatus("error");
        return;
      }
      el.reset();
      setStatus("sent");
    } catch {
      setMessage("");
      setStatus("error");
    }
  }

  const clear = (name: string) => () =>
    invalid[name] &&
    setInvalid((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

  function renderField(field: Cf7Field) {
    const error = invalid[field.name];
    const common = {
      name: field.name,
      required: field.required,
      "aria-invalid": error ? true : undefined,
      onInput: clear(field.name),
    };

    if (field.type === "acceptance") {
      return (
        <div key={field.name} className="flex flex-col gap-1 md:col-span-2">
          <label className="flex items-start gap-2.5 text-[13.5px] leading-normal text-muted">
            <input type="checkbox" value="1" {...common} className="mt-px size-[18px] shrink-0 accent-primary" />
            {field.label}
          </label>
          {error ? <span className={fieldError}>{error}</span> : null}
        </div>
      );
    }

    return (
      <label key={field.name} className={cn(label, isWide(field) && "md:col-span-2")}>
        {field.label || field.placeholder}
        {field.type === "select" ? (
          <span className="relative">
            <select {...common} defaultValue="" className={cn(input, "cursor-pointer appearance-none pr-11")}>
              <option value="">—</option>
              {field.options?.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size={16}
              strokeWidth={2.4}
              className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-primary"
            />
          </span>
        ) : field.type === "textarea" ? (
          <textarea {...common} rows={3} placeholder={field.placeholder} className={cn(control, "resize-none rounded-[20px] py-3.5")} />
        ) : (
          <input {...common} type={field.type} placeholder={field.placeholder} autoComplete={field.autocomplete} className={input} />
        )}
        {error ? <span className={fieldError}>{error}</span> : null}
      </label>
    );
  }

  if (!cf7.submitUrl) return null;

  return (
    <form className="relative flex flex-col gap-4 px-[22px] py-[30px] md:p-12" onSubmit={onSubmit} noValidate>
      {form.title ? <h3 className="text-[28px]">{form.title}</h3> : null}
      {form.subtitle ? <p className="-mt-1.5 text-[14.5px] text-muted">{form.subtitle}</p> : null}
      <div className="grid gap-3.5 md:grid-cols-2">{cf7.fields.map(renderField)}</div>
      <button type="submit" className={buttonClass("primary", "block")} disabled={status === "sending"}>
        {cf7.submitLabel}
        {status === "sending" ? (
          <span className="size-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
        ) : (
          <Icon name="arrow-right" size={18} strokeWidth={2.2} />
        )}
      </button>
      <div role="status">
        <AnimatePresence>
          {status === "sent" && message ? (
            <motion.p
              {...notice}
              className="rounded-[14px] bg-accent-50 px-4 py-3 text-[14.5px] font-bold text-accent-700"
            >
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {status === "error" ? (
          <motion.div
            {...notice}
            role="alert"
            className="rounded-[14px] bg-danger-50 px-4 py-3 text-[14.5px] font-bold text-danger-700"
          >
            {message || "Sorry, we couldn’t send your request. Please check your details or call us."}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
