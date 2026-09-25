import { api } from "@/lib/api";
import type { AdminUser, LoginResult } from "@/lib/auth/types";
export const login = (email: string, password: string) =>
  api<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const logout = () =>
  api<{ success: boolean }>("/auth/logout", { method: "POST" });
export const getCurrentUser = () => api<{ user: AdminUser }>("/auth/me");
