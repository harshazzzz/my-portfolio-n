import { requireAdmin } from "@/lib/auth/session";
import ProjectTable from "@/components/admin/projects/ProjectTable";
export default async function Page() {
  await requireAdmin();
  return <ProjectTable />;
}
