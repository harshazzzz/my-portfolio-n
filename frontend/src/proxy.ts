import { getBackendOrigin } from "@/lib/backend-url";
import { NextResponse, type NextRequest } from "next/server";
// Next.js 16 uses proxy.ts in place of middleware.ts. Validate at the server boundary too.
export async function proxy(request: NextRequest) {
  if (
    [
      "/admin/login",
      "/admin/forgot-password",
      "/admin/reset-password",
    ].includes(request.nextUrl.pathname)
  )
    return NextResponse.next();
  const token = request.cookies.get("harsha_admin_token")?.value;
  if (token) {
    try {
      const result = await fetch(new URL("/auth/me", getBackendOrigin()), {
        headers: { Authorization: "Bearer " + token },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (result.ok && (await result.json()).user?.role === "ADMIN")
        return NextResponse.next();
    } catch {
      /* Fail closed when the authentication service is unavailable. */
    }
  }
  if (request.nextUrl.pathname.startsWith("/api/admin"))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
