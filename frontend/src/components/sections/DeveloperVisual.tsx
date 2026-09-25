"use client";

import { useId } from "react";
import { technologies } from "@/data/portfolio";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const planetColors = [
  "#e6faff",
  "#61dafb",
  "#64b5ff",
  "#93d881",
  "#67d9ff",
  "#ffb66b",
  "#72db9f",
];
const satellites = technologies.map((name, i) => ({
  name,
  symbol: ["N", "R", "TS", "JS", "F", "F", "M"][i],
  color: planetColors[i],
}));

// All coordinates are deterministic: server and client render the same constellation.
const stars = Array.from({ length: 38 }, (_, i) => ({
  x: 35 + ((i * 137) % 530),
  y: 45 + ((i * 97) % 505),
  radius: i % 5 === 0 ? 1.8 : 0.8,
}));

export default function DeveloperVisual() {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 80, damping: 22 });
  const rotateX = useSpring(pointerY, { stiffness: 80, damping: 22 });

  return (
    <div
      className="constellation"
      role="img"
      aria-label="An animated luminous intelligence core surrounded by Next.js, React, TypeScript, Node.js, Flutter, Firebase, and MongoDB."
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
        pointerY.set(
          -((event.clientY - bounds.top) / bounds.height - 0.5) * 12,
        );
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="constellation-aura" aria-hidden="true" />
      <div className="constellation-heading" aria-hidden="true">
        <span /> HARSHANA / AI CORE <span />
      </div>
      <motion.svg
        viewBox="0 0 600 600"
        className="constellation-scene"
        style={{ rotateX, rotateY }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-sphere`} cx="32%" cy="24%" r="85%">
            <stop offset="0%" stopColor="#45ffff" stopOpacity=".5" />
            <stop offset="40%" stopColor="#085969" stopOpacity=".8" />
            <stop offset="75%" stopColor="#13192f" />
            <stop offset="100%" stopColor="#6137a1" />
          </radialGradient>
          <linearGradient id={`${id}-arc`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00f5ff" />
            <stop offset=".5" stopColor="#77b7ff" />
            <stop offset="1" stopColor="#aa6aff" />
          </linearGradient>
          <radialGradient id={`${id}-halo`}>
            <stop stopColor="#00e5ff" stopOpacity=".18" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${id}-glow`}
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`${id}-clip`}>
            <circle cx="300" cy="300" r="88" />
          </clipPath>
        </defs>

        {stars.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.radius}
            className="constellation-star"
            style={{ animationDelay: `${i * -0.37}s` }}
          />
        ))}
        <circle cx="300" cy="300" r="230" fill={`url(#${id}-halo)`} />
        <circle
          cx="300"
          cy="300"
          r="242"
          className="constellation-guide"
          strokeDasharray="1 12"
        />
        <circle cx="300" cy="300" r="200" className="constellation-guide" />
        <circle
          cx="300"
          cy="300"
          r="155"
          className="constellation-guide"
          strokeDasharray="3 8"
        />
        <g className="constellation-sweep">
          <circle
            cx="300"
            cy="300"
            r="155"
            fill="none"
            stroke={`url(#${id}-arc)`}
            strokeWidth="1.5"
            strokeDasharray="110 864"
            strokeLinecap="round"
          />
          <circle
            cx="455"
            cy="300"
            r="3"
            fill="#00f5ff"
            filter={`url(#${id}-glow)`}
          />
        </g>
        <g className="constellation-sweep constellation-sweep-reverse">
          <ellipse
            cx="300"
            cy="300"
            rx="238"
            ry="92"
            transform="rotate(-35 300 300)"
            fill="none"
            stroke={`url(#${id}-arc)`}
            strokeOpacity=".45"
            strokeWidth="1"
          />
          <ellipse
            cx="300"
            cy="300"
            rx="238"
            ry="92"
            transform="rotate(35 300 300)"
            fill="none"
            stroke={`url(#${id}-arc)`}
            strokeOpacity=".15"
          />
        </g>

        {/* SVG groups translate along sampled elliptical paths; labels stay upright. */}
        {satellites.map((satellite, index) => {
          const angle = (index * Math.PI * 2) / satellites.length - Math.PI / 2;
          const frames = Array.from(
            { length: 73 },
            (_, step) => angle + (step / 72) * Math.PI * 2,
          );
          const xs = frames.map((a) => 300 + Math.cos(a) * 200);
          const ys = frames.map((a) => 300 + Math.sin(a) * 200);
          return (
            <motion.g
              key={satellite.name}
              initial={false}
              animate={{ x: reduce ? xs[0] : xs, y: reduce ? ys[0] : ys }}
              transition={{ duration: 72, ease: "linear", repeat: Infinity }}
            >
              <circle
                r="29"
                fill={satellite.color}
                fillOpacity=".04"
                stroke={satellite.color}
                strokeOpacity=".18"
              />
              <circle
                r="21"
                className="constellation-node"
                stroke={satellite.color}
                strokeOpacity=".45"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={satellite.color}
                className="constellation-symbol"
              >
                {satellite.symbol}
              </text>
              <rect
                x="-43"
                y="34"
                width="86"
                height="23"
                rx="11.5"
                className="constellation-label-bg"
              />
              <text textAnchor="middle" y="49" className="constellation-label">
                {satellite.name}
              </text>
            </motion.g>
          );
        })}

        <circle
          cx="300"
          cy="300"
          r="105"
          className="constellation-pulse"
          fill="none"
          stroke="#00f5ff"
          strokeOpacity=".3"
        />
        <circle
          cx="300"
          cy="300"
          r="96"
          fill="none"
          stroke={`url(#${id}-arc)`}
          strokeWidth=".7"
          strokeOpacity=".6"
        />
        {/* Layered beveled faces create depth without a WebGL render loop. */}
        <g className="ai-crystal">
          <polygon
            points="300,201 386,250 386,350 300,399 214,350 214,250"
            fill={`url(#${id}-sphere)`}
            stroke={`url(#${id}-arc)`}
            strokeWidth="1.5"
          />
          <polygon
            points="300,215 373,257 373,343 300,385 227,343 227,257"
            fill="#050f1d"
            fillOpacity=".55"
            stroke="#6feaff"
            strokeOpacity=".25"
          />
          <path
            d="M300 201L300 215M386 250L373 257M386 350L373 343M300 399L300 385M214 350L227 343M214 250L227 257"
            stroke="#a5e9ff"
            strokeOpacity=".6"
          />
          <path
            d="M227 257L300 215L373 257L300 279Z"
            fill="#5aeaff"
            fillOpacity=".08"
          />
          <path
            d="M300 279L373 257V343L300 385Z"
            fill="#8b5cf6"
            fillOpacity=".12"
          />
          <path
            className="core-circuit"
            d="M241 281V268L260 258M359 319V332L340 343M243 330L258 339M357 270L342 261"
            fill="none"
            stroke="#00f5ff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M280 275V325M320 275V325M280 300H320"
          fill="none"
          stroke="#e4ffff"
          strokeWidth="5"
          strokeLinecap="round"
          filter={`url(#${id}-glow)`}
        />
        <circle
          cx="332"
          cy="324"
          r="3"
          fill="#00f5ff"
          filter={`url(#${id}-glow)`}
        />
        <text
          x="300"
          y="351"
          textAnchor="middle"
          className="constellation-core-label"
        >
          HARSHANA AI CORE
        </text>
        <path
          d="M72 65h14m-7-7v14M512 520h14m-7-7v14"
          stroke="#00f5ff"
          strokeOpacity=".5"
        />
      </motion.svg>
      <div className="constellation-footer" aria-hidden="true">
        <span className="constellation-signal">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>
          Human creativity.
          <br />
          <strong>Infinite possibilities.</strong>
        </span>
        <span className="constellation-coordinate">
          BUILD / EVOLVE
          <br />
          CREATE / REPEAT
        </span>
      </div>
    </div>
  );
}
