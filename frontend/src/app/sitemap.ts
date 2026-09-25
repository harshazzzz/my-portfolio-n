import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getBlogPosts } from "@/lib/blogs";
import { getPublishedProjects } from "@/lib/projects";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects] = await Promise.all([
    getBlogPosts(),
    getPublishedProjects(),
  ]);
  return [
    ...["", "/projects", "/blog", "/contact"].map((path) => ({
      url: site.url + path,
      priority: path ? 0.7 : 1,
    })),
    ...blogs
      .filter((post) => !post.isPreview)
      .map((post) => ({
        url: site.url + "/blog/" + encodeURIComponent(post.slug),
      })),
    ...projects.flatMap((project) => project.slug ? [{
      url: site.url + "/projects/" + encodeURIComponent(project.slug),
    }] : []),
  ];
}
