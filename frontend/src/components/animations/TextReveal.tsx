"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function TextReveal({
  text = "Software Engineer",
  className,
  delay = 0,
  onScroll = false,
}: {
  text?: string;
  className?: string;
  delay?: number;
  onScroll?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={className} style={className ? undefined : { color: "inherit" }}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        style={{ color: "inherit" }}
        initial={reduce ? false : "hidden"}
        animate={onScroll ? undefined : "visible"}
        whileInView={onScroll ? "visible" : undefined}
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduce ? 0 : 0.018,
              delayChildren: reduce ? 0 : delay,
            },
          },
        }}
      >
        {text.split(" ").map((word, wi) => (
          <span
            key={wi}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              color: "inherit",
            }}
          >
            {Array.from(word).map((character, ci) => (
              <motion.span
                key={ci}
                className="character"
                style={{ color: "inherit" }}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: reduce ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                {character}
              </motion.span>
            ))}
            {wi < text.split(" ").length - 1 ? "\u00a0" : ""}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
