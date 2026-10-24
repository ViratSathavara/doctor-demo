import { notFound, redirect } from "next/navigation";
import { getDoctorSlugs } from "@site/lib/content";
import { doctorHref } from "@site/lib/wordpress/doctors";
import { withBasePath } from "@site/lib/utils/base-path";

// The CMS menu links "Doctors" to /doctor: send it to the (first) doctor profile.
export default async function DoctorRedirect() {
  const [slug] = await getDoctorSlugs();
  if (!slug) notFound();
  redirect(withBasePath(doctorHref(slug)));
}
