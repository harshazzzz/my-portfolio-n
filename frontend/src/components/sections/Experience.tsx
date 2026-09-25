"use client";
import TextReveal from "@/components/animations/TextReveal";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Floating from "@/components/animations/Floating";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { experience } from "@/data/experience";

const icons = { society: Users, academic: GraduationCap, independent: Code2 };

export default function Experience() {
  const reduce = useReducedMotion();
  const timeline = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 85%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section
      id="experience"
      className="journey-section"
      aria-labelledby="journey-heading"
    >
      <div className="journey-section-top">
        <span className="eyebrow">04 / EXPERIENCE & JOURNEY</span>
        <span>GROWTH STARTS WITH SHOWING UP.</span>
      </div>
      <ScrollReveal className="journey-heading-block">
        <div>
          <span className="journey-overline">
            LEARNING. COLLABORATING. CREATING.
          </span>
          <h2 id="journey-heading">
            <TextReveal text="Experience " onScroll />
            <span>
              <TextReveal text="& Journey" onScroll />
            </span>
            <span className="journey-heading-dot">.</span>
          </h2>
        </div>
        <p>
          My experience so far comes from student communities, academic
          projects, and independent development. I&apos;m building the
          foundations for my first professional opportunity.
        </p>
      </ScrollReveal>
      <div ref={timeline} className="journey-timeline">
        {/* Both axes share scroll progress; CSS selects the horizontal or vertical rail.
          Keeping the layout decision in CSS avoids hydration and resize jumps. */}
        <div
          className="journey-rail journey-rail-horizontal"
          aria-hidden="true"
        >
          <motion.div style={{ scaleX: reduce ? 1 : progress }} />
        </div>
        <div className="journey-rail journey-rail-vertical" aria-hidden="true">
          <motion.div style={{ scaleY: reduce ? 1 : progress }} />
        </div>
        <ol className="journey-items">
          {experience.map((item, index) => {
            const Icon = icons[item.id];
            return (
              <li
                key={item.id}
                className={`journey-item journey-accent-${item.accent}`}
              >
                <span className="journey-node" aria-hidden="true">
                  <span />
                </span>
                <ScrollReveal
                  delay={index * 0.1}
                  className="journey-card-reveal"
                >
                  <motion.article
                    className="journey-card-motion"
                    aria-labelledby={`journey-${item.id}`}
                    whileHover={reduce ? undefined : { y: -5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <GlassCard className="journey-card">
                      <div className="journey-card-top">
                        <Floating delay={index * 0.8}>
                          <span className="journey-icon">
                            <Icon size={23} aria-hidden="true" />
                          </span>
                        </Floating>
                        <span className="journey-period">{item.period}</span>
                      </div>
                      <span className="journey-category">{item.category}</span>
                      <h3 id={`journey-${item.id}`}>{item.title}</h3>
                      {item.organization && (
                        <p className="journey-organization">
                          {item.organization}
                        </p>
                      )}
                      <p className="journey-description">{item.description}</p>
                      <div className="journey-highlights">
                        <span>
                          {item.id === "society"
                            ? "SKILLS DEVELOPED"
                            : "AREAS OF EXPERIENCE"}
                        </span>
                        <ul>
                          {item.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="journey-card-footer">
                        <span>
                          CHAPTER {String(index + 1).padStart(2, "0")}
                        </span>
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </div>
                    </GlassCard>
                  </motion.article>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
      <ScrollReveal>
        <div className="journey-next">
          <span className="journey-next-icon">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div>
            <span>THE NEXT CHAPTER</span>
            <h3>Ready to learn. Ready to contribute.</h3>
            <p>
              Looking for an internship where I can grow, collaborate, and turn
              my skills into meaningful work.
            </p>
          </div>
          <span className="journey-next-status">
            <i className="status-dot" /> OPEN TO OPPORTUNITIES
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}
