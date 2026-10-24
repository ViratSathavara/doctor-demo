import { createElement } from "react";
import parse, { Element, domToReact, type DOMNode, type HTMLReactParserOptions } from "html-react-parser";
import { SmartLink } from "./smart-link";

/**
 * Descriptive CMS text (descriptions, FAQ answers, notes…): bold, lists and
 * links from the WordPress rich-text editor, or old plain text.
 *
 * The HTML is already sanitized and its links rewritten on the server (`rich()`
 * in lib/wordpress/rich.ts). Because this component also runs in client
 * components, it enforces the allow-list again while building elements: unknown
 * tags are unwrapped (script / style / iframe dropped), and only links keep
 * attributes. Plain text is split into paragraphs on blank lines.
 *
 * It renders a <div>, so never put it inside a <p>. Titles, badges and button
 * labels are not rich text: print them as text (titles via <RichTitle>).
 */

const BLOCKS = new Set(["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "blockquote", "h3", "h4"]);
const DROPPED = new Set(["script", "style", "iframe", "object", "embed", "noscript", "template"]);

/** Site paths, anchors, http(s), mailto and tel only: no javascript: / data: links. */
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?![\/\\])|#|\?)/i;

const isHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const options: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) return;
    const name = node.name.toLowerCase();
    if (DROPPED.has(name)) return <></>;
    const children = node.children.length ? domToReact(node.children as DOMNode[], options) : undefined;
    if (name === "a") {
      const { href, title } = node.attribs;
      // Internal paths go through next/link (SmartLink); other sites open in a new tab with rel="noopener noreferrer".
      return href && SAFE_HREF.test(href.trim()) ? (
        <SmartLink href={href.trim()} title={title} className="rt-link">
          {children}
        </SmartLink>
      ) : (
        <>{children}</>
      );
    }
    if (name === "br") return <br />;
    return BLOCKS.has(name) ? createElement(name, null, children) : <>{children}</>;
  },
};

export function RichText({ html, className }: { html?: string | null; className?: string }) {
  const src = (html ?? "").trim();
  if (!src) return null;

  if (!isHtml(src)) {
    return (
      <div className={className}>
        {src.split(/\n{2,}/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return <div className={className}>{parse(src, options)}</div>;
}
