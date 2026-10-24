import type { Cf7Field, Cf7Form } from "@site/types/content";
import { list, text } from "./acf";
import type { Maybe, WpCf7Form } from "./types";

const FIELD_TYPES: Cf7Field["type"][] = ["text", "tel", "email", "date", "select", "textarea", "acceptance"];

/** Contact Form 7 definition → renderable form. `undefined` when the form or its endpoint is missing. */
export function mapCf7Form(form: Maybe<WpCf7Form>): Cf7Form | undefined {
  if (!form || !text(form.submit_url)) return undefined;
  return {
    fields: list(form.fields)
      .filter((field) => text(field.name))
      .map((field) => {
        const type = FIELD_TYPES.find((t) => t === field.type) ?? "text";
        return {
          name: text(field.name),
          type,
          required: field.required === true,
          placeholder: text(field.placeholder),
          autocomplete: text(field.autocomplete) || undefined,
          label: text(field.label) || undefined,
          options: type === "select" ? list(field.options).map((option) => text(option)).filter(Boolean) : undefined,
        };
      }),
    submitLabel: text(form.submit_label, "Submit"),
    submitUrl: text(form.submit_url),
    hidden: Object.fromEntries(Object.entries(form.hidden || {}).map(([key, value]) => [key, String(value)])),
  };
}
