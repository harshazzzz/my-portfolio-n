"use client";

import Image from "next/image";
import { shouldBypassImageOptimization } from "@/lib/images";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Cpu,
  MapPin,
  Radio,
  Smartphone,
  House,
  BarChart3,
} from "lucide-react";
import { Github } from "@/components/ui/SocialIcons";
import GlassCard from "@/components/ui/GlassCard";
import type { Project } from "@/data/projects";

function ProjectPreview({ project }: { project: Project }) {
  return (
    <div className={`project-preview preview-${project.preview}`}>
      {project.image ? (
        <Image
          unoptimized={shouldBypassImageOptimization(project.image)}
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes={
            project.featured
              ? "(max-width: 767px) 100vw, 55vw"
              : "(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw"
          }
          className="project-preview-image"
        />
      ) : project.preview === "generic" ? (
        <div className="project-preview-art" aria-hidden="true">
          <div className="project-preview-grid" />
          <Cpu size={70} />
        </div>
      ) : (
        <>
          <div className="project-preview-art" aria-hidden="true">
            <div className="project-preview-grid" />
            {project.preview === "pos" ? (
              <div className="pos-window">
                <div className="pos-window-bar">
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>WADIYA / WORKSPACE</span>
                  <BarChart3 size={13} />
                </div>
                <div className="pos-window-body">
                  <div className="pos-sidebar">
                    <strong>
                      W<span>.</span>
                    </strong>
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="pos-dashboard">
                    <span className="preview-micro">BUSINESS AT A GLANCE</span>
                    <div className="pos-stat-blocks">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="pos-chart">
                      <span>Sales overview</span>
                      <div>
                        {[30, 48, 37, 63, 53, 80, 68, 88, 74, 96].map(
                          (height, i) => (
                            <i key={i} style={{ height: `${height}%` }} />
                          ),
                        )}
                      </div>
                    </div>
                    <div className="pos-table-lines">
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
              </div>
            ) : project.preview === "mobile" ? (
              <div className="autocare-scene">
                <div className="autocare-map">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="autocare-phone">
                  <span className="phone-speaker" />
                  <span className="preview-micro">AUTOCARE</span>
                  <div className="phone-map">
                    <MapPin size={30} />
                    <i />
                    <i />
                  </div>
                  <div className="phone-service">
                    <Smartphone size={14} />
                    <span>Help, closer to you.</span>
                  </div>
                </div>
                <span className="autocare-location">
                  <MapPin size={16} />
                </span>
              </div>
            ) : project.preview === "library" ? (
              <div className="library-scene">
                <div className="library-book book-one" />
                <div className="library-book book-two" />
                <div className="library-book book-three">
                  <BookOpen size={34} />
                  <span>THE LIBRARY</span>
                  <i />
                </div>
                <div className="library-base" />
              </div>
            ) : (
              <div className="iot-scene">
                <div className="iot-network-ring" />
                <div className="iot-network-ring inner" />
                <div className="iot-core">
                  <Cpu size={36} />
                </div>
                <span className="iot-satellite iot-home">
                  <House size={21} />
                </span>
                <span className="iot-satellite iot-radio">
                  <Radio size={21} />
                </span>
                <span className="iot-satellite iot-home-two">
                  <House size={21} />
                </span>
                <span className="iot-caption">CONNECTED COMMUNITY</span>
              </div>
            )}
          </div>
          <span className="project-preview-label">
            CONCEPT PREVIEW / SCREENSHOT COMING SOON
          </span>
        </>
      )}
      {project.featured && (
        <span className="project-featured-badge">
          <span className="status-dot" /> FEATURED PROJECT
        </span>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 150, damping: 25 });
  const rotateY = useSpring(x, { stiffness: 150, damping: 25 });
  return (
    <div
      className={`project-perspective project-accent-${project.accent}${project.featured ? " project-featured" : ""}`}
    >
      <motion.article
        aria-labelledby={`project-${project.id}`}
        className="project-motion-card"
        style={{ rotateX, rotateY }}
        whileHover={reduce ? undefined : { scale: 1.012 }}
        onPointerMove={(event) => {
          if (reduce || event.pointerType !== "mouse") return;
          // Update springs rather than React state to keep pointer-driven tilt inexpensive.
          const box = event.currentTarget.getBoundingClientRect();
          x.set(((event.clientX - box.left) / box.width - 0.5) * 5);
          y.set(-((event.clientY - box.top) / box.height - 0.5) * 5);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <GlassCard className="project-card">
          <button
            type="button"
            className="project-details-trigger"
            aria-label={"Read about " + project.title}
            aria-haspopup="dialog"
            onClick={() => {
              x.set(0);
              y.set(0);
              onOpen(project);
            }}
          />
          <ProjectPreview project={project} />
          <div className="project-card-content">
            <div className="project-meta">
              <span>{project.category}</span>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 id={`project-${project.id}`}>{project.title}</h3>
            <p className="project-role">{project.role}</p>
            <span className="project-read-more">
              Explore project <ArrowUpRight size={13} aria-hidden="true" />
            </span>
            <p className="project-description">{project.description}</p>
            {project.features.length > 0 && (
              <ul className="project-features">
                {project.features.map((feature) => (
                  <li key={feature}>
                    <Check size={12} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <ul
              className="project-technologies"
              aria-label="Project technologies"
            >
              {project.technologies.map((technology, badgeIndex) => (
                <li
                  key={technology}
                  style={{ transitionDelay: `${badgeIndex * 25}ms` }}
                >
                  {technology}
                </li>
              ))}
            </ul>
            <div className="project-actions">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github size={15} />
                  GitHub
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="project-link"
                  title="GitHub link has not been added"
                >
                  <Github size={15} />
                  GitHub
                </button>
              )}
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link project-demo"
                  aria-label={`Open ${project.title} live demo`}
                >
                  Live demo
                  <ArrowUpRight size={16} />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="project-link project-demo"
                  title="Live demo link has not been added"
                >
                  Live demo
                  <ArrowUpRight size={16} />
                </button>
              )}
            </div>
            {(!project.githubUrl || !project.demoUrl) && (
              <p className="project-links-note">
                {!project.githubUrl && !project.demoUrl
                  ? "Project links coming soon."
                  : !project.githubUrl
                    ? "GitHub link coming soon."
                    : "Live demo coming soon."}
              </p>
            )}
          </div>
        </GlassCard>
      </motion.article>
    </div>
  );
}
