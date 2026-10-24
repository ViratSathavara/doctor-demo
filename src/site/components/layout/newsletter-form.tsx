"use client";

import { useId, useState, type FormEvent } from "react";
import type { Cf7Form } from "@site/types/content";
import { buttonClass } from "@site/components/common/ui";
import { submitCf7 } from "@site/lib/utils/cf7";
import { cn } from "@site/lib/utils/cn";

/**
 * Newsletter sign-up (footer, blog sidebar). With `form` (the footer's Contact
 * Form 7 definition) it posts to WordPress and shows CF7's message; without
 * one it is front-end only.
 */
export function NewsletterForm({
  placeholder,
  button,
  light,
  form,
}: {
  placeholder: string;
  button: string;
  /** On a light background (stacked field + button). */
  light?: boolean;
  form?: Cf7Form;
}) {
  const id = useId();
  const email = form?.fields.find((field) => field.type === "email");
  const name = email?.name ?? "email";
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || sending) return;
    const el = event.currentTarget;
    setSending(true);
    try {
      const values = Object.fromEntries(form.fields.flatMap(field => {
        const value = new FormData(el).get(field.name);
        return field.type === "acceptance" && !value ? [] : [[field.name, field.type === "acceptance" ? "1" : String(value ?? "").trim()]];
      }));
      const res = await submitCf7(form, values);
      setResult({ ok: res.ok, message: res.invalid[name] || res.message });
      if (res.ok) el.reset();
    } catch {
      setResult({ ok: false, message: "" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", !light && "w-[min(480px,100%)]")}>
      <form
        onSubmit={onSubmit}
        noValidate={false}
        className={cn(
          "flex transition-shadow",
          light
            ? "flex-col gap-2.5"
            : "gap-2 rounded-full border border-footer-field-line bg-footer-field p-1.5 focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]",
        )}
      >
        <label className="sr-only" htmlFor={id}>
          {email?.label || email?.placeholder || "Email address"}
        </label>
        <input
          id={id}
          type="email"
          name={name}
          placeholder={email?.placeholder || placeholder}
          required={email?.required ?? true}
          autoComplete="email"
          aria-invalid={result && !result.ok ? true : undefined}
          className={cn(
            "min-w-0 grow px-4 text-[15px] outline-none",
            light
              ? "h-12 rounded-full border border-line-strong bg-white text-body transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_12%,transparent)]"
              : "border-0 bg-transparent text-white placeholder:text-footer-placeholder",
          )}
        />
        {form?.fields.filter(field => field.name !== name).map(field => (
          <label key={field.name} className="flex flex-col gap-1 px-3 text-[13px]">
            {field.label || field.placeholder}
            {field.type === "acceptance" ? <input type="checkbox" name={field.name} value="1" required={field.required} />
              : field.type === "select" ? <select name={field.name} required={field.required} className="rounded-lg bg-white p-2 text-body">{field.options?.map(option => <option key={option}>{option}</option>)}</select>
              : field.type === "textarea" ? <textarea name={field.name} required={field.required} placeholder={field.placeholder} className="rounded-lg bg-white p-2 text-body" />
              : <input type={field.type} name={field.name} required={field.required} placeholder={field.placeholder} autoComplete={field.autocomplete} className="rounded-lg bg-white p-2 text-body" />}
          </label>
        ))}
        <button
          type="submit"
          disabled={sending || !form?.submitUrl}
          className={buttonClass(light ? "primary" : "accent", "sm", light ? "w-full" : undefined)}
        >
          {form?.submitLabel || button}
        </button>
      </form>
      {result && (result.message || !result.ok) ? (
        <p role={result.ok ? "status" : "alert"} className={cn("px-4 text-[13px] font-bold", result.ok ? "text-accent-light" : light ? "text-danger-700" : "text-danger-50")}>
          {result.message || "Sorry, something went wrong. Please try again."}
        </p>
      ) : null}
    </div>
  );
}
