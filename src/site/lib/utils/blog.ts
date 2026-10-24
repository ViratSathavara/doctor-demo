import type { PostSummary } from "@site/types/content";

/** Categories that have posts, with counts, in first-seen order. */
export function postCategories(posts: PostSummary[]) {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const post of posts) {
    if (!post.categorySlug) continue;
    const entry = map.get(post.categorySlug) ?? { slug: post.categorySlug, name: post.category, count: 0 };
    entry.count += 1;
    map.set(post.categorySlug, entry);
  }
  return [...map.values()];
}

/** Case-insensitive search over title, excerpt and category, plus an optional category slug. */
export function filterPosts(posts: PostSummary[], { q, category }: { q: string; category: string }) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (category && post.categorySlug !== category) return false;
    const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

/** Up to `limit` other posts, same category first, then the newest. */
export function relatedPosts(posts: PostSummary[], current: PostSummary, limit = 3) {
  const others = posts.filter((post) => post.slug !== current.slug);
  const same = others.filter((post) => post.categorySlug && post.categorySlug === current.categorySlug);
  return [...same, ...others.filter((post) => !same.includes(post))].slice(0, limit);
}

/** First string of a search param (`?q=a&q=b` → "a"). */
export function param(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}
