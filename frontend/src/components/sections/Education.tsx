"use client";
import TextReveal from "@/components/animations/TextReveal";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { BookOpen, GraduationCap, School, ArrowUpRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Floating from "@/components/animations/Floating";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { education } from "@/data/education";

export default function Education() {
  const timeline = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 85%", "end 65%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section
      id="education"
      className="education-section"
      aria-labelledby="education-heading"
    >
      <div className="education-section-top">
        <span className="eyebrow">05 / ACADEMIC FOUNDATIONS</span>
        <span>EVERY CHAPTER BUILDS THE NEXT.</span>
      </div>
      <ScrollReveal className="education-heading-block">
        <div>
          <span className="education-overline">
            A FOUNDATION FOR WHAT COMES NEXT
          </span>
          <h2 id="education-heading">
            <TextReveal text="Learning with " onScroll />
            <span>
              <TextReveal text="Purpose" onScroll />
            </span>
            <span className="education-heading-dot">.</span>
          </h2>
        </div>
        <div className="education-heading-aside">
          <span>EDUCATION / 2021 TO PRESENT</span>
          <p>
            From school foundations to software engineering.
            <br />A journey of curiosity, commitment, and growth.
          </p>
        </div>
      </ScrollReveal>
      <div className="education-current-note">
        <span className="status-dot" />
        <p>
          Currently pursuing my <strong>HND in Software Engineering</strong> at
          NIBM.
        </p>
        <span>
          THE JOURNEY CONTINUES <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      </div>
      <div ref={timeline} className="education-timeline">
        {/* The same scroll progress drives both rails; responsive CSS switches the
          visible axis without client-only layout measurements. */}
        <div className="education-rail education-horizontal" aria-hidden="true">
          <motion.div style={{ scaleX: reduce ? 1 : progress }} />
        </div>
        <div className="education-rail education-vertical" aria-hidden="true">
          <motion.div style={{ scaleY: reduce ? 1 : progress }} />
        </div>
        <ol className="education-items">
          {education.map((item, index) => {
            const Icon = item.current
              ? GraduationCap
              : item.institute
                ? BookOpen
                : School;
            return (
              <li
                key={item.id}
                className={`education-item${item.current ? " education-is-current" : ""}`}
              >
                <span className="education-node" aria-hidden="true" />
                <ScrollReveal
                  delay={index * 0.07}
                  className="education-card-reveal"
                >
                  <motion.article
                    className="education-card-motion"
                    aria-labelledby={`qualification-${item.id}`}
                    whileHover={reduce ? undefined : { y: -5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <GlassCard className="education-card">
                      <span className="education-year">{item.period}</span>
                      <Floating
                        delay={index * 0.6}
                        className="education-floating-icon"
                      >
                        <span className="education-icon">
                          <Icon size={24} aria-hidden="true" />
                        </span>
                      </Floating>
                      <h3 id={`qualification-${item.id}`}>
                        {item.qualification}
                      </h3>
                      {item.stream && (
                        <span className="education-stream">{item.stream}</span>
                      )}
                      {item.institute && (
                        <p className="education-institute">{item.institute}</p>
                      )}
                      <p className="education-description">
                        {item.description}
                      </p>
                      <span className="education-status">
                        {item.current && <i className="status-dot" />}
                        {item.status}
                      </span>
                    </GlassCard>
                  </motion.article>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="education-footnote">
        A strong foundation. <span>An always-learning mindset.</span>
      </p>
    </section>
  );
}
