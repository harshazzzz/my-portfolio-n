import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/auth/backend";
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
    !("email" in body) ||
    typeof body.email !== "string" ||
    body.email.length > 254
  )
    return NextResponse.json(
      { message: "Please enter valid email details." },
      { status: 400 },
    );
  try {
    const result = await backendFetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email }),
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
    return response;
  } catch {
    return NextResponse.json(
      { message: "Password recovery is unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
