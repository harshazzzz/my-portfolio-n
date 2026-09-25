import { requireAdmin } from "@/lib/auth/session";
import BlogManager from "@/components/admin/BlogManager";
export default async function Page() {
  await requireAdmin();
  return <BlogManager />;
}
