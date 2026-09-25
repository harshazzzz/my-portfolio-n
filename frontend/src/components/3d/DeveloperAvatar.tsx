"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import DeveloperFallback from "./DeveloperFallback";
import styles from "./DeveloperAvatar.module.css";
export function DeveloperAvatarLoading() {
  return (
    <>
      <DeveloperFallback />
      <span
        className={styles.loading}
        role="status"
        aria-label="Loading developer workspace"
      />
    </>
  );
}
const Scene = dynamic(() => import("./DeveloperScene"), {
  ssr: false,
  loading: DeveloperAvatarLoading,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <DeveloperFallback /> : this.props.children;
  }
}
const technologies = [
  { name: "Next.js", icon: "N", left: "8%", top: "18%" },
  { name: "React", icon: "\u269b", left: "66%", top: "15%" },
  { name: "TypeScript", icon: "TS", left: "71%", top: "40%" },
  { name: "Node.js", icon: "{ }", left: "5%", top: "46%" },
  { name: "Flutter", icon: "F", left: "12%", top: "72%" },
  { name: "Firebase", icon: "\u26a1", left: "70%", top: "73%" },
];
export default function DeveloperAvatar() {
  const ref = useRef<HTMLDivElement>(null),
    visible = useInView(ref, { margin: "80px" }),
    reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false),
    [tabVisible, setTabVisible] = useState(true),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () =>
      setDesktop(media.matches && "WebGL2RenderingContext" in window);
    const visibility = () => setTabVisible(!document.hidden);
    update();
    visibility();
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const animate = visible && tabVisible && !reduced && !paused;
  return (
    <div
      ref={ref}
      className={styles.stage}
      role="group"
      aria-label="Software engineer coding on a laptop in a futuristic workspace"
    >
      <SceneBoundary>
        {desktop && visible ? (
          <Scene animate={animate} />
        ) : (
          <DeveloperFallback />
        )}
      </SceneBoundary>
      {technologies.map((tech, i) => (
        <motion.div
          key={tech.name}
          className={styles.badge}
          style={{ left: tech.left, top: tech.top }}
          animate={
            animate
              ? { y: [0, -7, 0], rotate: [-1, 1, -1] }
              : { y: 0, rotate: 0 }
          }
          transition={
            animate
              ? { duration: 5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          <i aria-hidden>{tech.icon}</i>
          {tech.name}
        </motion.div>
      ))}
      <span className={styles.caption}>Harsha&apos;s Avatar</span>
      {!reduced && (
        <button
          type="button"
          className={styles.controls}
          aria-label={
            paused ? "Play developer animation" : "Pause developer animation"
          }
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>
      )}
    </div>
  );
}
