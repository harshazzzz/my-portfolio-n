import "server-only";
import { backendFetch } from "@/lib/auth/backend";
import type { CmsBlog } from "@/services/blog.service";
import type { BlogPost } from "@/data/blogs";
function toPost(blog: CmsBlog): BlogPost {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    description: blog.excerpt,
    category: blog.category,
    tags: blog.tags,
    cover: blog.coverImage || "/blog/components.svg",
    coverAlt: blog.title,
    publishedAt: blog.publishedAt ?? blog.createdAt,
    accent: "cyan",
    isPreview: false,
    sections: [
      {
        heading: "",
        paragraphs: blog.content.split(/\n\s*\n/).filter(Boolean),
      },
    ],
  };
}
export async function getBlogPosts(): Promise<readonly BlogPost[]> {
  try {
    const response = await backendFetch("/blogs");
    if (!response.ok) return [];
    return ((await response.json()) as CmsBlog[]).map(toPost);
  } catch {
    return [];
  }
}
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const response = await backendFetch("/blogs/" + encodeURIComponent(slug));
    if (!response.ok) return undefined;
    return toPost((await response.json()) as CmsBlog);
  } catch {
    return undefined;
  }
}
