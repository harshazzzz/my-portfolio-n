import { requireAdmin } from "@/lib/auth/session";
import MessageTable from "@/components/admin/messages/MessageTable";
export default async function MessagesPage() {
  await requireAdmin();
  return <MessageTable />;
}
