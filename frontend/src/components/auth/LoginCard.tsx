"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./auth.module.css";
export default function LoginCard({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={styles.card}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
