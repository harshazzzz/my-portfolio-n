import { NextRequest, NextResponse } from "next/server";
import { backendFetch, AUTH_COOKIE } from "@/lib/auth/backend";
import { isSameOrigin } from "@/lib/auth/origin";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    typeof body !== "object" ||
    !("token" in body) ||
    typeof body.token !== "string" ||
    !/^[a-f0-9]{64}$/.test(body.token) ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length < 12 ||
    new TextEncoder().encode(body.password).length > 72
  )
    return NextResponse.json(
      { message: "Please enter valid reset details." },
      { status: 400 },
    );
  try {
    const result = await backendFetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: body.token, password: body.password }),
    });
    const payload = await result.json();
    const response = NextResponse.json(
      result.status === 429
        ? { message: "Too many attempts. Please wait a minute." }
        : result.status >= 500
          ? {
              message:
                "Password recovery is unavailable. Please contact the site administrator or try again later.",
            }
          : payload,
      { status: result.status, headers: { "Cache-Control": "no-store" } },
    );
    if (result.ok)
      response.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
    return response;
  } catch {
    return NextResponse.json(
      { message: "Password recovery is unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
