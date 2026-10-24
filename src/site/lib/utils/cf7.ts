import { withBasePath } from "./base-path";
import type { Cf7Form } from "@site/types/content";

export interface Cf7Result {
  ok: boolean;
  /** CF7's message for the visitor (success or error). */
  message: string;
  /** Field name → validation message. */
  invalid: Record<string, string>;
}

interface Cf7Response {
  status?: string;
  message?: string;
  invalid_fields?: { field?: string; message?: string }[];
}

/**
 * Posts a form to its Contact Form 7 REST endpoint (multipart, from the
 * browser) with the form's hidden fields. Status "mail_sent" means success.
 */
export async function submitCf7(form: Cf7Form, values: Record<string, string>): Promise<Cf7Result> {
  const body = new FormData();
  for (const [key, value] of Object.entries(form.hidden)) body.set(key, value);
  for (const [key, value] of Object.entries(values)) body.append(key, value);

  const endpoint = window.location.origin === "https://ivf.olbuzdev.com"
    ? form.submitUrl : withBasePath("/api/cf7");
  const res = await fetch(endpoint, { method: "POST", body, signal: AbortSignal.timeout(20000) });
  const data = (await res.json().catch(() => null)) as Cf7Response | null;
  const invalid = Object.fromEntries(
    (data?.invalid_fields ?? []).filter((row) => row.field).map((row) => [row.field!, row.message ?? ""]),
  );
  return { ok: res.ok && data?.status === "mail_sent", message: data?.message ?? "", invalid };
}
