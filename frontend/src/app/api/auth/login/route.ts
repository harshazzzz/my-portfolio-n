import { isSameOrigin } from "@/lib/auth/origin";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, backendFetch } from "@/lib/auth/backend";
import type { LoginResult } from "@/lib/auth/types";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  try {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      body.email.length > 254 ||
      body.password.length > 72
    )
      return NextResponse.json(
        { message: "Enter a valid email and password." },
        { status: 400 },
      );
    const result = await backendFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
    if (!result.ok)
      return NextResponse.json(
        {
          message:
            result.status === 429
              ? "Too many attempts. Try again in a minute."
              : result.status >= 500
                ? "Login service is unavailable. Please try again."
                : "Invalid email or password.",
        },
        { status: result.status >= 500 ? 503 : result.status },
      );
    const data = (await result.json()) as LoginResult;
    if (data.user?.role !== "ADMIN" || !data.accessToken)
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    const response = NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
    response.cookies.set(AUTH_COOKIE, data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: data.expiresIn,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Login service is unavailable. Please try again." },
      { status: 503 },
    );
  }
}
