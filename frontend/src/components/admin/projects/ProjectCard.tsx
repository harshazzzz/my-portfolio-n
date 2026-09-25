"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { CmsProject } from "@/services/project.service";
import styles from "../blogs.module.css";
import layout from "./projects.module.css";
export function ProjectActions({
  project,
  onDelete,
  busy,
}: {
  project: CmsProject;
  onDelete: (project: CmsProject) => void;
  busy: boolean;
}) {
  return (
    <div className={styles.actions}>
      <Link
        href={"/admin/projects/" + project.id + "/edit"}
        aria-label={"Edit " + project.title}
      >
        Edit
      </Link>
      {project.status === "PUBLISHED" && (
        <Link href={"/projects/" + project.slug}>View</Link>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => onDelete(project)}
        aria-label={"Delete " + project.title}
      >
        Delete
      </button>
    </div>
  );
}
export default function ProjectCard({
  project,
  onDelete,
  busy,
}: {
  project: CmsProject;
  onDelete: (project: CmsProject) => void;
  busy: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className={layout.card}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4 }}
    >
      <div className={layout.cardTop}>
        <span className={styles.badge} data-status={project.status}>
          {project.status}
        </span>
        {project.featured && <span className={layout.featured}>Featured</span>}
      </div>
      <h2>{project.title}</h2>
      <span className={layout.category}>{project.category}</span>
      <p>{project.shortDescription}</p>
      <div className={layout.tags}>
        {project.technologies.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
      <ProjectActions project={project} onDelete={onDelete} busy={busy} />
    </motion.article>
  );
}
