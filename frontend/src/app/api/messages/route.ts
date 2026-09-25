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
    return NextResponse.json(
      { message: "Invalid message format." },
      { status: 400 },
    );
  }
  if (
    !body ||
    typeof body !== "object" ||
    !["name", "email", "subject", "message"].every(
      (key) =>
        key in body &&
        typeof (body as Record<string, unknown>)[key] === "string",
    )
  )
    return NextResponse.json(
      { message: "Please complete all fields." },
      { status: 400 },
    );
  const data = body as Record<string, string>;
  if (
    data.name.length > 100 ||
    data.email.length > 254 ||
    data.subject.length > 160 ||
    data.message.length > 10000
  )
    return NextResponse.json(
      { message: "One or more fields exceed the allowed length." },
      { status: 400 },
    );
  try {
    const response = await backendFetch("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
    });
    const payload = await response.json();
    return NextResponse.json(
      response.status === 429
        ? { message: "Too many messages. Please wait a minute and try again." }
        : response.status >= 500
          ? {
              message:
                "Message service is unavailable. Your message was not confirmed; please try again.",
            }
          : payload,
      {
        status: response.status,
        headers: {
          "Cache-Control": "no-store",
          ...(response.headers.get("retry-after")
            ? { "Retry-After": response.headers.get("retry-after")! }
            : {}),
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "Unable to confirm delivery. Please check your connection and try again.",
      },
      { status: 503 },
    );
  }
}
