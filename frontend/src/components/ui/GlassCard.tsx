import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export default function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass-card", className)} {...props} />;
}
