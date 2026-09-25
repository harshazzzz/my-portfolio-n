"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, Moon, Sun, Sparkles, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { navigation, type Section } from "@/data/portfolio";
export default function Navbar({
  active,
  onNavigate,
  onAssistant,
}: {
  active: Section;
  onNavigate: (section: Section) => void;
  onAssistant: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  // React only rerenders when the scroll position crosses the glass threshold.
  useMotionValueEvent(scrollY, "change", (position) =>
    setScrolled(position > 24),
  );
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 }),
    springY = useSpring(y, { stiffness: 220, damping: 18 });
  useEffect(() => {
    if (!open) return;
    const menuTrigger = trigger.current;
    const el = dialog.current;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      el?.close();
      document.body.style.overflow = previous;
      media.removeEventListener("change", closeOnDesktop);
      menuTrigger?.focus();
    };
  }, [open]);
  function navigate(section: Section) {
    setOpen(false);
    onNavigate(section);
  }
  const themeButton = (
    <button
      className="icon-button theme-toggle"
      aria-label="Toggle light or dark theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="sun-icon" size={18} />
      <Moon className="moon-icon" size={18} />
    </button>
  );
  return (
    <>
      <motion.header
        className={`navbar${scrolled ? " navbar-scrolled" : ""}`}
        initial={reduce ? false : { y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <a
          href="#home"
          className="logo"
          aria-label="Harshana Karunarathna home"
          onClick={() => onNavigate("Home")}
        >
          HK<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              aria-current={active === item ? "page" : undefined}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={(e) => {
                e.preventDefault();
                navigate(item);
              }}
            >
              {item}
              {active === item && (
                <motion.span
                  className="active-line"
                  layoutId="active-navigation"
                />
              )}
            </motion.a>
          ))}
        </nav>
        <div className="nav-actions">
          {themeButton}
          <motion.button
            className="assistant-button"
            style={{ x: springX, y: springY }}
            onPointerMove={(e) => {
              if (reduce || e.pointerType !== "mouse") return;
              const rect = e.currentTarget.getBoundingClientRect();
              x.set((e.clientX - rect.left - rect.width / 2) * 0.12);
              y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
            onClick={onAssistant}
          >
            <Sparkles size={15} /> Harsha&apos;s Assistant <span className="status-dot" />
          </motion.button>
          <button
            ref={trigger}
            className="icon-button menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <Menu size={23} />
          </button>
        </div>
      </motion.header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Mobile navigation"
        onCancel={() => setOpen(false)}
      >
        {open && (
          <motion.div
            className="mobile-menu-inner"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
          >
            <div className="mobile-top">
              <a href="#home" className="logo" onClick={() => navigate("Home")}>
                HK<span>.</span>
              </a>
              <button
                className="icon-button"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </div>
            <nav aria-label="Mobile">
              {navigation.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  aria-current={active === item ? "page" : undefined}
                  initial={reduce ? false : { opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item);
                  }}
                >
                  <span className="menu-number">0{i + 1}</span>
                  {item}
                  <ArrowUpRight size={20} />
                </motion.a>
              ))}
            </nav>
            <button
              className="assistant-button"
              onClick={() => {
                setOpen(false);
                onAssistant();
              }}
            >
              <Sparkles size={17} /> Meet Harsha&apos;s Assistant
            </button>
          </motion.div>
        )}
      </dialog>
    </>
  );
}
