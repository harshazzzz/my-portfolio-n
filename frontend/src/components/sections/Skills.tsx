"use client";
import TextReveal from "@/components/animations/TextReveal";
import { useId, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  Braces,
  Cpu,
  Network,
  Palette,
  Workflow,
  Brain,
  Code2,
  Database,
  GitBranch,
  Layers,
  Server,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Parallax from "@/components/animations/Parallax";
import ScaleIn from "@/components/animations/ScaleIn";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { orbitTechnologies, skillCategories } from "@/data/skills";

const icons = {
  languages: Braces,
  frontend: Code2,
  backend: Server,
  mobile: Smartphone,
  database: Database,
  tools: GitBranch,
  concepts: Layers,
  design: Palette,
  state: Network,
  iot: Cpu,
  ai: Brain,
  algorithms: Workflow,
};

function SkillsCore() {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: "100px" });
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateY = useSpring(x, { stiffness: 90, damping: 22 });
  const rotateX = useSpring(y, { stiffness: 90, damping: 22 });
  const animated = visible && !reduce;
  return (
    <figure
      ref={ref}
      className="skills-core"
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - box.left) / box.width - 0.5) * 10);
        y.set(-((event.clientY - box.top) / box.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.svg
        viewBox="0 0 760 390"
        className="skills-core-scene"
        style={{ rotateX, rotateY }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-aura`}>
            <stop stopColor="#00f5ff" stopOpacity=".13" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-edge`}>
            <stop stopColor="#00f5ff" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id={`${id}-face`} x2="1" y2="1">
            <stop stopColor="#0e333e" />
            <stop offset="1" stopColor="#19112b" />
          </linearGradient>
        </defs>
        <ellipse
          cx="380"
          cy="195"
          rx="290"
          ry="180"
          fill={`url(#${id}-aura)`}
        />
        {[0, 1, 2].map((i) => (
          <ellipse
            key={i}
            cx="380"
            cy="195"
            rx={265 - i * 26}
            ry={118 + i * 11}
            transform={`rotate(${i === 1 ? -12 : i === 2 ? 12 : 0} 380 195)`}
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth=".8"
            strokeOpacity={i === 0 ? 0.35 : 0.13}
            strokeDasharray={i === 2 ? "2 9" : undefined}
          />
        ))}
        <path
          d="M44 195h40m592 0h40M380 12v22m0 322v22"
          stroke="var(--primary)"
          strokeOpacity=".25"
        />
        <motion.g
          animate={animated ? { y: [0, -7, 0] } : { y: 0 }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect
            x="306"
            y="121"
            width="148"
            height="148"
            rx="38"
            fill={`url(#${id}-face)`}
            stroke={`url(#${id}-edge)`}
            strokeWidth="1.4"
          />
          <rect
            x="316"
            y="131"
            width="128"
            height="128"
            rx="30"
            fill="none"
            stroke="#ffffff12"
          />
          <text
            x="377"
            y="202"
            textAnchor="middle"
            className="skills-core-monogram"
          >
            HK<tspan fill="#00f5ff">.</tspan>
          </text>
          <text
            x="380"
            y="232"
            textAnchor="middle"
            className="skills-core-role"
          >
            Software Engineer
          </text>
        </motion.g>
        {/* Rotate positions instead of the badge itself so labels stay readable.
          Stop the keyframe loops when the visual is outside the viewport. */}
        {orbitTechnologies.map((technology, index) => {
          const phase = (index * Math.PI * 2) / orbitTechnologies.length;
          const angles = Array.from(
            { length: 65 },
            (_, frame) => phase + (frame / 64) * Math.PI * 2,
          );
          const xs = angles.map((angle) => 380 + Math.cos(angle) * 275);
          const ys = angles.map((angle) => 195 + Math.sin(angle) * 135);
          return (
            <motion.g
              key={technology.name}
              initial={false}
              animate={{ x: animated ? xs : xs[0], y: animated ? ys : ys[0] }}
              transition={{
                duration: animated ? 65 : 0,
                repeat: animated ? Infinity : 0,
                ease: "linear",
              }}
            >
              <rect
                x="-54"
                y="-24"
                width="108"
                height="48"
                rx="14"
                className="skills-orbit-badge"
                stroke={technology.color}
                strokeOpacity=".35"
              />
              <circle
                cx="-33"
                cy="0"
                r="12"
                fill={technology.color}
                fillOpacity=".1"
              />
              <text
                x="-33"
                y="4"
                textAnchor="middle"
                fill={technology.color}
                className="skills-orbit-symbol"
              >
                {technology.symbol}
              </text>
              <text
                x="10"
                y="4"
                textAnchor="middle"
                className="skills-orbit-name"
              >
                {technology.name}
              </text>
            </motion.g>
          );
        })}
      </motion.svg>
      <ul className="skills-mobile-legend" aria-label="Core technologies">
        {orbitTechnologies.map((technology) => (
          <li key={technology.name}>{technology.name}</li>
        ))}
      </ul>
      <figcaption>
        <span className="status-dot" /> ONE MINDSET. CONNECTED TECHNOLOGIES.
      </figcaption>
    </figure>
  );
}

export default function Skills() {
  const reduce = useReducedMotion();
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-heading"
    >
      <div className="skills-section-top">
        <span className="eyebrow">02 / MY DEVELOPMENT TOOLKIT</span>
        <span>LEARN IT. BUILD WITH IT. KEEP EVOLVING.</span>
      </div>
      <ScrollReveal className="skills-heading-block">
        <span className="skills-overline">THE STACK BEHIND THE SOLUTIONS</span>
        <h2 id="skills-heading">
          <TextReveal text="Technical " onScroll />
          <span>
            <TextReveal text="Skills" onScroll />
          </span>
          <span className="skills-heading-dot">.</span>
        </h2>
        <p>Technologies and tools I use to build modern digital solutions.</p>
      </ScrollReveal>
      <ScaleIn>
        <Parallax distance={18}>
          <SkillsCore />
        </Parallax>
      </ScaleIn>
      <div className="skills-category-grid">
        {skillCategories.map((category, index) => {
          const Icon = icons[category.id];
          return (
            <ScrollReveal
              key={category.id}
              className={
                category.id === "languages" ? "skills-language-row" : undefined
              }
              delay={Math.min(index % 3, 2) * 0.07}
            >
              <motion.article
                className={`skill-category skill-accent-${category.accent}`}
                aria-labelledby={`skill-${category.id}`}
                whileHover={reduce ? undefined : { y: -5 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard className="skill-category-card">
                  <div className="skill-card-heading">
                    <span className="skill-category-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="skill-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </div>
                  <div className="skill-card-content">
                    <h3 id={`skill-${category.id}`}>{category.title}</h3>
                    <p>{category.description}</p>
                    <ul className="skill-tags">
                      {category.items.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </motion.article>
            </ScrollReveal>
          );
        })}
      </div>
      <div className="skills-closing">
        <span />
        <p>
          Built on fundamentals. <strong>Driven by curiosity.</strong>
        </p>
        <span />
      </div>
    </section>
  );
}
