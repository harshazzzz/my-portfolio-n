"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const titles = [
  "Software Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Flutter Developer",
  "QA Engineer",
  "DevOps",
] as const;

export default function TypewriterText({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [text, setText] = useState<string>(titles[0]);

  useEffect(() => {
    if (reduce !== false) return;
    let titleIndex = 0;
    let characterCount: number = titles[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    // One cancellable timer handles typing, reading pauses, and faster deletion.
    function tick() {
      const title = titles[titleIndex];
      characterCount += deleting ? -1 : 1;
      setText(title.slice(0, characterCount));
      let delay = deleting ? 40 : 85;
      if (!deleting && characterCount === title.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && characterCount === 0) {
        deleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        delay = 320;
      }
      timer = setTimeout(tick, delay);
    }

    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <span className={className}>
      {/* Avoid announcing each keystroke to assistive technology. */}
      <span className="sr-only">{titles.join(", ")}</span>
      <span className="typewriter-line" aria-hidden="true">
        {reduce ? titles[0] : text}
        <span className="typewriter-cursor" />
      </span>
    </span>
  );
}
