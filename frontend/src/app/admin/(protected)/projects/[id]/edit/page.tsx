import { requireAdmin } from "@/lib/auth/session";
import ProjectForm from "@/components/admin/projects/ProjectForm";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  return <ProjectForm id={(await params).id} />;
}
