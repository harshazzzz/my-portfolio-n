"use client";
import TextReveal from "@/components/animations/TextReveal";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  Code2,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import GlassCard from "@/components/ui/GlassCard";
import Floating from "@/components/animations/Floating";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { about, personal } from "@/data/portfolio";
import { projects } from "@/data/projects";

const stats = [
  {
    label: "Projects Built",
    value: String(projects.length).padStart(2, "0"),
    detail: "Practical solutions, built with purpose",
    Icon: Code2,
  },
  {
    label: "Technologies",
    value: String(about.technologies.length).padStart(2, "0"),
    detail: "Across web, mobile, and data",
    Icon: Braces,
  },
  {
    label: "Development Areas",
    value: String(about.areas.length).padStart(2, "0"),
    detail: "One connected engineering mindset",
    Icon: Layers,
  },
  {
    label: "Learning Journey",
    value: "Since 2022",
    detail: "Curiosity that keeps moving forward",
    Icon: GraduationCap,
  },
];

export default function About() {
  const reduce = useReducedMotion();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const timeline = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 80%", "end 65%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
  });
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(x, { stiffness: 120, damping: 22 });

  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div className="about-section-top">
        <span className="eyebrow">01 / THE PERSON BEHIND THE CODE</span>
        <span className="about-top-note">CURIOUS MIND. PURPOSEFUL WORK.</span>
      </div>
      <div className="about-layout">
        <ScrollReveal className="about-profile-column">
          <div
            className="about-profile-perspective"
            onPointerMove={(event) => {
              if (reduce || event.pointerType !== "mouse") return;
              // Spring-backed motion values avoid React rerenders on pointer movement.
              const bounds = event.currentTarget.getBoundingClientRect();
              x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 10);
              y.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
          >
            <Floating>
              <motion.div style={{ rotateX, rotateY }}>
                <GlassCard className="about-profile-card">
                  <button
                    type="button"
                    className="profile-details-trigger"
                    aria-label="View personal details for Yasas Sri Harshana Karunarathna"
                    aria-haspopup="dialog"
                    aria-expanded={detailsOpen}
                    onClick={() => {
                      x.set(0);
                      y.set(0);
                      setDetailsOpen(true);
                    }}
                  />
                  <div className="about-card-top">
                    <span>
                      <i className="status-dot" /> OPEN TO INTERNSHIPS
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                  <motion.div
                    className="about-photo-frame"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="about-photo-crop">
                      <Image
                        src="/harshana-profile.jpeg"
                        alt="Harshana Karunarathna wearing a white shirt and tie"
                        width={1280}
                        height={1280}
                        sizes="(max-width: 767px) 350px, (max-width: 900px) 35vw, 420px"
                        className="about-profile-photo"
                      />
                      <div className="about-photo-shade" aria-hidden="true" />
                      <span
                        className="about-photo-signature"
                        aria-hidden="true"
                      >
                        HK<span>.</span>
                      </span>
                    </div>
                    <span
                      className="about-photo-corner corner-top"
                      aria-hidden="true"
                    />
                    <span
                      className="about-photo-corner corner-bottom"
                      aria-hidden="true"
                    />
                  </motion.div>
                  <div className="about-profile-copy">
                    <span className="about-card-kicker">
                      DEVELOPER & CONTINUOUS LEARNER
                    </span>
                    <h3>
                      Harshana
                      <br />
                      Karunarathna<span>.</span>
                    </h3>
                    <p>
                      Software Engineer <span>/</span> Full Stack Developer
                    </p>
                    <span className="about-mobile-role">
                      Mobile Application Developer
                    </span>
                  </div>
                  <div className="about-profile-school">
                    <GraduationCap size={22} aria-hidden="true" />
                    <div>
                      <strong>Software Engineering Student</strong>
                      <span>{personal.institute}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </Floating>
          </div>
          <div className="about-profile-caption">
            <Sparkles size={14} aria-hidden="true" />
            <span>Click my card to get to know me.</span>
            <span className="about-caption-line" />
          </div>
        </ScrollReveal>

        <div className="about-story-column">
          <ScrollReveal>
            <h2 id="about-heading">
              <TextReveal text="Building Digital" onScroll />
              <br />
              <span>
                <TextReveal text="Experiences" onScroll />
              </span>
              <span className="about-heading-dot">.</span>
            </h2>
            <p className="about-story-lead">
              I&apos;m {personal.name}, a software engineering student who
              enjoys turning ideas into useful, real-world software.
            </p>
            <p className="about-story-body">
              My journey at NIBM has shaped a practical approach to engineering:
              understand the problem, build with purpose, and keep improving.
              From responsive web applications and mobile experiences to backend
              systems, databases, and IoT solutions, I enjoy connecting
              technologies to solve everyday challenges.
            </p>
            <p className="about-story-body">
              I&apos;m currently pursuing my {personal.education} at{" "}
              {personal.institute}. Every project is an opportunity to explore a
              new idea, strengthen my foundations, and become a more thoughtful
              developer.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="about-stack" aria-label="Technologies I work with">
              {about.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <div className="about-area-summary">
              <span>EXPLORING</span>
              <p>{about.areas.join(" / ")}</p>
            </div>
          </ScrollReveal>
          <div className="about-journey-heading">
            <span className="eyebrow">THE JOURNEY SO FAR</span>
            <span>LEARN. BUILD. EVOLVE.</span>
          </div>
          <ol ref={timeline} className="about-timeline">
            <motion.li
              className="about-timeline-progress"
              aria-hidden="true"
              style={{ scaleY: reduce ? 1 : lineProgress }}
            />
            {about.education.map((entry, index) => (
              <li
                key={entry.year}
                className={`about-timeline-entry${entry.current ? " is-current" : ""}`}
              >
                <ScrollReveal delay={index * 0.08}>
                  <span className="about-timeline-dot" aria-hidden="true" />
                  <div className="about-timeline-date">
                    <span>{entry.year}</span>
                    {entry.current && (
                      <span className="about-current-tag">IN PROGRESS</span>
                    )}
                  </div>
                  <h3>{entry.title}</h3>
                  <span className="about-timeline-school">
                    {entry.institution}
                  </span>
                  <p>{entry.description}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="about-stats">
        {stats.map(({ label, value, detail, Icon }, index) => (
          <ScrollReveal key={label} delay={index * 0.07}>
            <motion.div
              whileHover={reduce ? undefined : { y: -5, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <GlassCard className="about-stat-card">
                <div className="about-stat-top">
                  <Icon size={18} aria-hidden="true" />
                  <span>0{index + 1}</span>
                </div>
                <strong>{value}</strong>
                <h3>{label}</h3>
                <p>{detail}</p>
              </GlassCard>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="A little more about me"
      >
        {detailsOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="personal-details-header">
              <Image
                src="/harshana-profile.jpeg"
                alt="Harshana Karunarathna"
                width={80}
                height={80}
                className="personal-details-photo"
                sizes="80px"
              />
              <div>
                <span className="eyebrow">NICE TO MEET YOU</span>
                <h3>{personal.fullName}</h3>
                <p>Software Engineering Student</p>
              </div>
            </div>
            <dl className="personal-details-grid">
              <div className="personal-detail-wide">
                <dt>Full name</dt>
                <dd>{personal.fullName}</dd>
              </div>
              <div>
                <dt>Birthday</dt>
                <dd>
                  <time dateTime={personal.birthday}>
                    {personal.birthdayLabel}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Age</dt>
                <dd>{personal.age} years old</dd>
              </div>
              <div className="personal-detail-wide">
                <dt>Telephone</dt>
                <dd>
                  {personal.telephone ? (
                    <a
                      href={"tel:" + personal.telephone.replace(/[^+\d]/g, "")}
                    >
                      {personal.telephone}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
            </dl>
            <div className="personal-introduction">
              <h3>A little introduction</h3>
              <p>{personal.introduction}</p>
            </div>
          </motion.div>
        )}
      </Dialog>
    </section>
  );
}
