import type { JsonLdData } from "@site/types/content";

/** Prints JSON-LD (WordPress's Schema box: one object, a list, or null for none). */
export function JsonLd({ data }: { data: JsonLdData }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
