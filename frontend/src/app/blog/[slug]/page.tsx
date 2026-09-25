import type { Metadata } from "next";
import Image from "next/image";
import { shouldBypassImageOptimization } from "@/lib/images";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { getBlogPost, getBlogPosts } from "@/lib/blogs";
import { formatBlogDate, readingMinutes } from "@/lib/blog-format";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} | Harsha Portfolio`,
    description: post.description,
    alternates: { canonical: "/blog/" + encodeURIComponent(post.slug) },
    robots: post.isPreview ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: "/blog/" + encodeURIComponent(post.slug),
      publishedTime: post.publishedAt,
    },
  };
}
export default async function BlogArticle({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();
  const related = (await getBlogPosts())
    .filter((article) => article.id !== post.id)
    .slice(0, 2);
  return (
    <main className="blog-article">
      <nav className="article-navigation" aria-label="Article navigation">
        <Link href="/#blog">
          <ArrowLeft size={16} /> Back to articles
        </Link>
        <Link href="/" className="logo" aria-label="Harsha Portfolio home">
          HK<span>.</span>
        </Link>
      </nav>
      <header className="article-header">
        <span className="eyebrow">{post.category}</span>
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <div className="blog-meta">
          <time dateTime={post.publishedAt}>
            {formatBlogDate(post.publishedAt)}
          </time>
          <span>
            <Clock3 size={12} />
            {readingMinutes(post)} min read
          </span>
        </div>
        {post.isPreview && (
          <p className="article-preview-note">
            Starter article preview. This editable sample demonstrates the blog
            layout.
          </p>
        )}
      </header>
      <Image
        unoptimized={shouldBypassImageOptimization(post.cover)}
        src={post.cover}
        alt={post.coverAlt}
        width={800}
        height={500}
        sizes="(max-width: 900px) 100vw, 850px"
        className="article-cover"
      />
      <article className="article-prose" aria-label={post.title}>
        {post.sections.map((section) => (
          <section key={section.heading}>
            {section.heading && <h2>{section.heading}</h2>}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} style={{ whiteSpace: "pre-wrap" }}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <ul className="blog-tags" aria-label="Article topics">
          {post.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </article>
      <aside className="article-related" aria-label="More articles">
        <h2>Keep exploring</h2>
        {related.map((article) => (
          <Link key={article.id} href={`/blog/${article.slug}`}>
            <span>{article.title}</span>
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </aside>
    </main>
  );
}
