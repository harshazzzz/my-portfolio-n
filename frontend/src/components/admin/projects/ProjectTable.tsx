"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdminProjects,
  deleteProject,
  type CmsProject,
} from "@/services/project.service";
import ProjectCard, { ProjectActions } from "./ProjectCard";
import styles from "../blogs.module.css";
import layout from "./projects.module.css";
export default function ProjectTable() {
  const [projects, setProjects] = useState<CmsProject[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("ALL"),
    [featured, setFeatured] = useState("ALL"),
    [status, setStatus] = useState("ALL"),
    [view, setView] = useState<"table" | "grid">("table"),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    getAdminProjects()
      .then((data) => {
        if (active) setProjects(data);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Unable to load projects.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function remove(project: CmsProject) {
    if (
      busy ||
      !window.confirm(
        "Permanently delete " + project.title + "? This cannot be undone.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await deleteProject(project.id);
      setProjects((old) => old.filter((p) => p.id !== project.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }
  const categories = [...new Set(projects.map((p) => p.category))].sort();
  const visible = projects.filter(
    (p) =>
      (category === "ALL" || p.category === category) &&
      (featured === "ALL" || p.featured === (featured === "YES")) &&
      (status === "ALL" || p.status === status) &&
      [p.title, p.slug, p.category, ...p.technologies]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>IDEAS, ENGINEERED INTO REALITY</span>
          <h1>Project workspace</h1>
          <p>Manage the work you share with the world.</p>
        </div>
        <Link href="/admin/projects/create" className={styles.primary}>
          + Add project
        </Link>
      </div>
      <div className={layout.filters}>
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Title, category, technology"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ALL">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Featured
          <select
            value={featured}
            onChange={(e) => setFeatured(e.target.value)}
          >
            <option value="ALL">All projects</option>
            <option value="YES">Featured</option>
            <option value="NO">Not featured</option>
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>
      <div className={layout.toolbar}>
        <span>{visible.length} projects</span>
        <div className={styles.actions}>
          <button
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            Table
          </button>
          <button
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
        </div>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}{" "}
          <button onClick={() => window.location.reload()}>Retry</button>
        </p>
      )}
      {loading ? (
        <p role="status">Loading projects...</p>
      ) : view === "grid" ? (
        <div className={layout.grid}>
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={remove} busy={busy} />
          ))}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <caption className={styles.caption}>Portfolio projects</caption>
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title}</strong>
                    <small>/{p.slug}</small>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <span className={styles.badge} data-status={p.status}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.featured ? "Yes" : "No"}</td>
                  <td>
                    <ProjectActions project={p} onDelete={remove} busy={busy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && !visible.length && (
        <p className={styles.empty}>
          {projects.length
            ? "No projects match these filters."
            : "Create your first project to get started."}
        </p>
      )}
    </section>
  );
}
