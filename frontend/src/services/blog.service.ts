import { api } from "@/lib/api";
export type BlogStatus = "DRAFT" | "PUBLISHED";
export type BlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: BlogStatus;
};
export type CmsBlog = BlogInput & {
  id: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
export const getAdminBlogs = () => api<CmsBlog[]>("/admin/blogs");
export const createBlog = (data: BlogInput) =>
  api<CmsBlog>("/admin/blogs", { method: "POST", body: JSON.stringify(data) });
export const updateBlog = (id: string, data: Partial<BlogInput>) =>
  api<CmsBlog>("/admin/blogs/" + encodeURIComponent(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteBlog = (id: string) =>
  api<{ success: boolean }>("/admin/blogs/" + encodeURIComponent(id), {
    method: "DELETE",
  });
