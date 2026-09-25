"use client";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
export default function Floating({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null),
    reduce = useReducedMotion();
  const visible = useInView(ref, { margin: "50px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      animate={!reduce && visible ? { y: [0, -8, 0] } : { y: 0 }}
      transition={
        !reduce && visible
          ? { duration: 6, delay, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}
