"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
export interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  scale?: number;
}
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  scale = 1,
}: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              y: direction === "up" ? 50 : 0,
              x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
              scale,
            }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduce ? 0 : 0.65,
        delay: reduce ? 0 : Math.min(delay, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
