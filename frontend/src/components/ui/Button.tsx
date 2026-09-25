"use client";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: HTMLMotionProps<"button"> & { variant?: "primary" | "secondary" }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      className={cn("button", `button-${variant}`, className)}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
