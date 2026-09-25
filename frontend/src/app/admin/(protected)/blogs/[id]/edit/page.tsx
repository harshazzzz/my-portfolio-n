import { requireAdmin } from "@/lib/auth/session";
import BlogEditor from "@/components/admin/BlogEditor";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  return <BlogEditor id={(await params).id} />;
}
