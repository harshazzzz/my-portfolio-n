import { NextRequest } from "next/server";
import { forwardAdminRequest } from "@/lib/admin-api";
export const GET = (request: NextRequest) =>
  forwardAdminRequest(request, "/messages");
