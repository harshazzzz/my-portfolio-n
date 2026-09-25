import { requireAdmin } from "@/lib/auth/session";
import ProjectForm from "@/components/admin/projects/ProjectForm";
export default async function Page() {
  await requireAdmin();
  return <ProjectForm />;
}
