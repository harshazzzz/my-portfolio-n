import { NextRequest, NextResponse } from "next/server";
import { forwardAdminRequest } from "@/lib/admin-api";
async function mutate(
  r: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json(
      { message: "Invalid project ID." },
      { status: 400 },
    );
  return forwardAdminRequest(r, "/projects/" + id);
}
export const PATCH = mutate;
export const DELETE = mutate;
