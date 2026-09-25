"use client";
import { motion, useReducedMotion } from "framer-motion";
import DeveloperFallback from "@/components/3d/DeveloperFallback";
export default function LoadingScreen({
  entrance = false,
}: {
  entrance?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="developer-loading-screen"
      role={entrance ? undefined : "status"}
      aria-hidden={entrance || undefined}
      aria-label={entrance ? undefined : "Loading portfolio"}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <div className="developer-loading-orbit" aria-hidden />
      <motion.div
        className="developer-loading-preview"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <DeveloperFallback />
      </motion.div>
      <span className="developer-loading-mark" aria-hidden>
        &lt;HK&gt;
      </span>
      <h2>Building Digital Experiences</h2>
      <div className="developer-loading-track" aria-hidden>
        <motion.div
          className="developer-loading-line"
          animate={reduced ? undefined : { x: ["-100%", "100%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p>
        {entrance
          ? "Welcome to my portfolio"
          : "Loading your next experience..."}
      </p>
    </motion.div>
  );
}
