import "server-only";
import { backendFetch } from "@/lib/auth/backend";
import type { CmsProject } from "@/services/project.service";
import type { Project } from "@/data/projects";
export function portfolioProject(p: CmsProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    role: p.role,
    category: p.category,
    technologies: p.technologies,
    description: p.shortDescription,
    introduction: p.description,
    features: p.features,
    benefits: p.benefits,
    accent: p.accent === "purple" || p.accent === "orange" ? p.accent : "cyan",
    preview: ["pos", "mobile", "library", "iot"].includes(p.preview)
      ? (p.preview as Project["preview"])
      : "generic",
    image: p.coverImage || null,
    images: p.images,
    githubUrl: p.githubUrl || null,
    demoUrl: p.liveUrl || null,
    featured: p.featured,
  };
}
export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const response = await backendFetch("/projects");
    if (!response.ok) return [];
    return ((await response.json()) as CmsProject[]).map(portfolioProject);
  } catch {
    return [];
  }
}
export async function getPublishedProject(
  slug: string,
): Promise<Project | undefined> {
  try {
    const response = await backendFetch(
      "/projects/" + encodeURIComponent(slug),
    );
    if (!response.ok) return undefined;
    return portfolioProject((await response.json()) as CmsProject);
  } catch {
    return undefined;
  }
}
