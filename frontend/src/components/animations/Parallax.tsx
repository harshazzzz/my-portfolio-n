"use client";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
export default function Parallax({
  children,
  className,
  distance = 24,
  decorative = false,
}: {
  children?: ReactNode;
  className?: string;
  distance?: number;
  decorative?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div
      ref={ref}
      className={className}
      aria-hidden={decorative || undefined}
      style={{ y: reduce ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
