"use client";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  Download,
  Mail,
} from "lucide-react";
import { Github, Linkedin } from "@/components/ui/SocialIcons";
import Parallax from "@/components/animations/Parallax";
import FadeIn from "@/components/animations/FadeIn";
import TextReveal from "@/components/animations/TextReveal";
import TypewriterText from "@/components/animations/TypewriterText";
import Button from "@/components/ui/Button";
import DeveloperAvatar from "@/components/3d/DeveloperAvatar";
import { personal, profile } from "@/data/portfolio";
export default function Hero({
  onProjects,
  onUnavailable,
}: {
  onProjects: () => void;
  onUnavailable: (title: string) => void;
}) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <Parallax className="ambient ambient-cyan" distance={35} decorative />
      <Parallax className="ambient ambient-purple" distance={-25} decorative />
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${i * -0.7}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
      <div className="hero-inner">
        <div className="hero-content">
          <FadeIn delay={0.15}>
            <div className="availability">
              <span className="status-dot" />
              Available for Software Engineering Opportunities
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="intro-label">
              <span /> ENGINEERING IDEAS INTO REALITY
            </div>
            <h1 id="hero-title" className="hero-title">
              <TextReveal
                text="Hi, I'm"
                className="hero-greeting"
                delay={0.25}
              />
              <TextReveal text="HARSHANA" className="hero-name" delay={0.4} />
              <TypewriterText className="hero-profession" />
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="hero-subtitle">{personal.titles.join(" | ")}</p>
          </FadeIn>
          <FadeIn delay={0.55}>
            <p className="hero-description">
              I build scalable web applications, mobile solutions, and
              intelligent digital experiences using modern technologies.
            </p>
          </FadeIn>
          <FadeIn delay={0.5} className="hero-education">
            <span className="education-mark" aria-hidden="true">
              N
            </span>
            <div>
              <strong>{personal.education}</strong>
              <span>{personal.institute}</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.7} className="hero-buttons">
            <Button onClick={onProjects}>
              View Projects <ArrowRight size={18} />
            </Button>
            {profile.cv ? (
              <a className="button button-secondary" href={profile.cv} download>
                Download CV <Download size={17} />
              </a>
            ) : (
              <Button
                variant="secondary"
                onClick={() => onUnavailable("Download CV")}
              >
                Download CV <Download size={17} />
              </Button>
            )}
          </FadeIn>
          <FadeIn delay={0.5} className="social-row">
            <span>LET&apos;S CONNECT</span>
            <div className="social-divider" />
            {[
              { label: "GitHub", href: profile.github, Icon: Github },
              { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin },
              {
                label: "Email",
                href: profile.email ? `mailto:${profile.email}` : "",
                Icon: Mail,
              },
            ].map(({ label, href, Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="social-link"
                  target={label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                >
                  <Icon size={19} />
                </a>
              ) : (
                <button
                  type="button"
                  key={label}
                  aria-label={`${label} — details coming soon`}
                  className="social-link"
                  onClick={() => onUnavailable(label)}
                >
                  <Icon size={19} />
                </button>
              ),
            )}
          </FadeIn>
        </div>
        <FadeIn delay={0.85} className="hero-visual">
          <Parallax distance={16}>
            <DeveloperAvatar />
          </Parallax>
        </FadeIn>
      </div>
      <FadeIn delay={0.7} className="hero-bottom">
        <div>
          <span className="bottom-star">&#10035;</span>
          <span>
            Clean code. Thoughtful design. <strong>Real impact.</strong>
          </span>
        </div>
        <button onClick={onProjects} className="explore-button">
          EXPLORE MY WORK <ArrowDown size={15} />
        </button>
        <span className="edition">
          PORTFOLIO / 01 <ArrowDownRight size={15} />
        </span>
      </FadeIn>
    </section>
  );
}
