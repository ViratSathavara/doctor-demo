import { getGlobal, getHomePage, getPage } from "@site/lib/content";
import { whatsappNumber } from "@site/lib/utils/whatsapp";

export async function GET(request: Request) {
  try {
    const kind = new URL(request.url).searchParams.get("kind");
    if (kind === "booking") {
      const home = await getHomePage();
      if (!home.booking.form.cf7.submitUrl) throw new Error("Unavailable form");
      return Response.json({ kind, form: home.booking.form });
    }
    if (kind !== "contact") return Response.json({ message: "Unknown form." }, { status: 400 });
    const [page, global] = await Promise.all([getPage("contact-us"), getGlobal()]);
    const section = page?.sections.find((s) => s.layout === "contact_hero");
    if (!section || !section.data.form.cf7.submitUrl) throw new Error("Unavailable form");
    return Response.json({ kind, form: section.data.form, clinicName: global.site.name, whatsappNumber: whatsappNumber(global.site.whatsappHref, global.site.phone) });
  } catch {
    return Response.json({ message: "We couldn't load the form. Please try again." }, { status: 503 });
  }
}
