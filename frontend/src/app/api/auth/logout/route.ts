import { isSameOrigin } from "@/lib/auth/origin";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, backendFetch } from "@/lib/auth/backend";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token) {
    try {
      const result = await backendFetch("/auth/logout", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
      });
      if (!result.ok && result.status !== 401)
        return NextResponse.json(
          { message: "Sign-out failed. Try again." },
          { status: 503 },
        );
    } catch {
      return NextResponse.json(
        { message: "Sign-out failed. Try again." },
        { status: 503 },
      );
    }
  }
  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
