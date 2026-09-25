"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowUp, Mail, MessageCircle } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import TextReveal from "@/components/animations/TextReveal";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { personal, profile } from "@/data/portfolio";
import styles from "./footer.module.css";
const MotionLink = motion.create(Link);
const links = ["Home", "About", "Skills", "Projects", "Blog", "Contact"];
export default function Footer({ year }: { year: number }) {
  const reduced = useReducedMotion();
  const github = profile.github || "https://github.com/harshazzzz";
  function scrollTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    window.history.replaceState(null, "", "#" + id);
  }
  return (
    <footer className={styles.footer} aria-label="Portfolio footer">
      <motion.div
        className={styles.glow}
        aria-hidden
        animate={
          reduced ? undefined : { x: [-35, 35, -35], scale: [1, 1.15, 1] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <ScrollReveal className={styles.container}>
        <div className={styles.topline}>
          <span>
            <i /> ALWAYS LEARNING. ALWAYS BUILDING.
          </span>
          <a
            href="#home"
            onClick={(e) => scrollTo(e, "home")}
            className={styles.back}
          >
            Back to top <ArrowUp size={15} aria-hidden />
          </a>
        </div>
        <div className={styles.card}>
          <section className={styles.brand} aria-labelledby="footer-name">
            <a
              href="#home"
              onClick={(e) => scrollTo(e, "home")}
              className={styles.logo}
              aria-label="Harshana portfolio, back to top"
            >
              HK<span>.</span>
            </a>
            <h2 id="footer-name">
              <TextReveal text={personal.name} onScroll />
            </h2>
            <p className={styles.roles}>
              Software Engineering Student
              <br />
              Full Stack Developer
            </p>
            <p className={styles.description}>
              Building modern web applications, mobile solutions, and
              intelligent digital experiences.
            </p>
            <div className={styles.socials} aria-label="Social links">
              <motion.a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                whileHover={reduced ? undefined : { y: -3 }}
              >
                <Github size={19} />
              </motion.a>
              {profile.linkedin ? (
                <motion.a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  whileHover={reduced ? undefined : { y: -3 }}
                >
                  <Linkedin size={19} />
                </motion.a>
              ) : (
                <span
                  aria-disabled="true"
                  aria-label="LinkedIn profile not provided"
                  title="LinkedIn profile not provided"
                >
                  <Linkedin size={19} />
                </span>
              )}
              <motion.a
                href={
                  profile.email ? "mailto:" + profile.email : "#contact-form"
                }
                aria-label={
                  profile.email ? "Email Harshana" : "Send Harshana a message"
                }
                onClick={
                  profile.email ? undefined : (e) => scrollTo(e, "contact-form")
                }
                whileHover={reduced ? undefined : { y: -3 }}
              >
                <Mail size={19} aria-hidden />
              </motion.a>
            </div>
            <address className={styles.directContact}>
              <motion.a
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduced ? undefined : { x: 3 }}
              >
                <MessageCircle size={18} aria-hidden />
                <span>
                  <small>WhatsApp</small>
                  {profile.telephone}
                </span>
              </motion.a>
              <motion.a
                href={"mailto:" + profile.email}
                whileHover={reduced ? undefined : { x: 3 }}
              >
                <Mail size={18} aria-hidden />
                <span>
                  <small>Email</small>
                  {profile.email}
                </span>
              </motion.a>
            </address>
          </section>
          <nav className={styles.column} aria-label="Footer navigation">
            <h3>Explore</h3>
            {links.map((label) => (
              <motion.a
                key={label}
                href={"#" + label.toLowerCase()}
                onClick={(e) => scrollTo(e, label.toLowerCase())}
                whileHover={reduced ? undefined : { x: 4 }}
              >
                {label}
                <ArrowUpRight size={14} aria-hidden />
              </motion.a>
            ))}
          </nav>
          <section className={styles.column} aria-labelledby="footer-connect">
            <h3 id="footer-connect">Let&apos;s connect</h3>
            <p className={styles.note}>
              An idea, a collaboration, or an opportunity. Let&apos;s start a
              conversation.
            </p>
            <motion.a
              href={profile.email ? "mailto:" + profile.email : "#contact-form"}
              onClick={
                profile.email ? undefined : (e) => scrollTo(e, "contact-form")
              }
              whileHover={reduced ? undefined : { x: 4 }}
            >
              {profile.email || "Send a message"}
              <Mail size={15} aria-hidden />
            </motion.a>
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduced ? undefined : { x: 4 }}
            >
              GitHub
              <ArrowUpRight size={14} aria-hidden />
            </motion.a>
            {profile.linkedin ? (
              <motion.a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduced ? undefined : { x: 4 }}
              >
                LinkedIn
                <ArrowUpRight size={14} aria-hidden />
              </motion.a>
            ) : (
              <span
                className={styles.unavailable}
                aria-disabled="true"
                title="LinkedIn profile not provided"
              >
                LinkedIn
              </span>
            )}
            <a href={"tel:" + profile.telephone}>
              {profile.telephone}
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <a href={profile.cv} download>
              Download CV
              <ArrowUpRight size={14} aria-hidden />
            </a>
            <a
              className={styles.cta}
              href="#contact"
              onClick={(e) => scrollTo(e, "contact")}
            >
              Build something together <ArrowUpRight size={16} aria-hidden />
            </a>
          </section>
        </div>
        <div className={styles.bottom}>
          <p>
            &copy; {year} {personal.name}. All rights reserved.
          </p>
          <span>
            Thoughtfully built. Continuously evolving
            <span className={styles.dot}>.</span>
          </span>
          <MotionLink
            href="/admin/login"
            className={styles.adminLink}
            prefetch={false}
            whileHover={reduced ? undefined : { y: -2 }}
          >
            Admin
          </MotionLink>
        </div>
      </ScrollReveal>
    </footer>
  );
}
