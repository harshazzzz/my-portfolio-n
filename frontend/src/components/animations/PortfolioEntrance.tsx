"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
/** A short optional introduction, separate from the actual route loading state. */
export default function PortfolioEntrance() {
  const pathname = usePathname(),
    reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (pathname !== "/" || reduced !== false) return;
    try {
      if (sessionStorage.getItem("portfolio-intro-seen")) return;
    } catch {
      /* Private browsing may disable storage. */
    }
    let timer: number | undefined;
    const frame = requestAnimationFrame(() => {
      setVisible(true);
      try { sessionStorage.setItem("portfolio-intro-seen", "1"); } catch { /* Storage is optional. */ }
      timer = window.setTimeout(() => setVisible(false), 900);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      setVisible(false);
    };
  }, [pathname, reduced]);
  return (
    <AnimatePresence>
      {visible && pathname === "/" && !reduced && (
        <LoadingScreen key="entrance" entrance />
      )}
    </AnimatePresence>
  );
}
