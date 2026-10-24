import { wpUrl } from "@site/lib/wordpress/client";

/** Same-origin transport for local development and preview hosts outside CMS CORS. */
export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const id = String(body.get("_wpcf7") ?? "");
    if (!/^\d+$/.test(id) || !body.get("_wpcf7_unit_tag")) {
      return Response.json({ message: "Invalid form definition." }, { status: 400 });
    }
    const url = wpUrl("/contact-form-7/v1/contact-forms/" + id + "/feedback");
    const upstream = await fetch(url, {
      method: "POST", body, cache: "no-store", redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    return Response.json(await upstream.json(), { status: upstream.status });
  } catch {
    return Response.json({ message: "Unable to send your request. Please try again or call us." }, { status: 502 });
  }
}
