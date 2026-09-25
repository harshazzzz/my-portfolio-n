import { NextRequest, NextResponse } from "next/server";
import { forwardBlogRequest } from "@/lib/admin-blog-api";
async function mutate(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id))
    return NextResponse.json({ message: "Invalid blog ID." }, { status: 400 });
  return forwardBlogRequest(request, "/blogs/" + id);
}
export const PATCH = mutate;
export const DELETE = mutate;
