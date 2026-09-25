import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, backendFetch } from "./backend";
import type { AdminUser } from "./types";
export const getAdminSession = cache(
  async (): Promise<{ user: AdminUser } | null> => {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) return null;
    try {
      const response = await backendFetch("/auth/me", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!response.ok) return null;
      const data = (await response.json()) as { user: AdminUser };
      return data.user?.role === "ADMIN" ? data : null;
    } catch {
      return null;
    }
  },
);
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
