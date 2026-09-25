import { requireAdmin } from "@/lib/auth/session";
import BlogEditor from "@/components/admin/BlogEditor";
export default async function Page() {
  await requireAdmin();
  return <BlogEditor />;
}
