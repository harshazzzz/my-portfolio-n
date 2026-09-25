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
    !("message" in body) ||
    typeof body.message !== "string" ||
    !body.message.trim() ||
    body.message.length > 1000
  )
    return NextResponse.json(
      { message: "Enter a message between 1 and 1000 characters." },
      { status: 400 },
    );
  try {
    const response = await backendFetch("/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body.message.trim() }),
    });
    if (!response.ok)
      return NextResponse.json(
        {
          message:
            response.status === 429
              ? "Too many requests. Please wait a minute."
              : "Assistant is unavailable. Please try again.",
        },
        { status: response.status, headers: { "Cache-Control": "no-store" } },
      );
    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "Assistant is offline. Please try again shortly." },
      { status: 503 },
    );
  }
}
