"use client";

import Image from "next/image";
import { shouldBypassImageOptimization } from "@/lib/images";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { formatBlogDate, readingMinutes } from "@/lib/blog-format";
import type { BlogPost } from "@/data/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className={`blog-card-motion blog-accent-${post.accent}`}
      whileHover={reduce ? undefined : { y: -7 }}
      transition={{ duration: 0.25 }}
      aria-labelledby={`blog-${post.id}`}
    >
      <GlassCard className="blog-card">
        <div className="blog-cover">
          <Image
            unoptimized={shouldBypassImageOptimization(post.cover)}
            src={post.cover}
            alt={post.coverAlt}
            width={800}
            height={500}
            sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
          />
          <span className="blog-category">{post.category}</span>
          {post.isPreview && (
            <span className="blog-preview-badge">STARTER ARTICLE</span>
          )}
        </div>
        <div className="blog-card-body">
          <div className="blog-meta">
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            <span>
              <Clock3 size={11} aria-hidden="true" />
              {readingMinutes(post)} min read
            </span>
          </div>
          <h3 id={`blog-${post.id}`}>{post.title}</h3>
          <p>{post.description}</p>
          <ul className="blog-tags" aria-label="Article topics">
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <Link
            href={`/blog/${post.slug}`}
            className="blog-read-link"
            aria-label={`Read article: ${post.title}`}
          >
            Read Article <ArrowUpRight size={17} />
          </Link>
        </div>
      </GlassCard>
    </motion.article>
  );
}
