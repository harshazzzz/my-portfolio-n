import { NextRequest } from "next/server";
import { forwardBlogRequest } from "@/lib/admin-blog-api";
export const GET = (request: NextRequest) =>
  forwardBlogRequest(request, "/blogs/admin/all");
export const POST = (request: NextRequest) =>
  forwardBlogRequest(request, "/blogs");
