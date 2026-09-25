"use client";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import styles from "./chatbot.module.css";
export default function AIButton({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [0, -12]);
  return (
    <motion.button
      type="button"
      className={styles.launcher}
      onClick={onClick}
      aria-label="Open Harsha's Assistant"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="harsha-ai-chat"
      style={{ y: reduced ? 0 : scrollOffset }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
    >
      <span aria-hidden="true" className={styles.pulse} />
      <span>AI</span>
    </motion.button>
  );
}
