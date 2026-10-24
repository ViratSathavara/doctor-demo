import { getHomePage } from "@site/lib/content";
import { wpUrl } from "@site/lib/wordpress/client";
import { z } from "zod";
import { appointmentSchema } from "@site/lib/validation/appointment";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const result = appointmentSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { ok: false, errors: z.flattenError(result.error).fieldErrors },
      { status: 422 },
    );
  }

  try {
    const { cf7 } = (await getHomePage()).booking.form;
    if (!cf7.submitUrl) return Response.json({ ok: false, error: "Appointment form unavailable." }, { status: 503 });
    const values: Record<string, string> = {
      "your-name": result.data.name, "your-phone": result.data.phone,
      "your-email": result.data.email ?? "", "preferred-date": result.data.date ?? "",
      treatment: result.data.treatment ?? "", "your-message": result.data.message ?? "",
      ...(result.data.consent ? { consent: "1" } : {}),
    };
    const form = new FormData();
    for (const [key, value] of Object.entries(cf7.hidden)) form.set(key, value);
    for (const field of cf7.fields) if (values[field.name] !== undefined) form.set(field.name, values[field.name]);
    const id = cf7.hidden._wpcf7;
    if (!/^\d+$/.test(id ?? "")) return Response.json({ ok: false, error: "Invalid form definition." }, { status: 503 });
    const upstream = await fetch(wpUrl("/contact-form-7/v1/contact-forms/" + id + "/feedback"), {
      method: "POST", body: form, cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const response = await upstream.json();
    return Response.json({ ...response, ok: upstream.ok && response.status === "mail_sent" }, { status: upstream.status });
  } catch {
    return Response.json({ ok: false, error: "Unable to send your request. Please try again or call us." }, { status: 502 });
  }
}
