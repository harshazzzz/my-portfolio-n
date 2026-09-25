import { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/admin-api";
export const GET = (r: NextRequest) =>
  forwardAdminRequest(r, "/projects/admin/all");
export const POST = (r: NextRequest) => forwardAdminRequest(r, "/projects");
