"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Cf7Field, ContactFormContent } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { buttonClass } from "@site/components/common/ui";
import { submitCf7 } from "@site/lib/utils/cf7";
import { cn } from "@site/lib/utils/cn";
import { whatsappChatUrl } from "@site/lib/utils/whatsapp";
import { appointmentSchema } from "@site/lib/validation/appointment";

type Status = "idle" | "sending" | "sent" | "error";
type Values = Record<string, string>;

const label = "flex flex-col gap-1.5 text-[13px] font-extrabold text-label";
const control =
  "w-full border border-line-strong bg-tint-50 px-5 text-[15px] outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_12%,transparent)] aria-invalid:border-danger";
const input = cn(control, "h-[52px] rounded-full");
const optional = "font-semibold text-muted";
const fieldError = "text-[12.5px] font-bold text-danger-700";

const notice = { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

/** Message shown before CF7 answers (client-side check of an empty required field). */
const REQUIRED = "Please fill out this field.";

/** WhatsApp message labels for the call-back form's CF7 fields (other fields use their CF7 label). */
const WHATSAPP_LABELS: Record<string, string> = {
  "your-name": "Name",
  "your-phone": "Mobile",
  topic: "Interested In",
  "call-time": "Preferred Time",
  city: "City",
  "your-message": "Message",
};

/** Field values as CF7 expects them (an accepted checkbox is "1"). */
function readValues(form: HTMLFormElement, fields: Cf7Field[]): Values {
  const data = new FormData(form);
  const values: Values = {};
  for (const field of fields) {
    const value = data.get(field.name);
    if (field.type === "acceptance") {
      if (value) values[field.name] = "1";
    } else values[field.name] = String(value ?? "").trim();
  }
  return values;
}

/** Client-side check with the site's rules (name / mobile from the shared zod schema); field name → message. */
function validate(fields: Cf7Field[], values: Values) {
  const errors: Values = {};
  for (const field of fields) {
    const value = values[field.name] ?? "";
    if (field.required && !value) errors[field.name] = REQUIRED;
    else if (value && field.type === "tel") {
      const result = appointmentSchema.shape.phone.safeParse(value);
      if (!result.success) errors[field.name] = result.error.issues[0]?.message ?? REQUIRED;
    } else if (value && field.autocomplete === "name") {
      const result = appointmentSchema.shape.name.safeParse(value);
      if (!result.success) errors[field.name] = result.error.issues[0]?.message ?? REQUIRED;
    }
  }
  return errors;
}

/** WhatsApp text from the form; empty optional fields are left out. */
function whatsappMessage(fields: Cf7Field[], values: Values, clinicName: string) {
  const details = fields
    .filter((field) => field.type !== "acceptance" && values[field.name])
    .map((field) => `${WHATSAPP_LABELS[field.name] ?? field.label ?? field.placeholder}: ${values[field.name]}`);
  return [`Hello ${clinicName},`, "", "I would like to make an inquiry.", "", ...details].join("\n");
}

function Field({ field, error, className, children }: { field: Cf7Field; error?: string; className?: string; children: ReactNode }) {
  // Selects always have a choice, so only text fields are marked optional.
  const showOptional = !field.required && field.type !== "select";
  return (
    <label className={cn(label, className)}>
      {showOptional ? (
        <span>
          {field.label || field.placeholder} <span className={optional}>(optional)</span>
        </span>
      ) : (
        field.label || field.placeholder
      )}
      {children}
      {error ? <span className={fieldError}>{error}</span> : null}
    </label>
  );
}

/**
 * Contact page call-back form, built from its Contact Form 7 definition
 * (fields, labels, options, button) and posted straight to CF7; CF7's
 * response gives the field errors and the success message. "Send on
 * WhatsApp" checks the same rules, then opens wa.me with the details typed
 * in — the visitor presses Send.
 */
export function ContactForm({
  form,
  whatsappNumber,
  clinicName,
  id = "enquiry",
}: {
  form: ContactFormContent;
  id?: string;
  /** International format, digits only ("917234090000"); "" hides the WhatsApp button. */
  whatsappNumber: string;
  /** Greeting in the WhatsApp message ("Hello <clinicName>,"). */
  clinicName: string;
}) {
  const { cf7 } = form;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState<Values>({});
  /** Time of the last WhatsApp open: ignores double taps. */
  const lastWhatsApp = useRef(0);

  /** Marks invalid fields and focuses the first one; true when the form is valid. */
  function check(values: Values) {
    const errors = validate(cf7.fields, values);
    setInvalid(errors);
    const first = cf7.fields.find((field) => errors[field.name]);
    if (!first) return true;
    const element = formRef.current?.elements.namedItem(first.name);
    if (element instanceof HTMLElement) element.focus();
    return false;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const el = event.currentTarget;
    const values = readValues(el, cf7.fields);
    if (!check(values)) return;

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

  function onWhatsApp() {
    const values = readValues(formRef.current!, cf7.fields);
    if (!check(values)) return;
    // One chat per tap: a quick second tap would open a second tab.
    const now = Date.now();
    if (now - lastWhatsApp.current < 1500) return;
    lastWhatsApp.current = now;
    // The form keeps its values, so it is still filled in after returning from WhatsApp.
    window.open(whatsappChatUrl(whatsappNumber, whatsappMessage(cf7.fields, values, clinicName)), "_blank", "noopener,noreferrer");
  }

  const clear = (name: string) => () =>
    invalid[name] &&
    setInvalid((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

  function renderControl(field: Cf7Field) {
    const common = {
      name: field.name,
      required: field.required,
      "aria-invalid": invalid[field.name] ? true : undefined,
    };
    if (field.type === "select") {
      return (
        <span className="relative">
          <select {...common} onChange={clear(field.name)} className={cn(input, "cursor-pointer appearance-none pr-11")}>
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
      );
    }
    if (field.type === "textarea") {
      return (
        <textarea
          {...common}
          rows={3}
          placeholder={field.placeholder}
          onInput={clear(field.name)}
          className={cn(control, "resize-none rounded-[20px] py-3.5")}
        />
      );
    }
    return (
      <input
        {...common}
        type={field.type}
        autoComplete={field.autocomplete}
        placeholder={field.placeholder}
        onInput={clear(field.name)}
        className={input}
      />
    );
  }

  if (!cf7.submitUrl) return null;

  // Short fields sit two per row (an odd last one spans the row); the message and consent come after.
  const short = cf7.fields.filter((field) => field.type !== "textarea" && field.type !== "acceptance");
  const long = cf7.fields.filter((field) => field.type === "textarea");
  const consent = cf7.fields.filter((field) => field.type === "acceptance");

  return (
    <form
      ref={formRef}
      id={id}
      className="relative flex flex-col gap-4 rounded-xl bg-white px-[22px] py-[30px] text-body shadow-lg md:p-10"
      onSubmit={onSubmit}
      noValidate
    >
      <div>
        <h2 className="text-[28px]">{form.title}</h2>
        {form.subtitle ? <p className="mt-1 text-[14.5px] text-muted">{form.subtitle}</p> : null}
      </div>
      <div className="grid gap-3.5 md:grid-cols-2">
        {short.map((field, i) => (
          <Field
            key={field.name}
            field={field}
            error={invalid[field.name]}
            className={i === short.length - 1 && short.length % 2 === 1 ? "md:col-span-2" : undefined}
          >
            {renderControl(field)}
          </Field>
        ))}
      </div>
      {long.map((field) => (
        <Field key={field.name} field={field} error={invalid[field.name]}>
          {renderControl(field)}
        </Field>
      ))}
      {consent.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label
            className={cn(
              "flex items-start gap-2.5 rounded-[14px] text-[13.5px] leading-normal text-muted",
              invalid[field.name] && "bg-danger-50 p-2.5 text-danger-700",
            )}
          >
            <input
              type="checkbox"
              name={field.name}
              value="1"
              required={field.required}
              aria-invalid={invalid[field.name] ? true : undefined}
              onChange={clear(field.name)}
              className="mt-px size-[18px] shrink-0 accent-primary"
            />
            {field.label}
          </label>
        </div>
      ))}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <button type="submit" className={buttonClass("primary", "block")} disabled={status === "sending"}>
          {cf7.submitLabel}
          {status === "sending" ? (
            <span className="size-[18px] animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
          ) : (
            <Icon name="arrow-right" size={18} strokeWidth={2.2} />
          )}
        </button>
        {form.whatsappButton && whatsappNumber ? (
          <button type="button" onClick={onWhatsApp} className={buttonClass("accent", "block")}>
            <Icon name="whatsapp" size={18} strokeWidth={2} />
            {form.whatsappButton}
          </button>
        ) : null}
      </div>
      <div role="status">
        <AnimatePresence>
          {status === "sent" && message ? (
            <motion.p {...notice} className="rounded-[14px] bg-accent-50 px-4 py-3 text-[14.5px] font-bold text-accent-700">
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
            {message || "Sorry, we couldn’t send your inquiry. Please check your details or call us."}
          </motion.div>
        ) : null}
      </AnimatePresence>
      {form.privacy ? (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Icon name="lock" size={15} className="shrink-0 text-accent-700" />
          {form.privacy}
        </p>
      ) : null}
    </form>
  );
}
