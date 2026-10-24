import "server-only";
import settingsJson from "@site/lib/constants/article-settings.json";
import type { ArticleSettings, DoctorProfile } from "@site/types/content";
import { link, plain, text } from "./acf";
import { ctaBand } from "./blocks";
import { doctorHref } from "./doctors";
import type { LegacyWpArticleSettings } from "./types";

/** Interface labels are local. Doctor details and booking come from WordPress; missing promotional content stays empty. */
export function mapArticleSettings(data: LegacyWpArticleSettings, doctor?: DoctorProfile | null): ArticleSettings {
  const article = data.article || {};
  const related = article.related || {};
  const author = data.author || {};
  const name = doctor?.name || "";

  return {
    article: {
      writtenBy: text(article.written_by),
      reviewedLabel: text(article.reviewed_label),
      updatedLabel: text(article.updated_label),
      tocTitle: text(article.toc_title),
      faqTitle: text(article.faq_title),
      disclaimer: text(article.disclaimer),
      feedbackQuestion: text(article.feedback_question),
      feedbackThanks: text(article.feedback_thanks),
      relatedTreatmentsTitle: text(article.related_treatments_title),
      related: { eyebrow: text(related.eyebrow), title: text(related.title), link: link(related.link) },
      cta: ctaBand(article.cta),
    },
    author: {
      eyebrow: text(author.eyebrow),
      name,
      role: doctor?.role || "",
      qualifications: doctor?.qualifications || "",
      image: doctor?.image ?? { src: "", alt: "" },
      // Shown inside a <p>: the rich intro as plain text.
      bio: plain(doctor?.intro),
      stats: [],
      chips: doctor?.chips ?? [],
      profile: doctor ? { ...link(author.profile), href: doctorHref(doctor.slug) } : link(author.profile),
      book: doctor?.primaryCta ?? link(author.book),
    },
    book: doctor?.primaryCta ?? link(data.book),
  };
}

/** The author box is shown only for the post's WordPress doctor. */
export async function fetchArticleSettings(doctor?: DoctorProfile | null): Promise<ArticleSettings> {
  return mapArticleSettings(settingsJson as LegacyWpArticleSettings, doctor);
}
