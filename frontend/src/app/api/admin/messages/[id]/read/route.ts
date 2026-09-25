import { NextRequest, NextResponse } from "next/server";
import { forwardAdminRequest } from "@/lib/admin-api";
export async function PATCH(
  r: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json(
      { message: "Invalid message ID." },
      { status: 400 },
    );
  return forwardAdminRequest(r, "/messages/" + id + "/read");
}
