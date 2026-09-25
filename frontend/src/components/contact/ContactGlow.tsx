"use client";
import { motion, useReducedMotion } from "framer-motion";
import styles from "@/components/auth/auth.module.css";
export default function ContactGlow() {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={styles.ambient}
      aria-hidden
      animate={
        reduced
          ? undefined
          : { x: [-60, 60, -60], y: [-30, 30, -30], scale: [1, 1.15, 1] }
      }
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
