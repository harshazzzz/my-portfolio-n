import "server-only";
import { getBackendOrigin } from "@/lib/backend-url";
export const AUTH_COOKIE = "harsha_admin_token";
export function backendFetch(path: string, init?: RequestInit) {
  return fetch(new URL(path, getBackendOrigin()), {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}
