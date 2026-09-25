import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, backendFetch } from "@/lib/auth/backend";
import { isSameOrigin } from "@/lib/auth/origin";
export async function forwardAdminRequest(request: NextRequest, path: string) {
  if (request.method !== "GET" && !isSameOrigin(request))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token)
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  try {
    const result = await backendFetch(path, {
      method: request.method,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      ...(request.method === "GET" ? {} : { body: await request.text() }),
    });
    const data = await result.json();
    return NextResponse.json(
      result.status >= 500
        ? { message: "CMS service unavailable. Please try again." }
        : data,
      { status: result.status, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "CMS service unavailable. Please try again." },
      { status: 503 },
    );
  }
}
