"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import * as auth from "@/services/auth.service";
import type { AdminUser } from "@/lib/auth/types";
type AuthState = {
  user: AdminUser | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);
export default function AuthProvider({ children }: { children: ReactNode }) {
  const revision = useRef(0);
  const [user, setUser] = useState<AdminUser | null>(null);
  // JWT is kept only in memory; the HttpOnly cookie restores authentication on reload.
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const refresh = useCallback(async () => {
    const current = revision.current;
    try {
      const data = await auth.getCurrentUser();
      if (current !== revision.current) return;
      setUser(data.user);
      setStatus("authenticated");
    } catch {
      if (current !== revision.current) return;
      setUser(null);
      setToken(null);
      setStatus("unauthenticated");
    }
  }, []);
  useEffect(() => {
    let active = true;
    const current = revision.current;
    auth
      .getCurrentUser()
      .then(({ user }) => {
        if (active && current === revision.current) {
          setUser(user);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (active && current === revision.current) {
          setUser(null);
          setToken(null);
          setStatus("unauthenticated");
        }
      });
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(onFocus, 60000);
    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
      window.clearInterval(timer);
    };
  }, [refresh]);
  async function login(email: string, password: string) {
    const data = await auth.login(email, password);
    revision.current++;
    setUser(data.user);
    setToken(data.accessToken);
    setStatus("authenticated");
  }
  async function logout() {
    await auth.logout();
    revision.current++;
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
  }
  return (
    <AuthContext.Provider value={{ user, token, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthProvider is required.");
  return auth;
}
