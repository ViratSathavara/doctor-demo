import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts, getArticleSettings, getDoctor, getGlobal, getPost } from "@site/lib/content";
import { pageMetadata } from "@site/lib/seo";
export const revalidate = 300;
import { relatedPosts } from "@site/lib/utils/blog";
import { Icon } from "@site/components/common/icon";
import { JsonLd } from "@site/components/common/json-ld";
import { Reveal } from "@site/components/common/reveal";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { Container, linkArrowClass, Section } from "@site/components/common/ui";
import { ArticleFeedback } from "@site/components/blog/article-feedback";
import {
  ArticleAside,
  ArticleBody,
  ArticleFaqs,
  ArticleHero,
  AuthorBio,
  Disclaimer,
  InlineCta,
} from "@site/components/blog/article-sections";
import { ArticleToc } from "@site/components/blog/article-toc";
import { PostCard } from "@site/components/blog/post-card";
import { ReadingProgress } from "@site/components/blog/reading-progress";
import { CtaBand } from "@site/components/page/cta-band";

// Demo site: nothing is prerendered at build time; each page renders on its first visit, then is cached.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const [post, global] = await Promise.all([getPost((await params).slug), getGlobal()]);
  if (!post) return {};
  return pageMetadata(post.seo, global, post.title, {
    type: "article", publishedTime: post.date, modifiedTime: post.modified,
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const [post, global, posts] = await Promise.all([getPost(slug), getGlobal(), getBlogPosts()]);
  if (!post) notFound();

  const doctor = post.doctor?.slug ? await getDoctor(post.doctor.slug) : null;
  const blog = await getArticleSettings(doctor);
  const { article, author } = blog;
  // FAQs sit just before "References" (see ArticleBody), so list them there too.
  const faqItem = post.faqs.length && article.faqTitle ? [{ id: "faqs", label: article.faqTitle }] : [];
  const refAt = post.toc.findIndex((item) => item.id === "references");
  const toc =
    refAt >= 0 ? [...post.toc.slice(0, refAt), ...faqItem, ...post.toc.slice(refAt)] : [...post.toc, ...faqItem];
  const related = relatedPosts(posts, post);

  return (
    <>
      <JsonLd data={post.schema} />
      <ReadingProgress targetId="article" />
      <ArticleHero post={post} blog={blog} />

      {/* Top padding leaves room for the cover image that overlaps from the header. */}
      <section className={post.image ? "bg-white pt-24 pb-20 md:pt-[190px] md:pb-[90px]" : "bg-white py-16 md:py-20"}>
        <Container wide className="grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_260px] xl:gap-12">
          {/* Side columns stick below the header and scroll on their own when taller than the screen. */}
          <div className="scrollbar-soft lg:sticky lg:top-[110px] lg:max-h-[calc(100dvh-130px)] lg:overflow-y-auto lg:pr-1">
            <ArticleToc title={article.tocTitle} items={toc} />
          </div>
          <article id="article" className="flex min-w-0 flex-col gap-8">
            <ArticleBody
              html={post.content}
              cta={post.inlineCta ? <InlineCta data={post.inlineCta} /> : null}
              beforeReferences={<ArticleFaqs title={article.faqTitle} items={post.faqs} />}
            />
            <Disclaimer text={article.disclaimer} />
            <ArticleFeedback question={article.feedbackQuestion} thanks={article.feedbackThanks} />
            <AuthorBio author={author} social={global.footer.social} />
          </article>
          <div className="scrollbar-soft lg:col-start-2 xl:sticky xl:top-[110px] xl:col-start-auto xl:max-h-[calc(100dvh-130px)] xl:overflow-y-auto xl:overscroll-contain xl:pr-1">

            <ArticleAside post={post} blog={blog} site={global.site} />
          </div>
        </Container>
      </section>

      {related.length ? (
        <Section tone="tint">
          <Container>
            <SectionHead heading={{ eyebrow: article.related.eyebrow, title: article.related.title }}>
              {article.related.link.label ? (
                <SmartLink href={article.related.link.href} className={linkArrowClass}>
                  {article.related.link.label}
                  <Icon name="arrow-right" size={16} strokeWidth={2.2} />
                </SmartLink>
              ) : null}
            </SectionHead>
            <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={(i % 3) * 0.1}>
                  <PostCard post={item} showExcerpt />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
      <CtaBand data={article.cta} site={global.site} tone={related.length ? "accent" : "primary"} />
    </>
  );
}
