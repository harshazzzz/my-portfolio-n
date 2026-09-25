import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";

// Server-side access check; pages and actions also authorize before private reads.
export default async function AuthGuard({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
