import type { BlogSection, PostSummary } from "@site/types/content";
import { Icon } from "@site/components/common/icon";
import { Reveal } from "@site/components/common/reveal";
import { SectionHead } from "@site/components/common/section-head";
import { SmartLink } from "@site/components/common/smart-link";
import { buttonClass, Container, Section } from "@site/components/common/ui";
import { PostCard } from "@site/components/blog/post-card";

export function Blog({ data, posts }: { data: BlogSection; posts: PostSummary[] }) {
  return (
    <Section tone="tint" id="blog">
      <Container>
        <SectionHead heading={data}>
          <SmartLink href={data.cta.href} target={data.cta.target} className={buttonClass("outline", "sm")}>
            {data.cta.label}
            <Icon name="arrow-right" size={16} strokeWidth={2.2} />
          </SmartLink>
        </SectionHead>
        <div className="grid gap-[22px] md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.1}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
