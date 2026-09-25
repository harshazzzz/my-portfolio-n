"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
export default function PageTransitions() {
  const pathname = usePathname(),
    router = useRouter(),
    reduced = useReducedMotion();
  const pending = useRef<(() => void) | null>(null);
  useEffect(() => {
    pending.current?.();
    pending.current = null;
    if (!reduced && !document.startViewTransition) {
      const animation = document.body.animate([{ opacity: .85 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
      return () => animation.cancel();
    }
  }, [pathname, reduced]);
  useEffect(() => {
    if (reduced) return;
    function click(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        pending.current
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href);
      if (
        url.origin !== location.origin ||
        url.pathname === location.pathname ||
        !document.startViewTransition
      )
        return;
      event.preventDefault();
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timer = window.setTimeout(() => {
              pending.current = null;
              resolve();
            }, 2000);
            pending.current = () => {
              clearTimeout(timer);
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
      void transition.finished.catch(() => {});
    }
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("click", click, true);
      pending.current?.();
      pending.current = null;
    };
  }, [router, reduced]);
  return null;
}
