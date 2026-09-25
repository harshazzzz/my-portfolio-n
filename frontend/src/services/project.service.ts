import { api } from "@/lib/api";
export type ProjectInput = {
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  images: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  role: string;
  features: string[];
  benefits: string[];
};
export type CmsProject = ProjectInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  accent: string;
  preview: string;
  sortOrder: number;
};
export const getAdminProjects = () => api<CmsProject[]>("/admin/projects");
export const createProject = (data: ProjectInput) =>
  api<CmsProject>("/admin/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateProject = (id: string, data: Partial<ProjectInput>) =>
  api<CmsProject>("/admin/projects/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteProject = (id: string) =>
  api<{ success: boolean }>("/admin/projects/" + encodeURIComponent(id), {
    method: "DELETE",
  });
