import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json(session ?? { message: "Unauthorized" }, {
    status: session ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  });
}
