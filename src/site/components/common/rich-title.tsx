import { Fragment } from "react";
import type { RichText } from "@site/types/content";

/**
 * Renders CMS headings that mark their accent words with `<em>…</em>`.
 * Only <em> is honoured; any other markup is shown as plain text, so CMS
 * content can never inject HTML.
 */
export function RichTitle({ text }: { text: RichText }) {
  const parts = text.split(/<em>([\s\S]*?)<\/em>/i);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <em key={i}>{part}</em> : part ? <Fragment key={i}>{part}</Fragment> : null,
      )}
    </>
  );
}
