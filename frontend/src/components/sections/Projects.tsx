"use client";
import TextReveal from "@/components/animations/TextReveal";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, BookOpen } from "lucide-react";
import { Github } from "@/components/ui/SocialIcons";
import Dialog from "@/components/ui/Dialog";
import ScrollReveal from "@/components/animations/ScrollReveal";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/data/projects";

export default function Projects({
  onBlog,
  projects,
}: {
  onBlog: () => void;
  projects: readonly Project[];
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const reduce = useReducedMotion();
  return (
    <section
      id="projects"
      className="projects-section"
      aria-labelledby="projects-heading"
    >
      <div className="projects-section-top">
        <span className="eyebrow">03 / SELECTED WORK</span>
        <span>IDEAS, ENGINEERED INTO REALITY.</span>
      </div>
      <ScrollReveal className="projects-heading-block">
        <div>
          <span className="projects-overline">FROM CONCEPT TO CODE</span>
          <h2 id="projects-heading">
            <TextReveal text="Featured " onScroll />
            <span>
              <TextReveal text="Projects" onScroll />
            </span>
            <span className="projects-heading-dot">.</span>
          </h2>
        </div>
        <p>
          A selection of web, mobile, and IoT projects.
          <br />
          Different challenges. The same drive to build.
        </p>
      </ScrollReveal>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ScrollReveal
            key={project.id}
            className={project.featured ? "project-featured-slot" : undefined}
            direction={project.featured ? "up" : index % 2 ? "left" : "right"}
            delay={project.featured ? 0 : (index % 3) * 0.1}
          >
            <ProjectCard project={project} index={index} onOpen={setSelected} />
          </ScrollReveal>
        ))}
      </div>
      {!projects.length && (
        <p role="status">
          Projects will appear here when published. Please try again shortly if
          the service is unavailable.
        </p>
      )}
      <div className="projects-footnote">
        <span className="status-dot" />
        <span>Built to solve problems. Refined through learning.</span>
      </div>
      <div className="project-blog-notice">
        <BookOpen size={23} aria-hidden="true" />
        <div>
          <h3>More projects. More stories.</h3>
          <p>
            I will share my new projects and development updates in the Blog on
            this site.
          </p>
        </div>
        <button type="button" className="project-link" onClick={onBlog}>
          Visit Blog <ArrowUpRight size={16} />
        </button>
      </div>
      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Project details"}
      >
        {selected && (
          <motion.div
            key={selected.id}
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="project-detail-content"
          >
            <span className="project-detail-role">{selected.role}</span>
            <h3>About the project</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{selected.introduction}</p>
            <h3>Technologies used</h3>
            <ul className="project-technologies">
              {selected.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            {selected.benefits.length > 0 && <h3>Benefits</h3>}
            <ul className="project-detail-benefits">
              {selected.benefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={15} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            {selected.slug && (
              <a className="project-link" href={"/projects/" + selected.slug}>
                Full project details <ArrowUpRight size={16} />
              </a>
            )}
            <div className="project-actions">
              {selected.githubUrl && (
                <a
                  className="project-link"
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {selected.demoUrl && (
                <a
                  className="project-link project-demo"
                  href={selected.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo <ArrowUpRight size={16} />
                </a>
              )}
              {!selected.githubUrl && !selected.demoUrl && (
                <p>Project links will be added soon.</p>
              )}
            </div>
          </motion.div>
        )}
      </Dialog>
    </section>
  );
}
