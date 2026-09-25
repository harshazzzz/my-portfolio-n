"use client";
import { motion, useReducedMotion } from "framer-motion";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAdminBlogs,
  deleteBlog,
  type CmsBlog,
} from "@/services/blog.service";
import styles from "./blogs.module.css";
export default function BlogManager() {
  const reduced = useReducedMotion();
  const [blogs, setBlogs] = useState<CmsBlog[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("ALL"),
    [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    getAdminBlogs()
      .then((data) => {
        if (active) setBlogs(data);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Could not load blogs.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function remove(blog: CmsBlog) {
    if (
      !window.confirm(
        "Permanently delete: " + blog.title + "? This cannot be undone.",
      )
    )
      return;
    setDeleting(blog.id);
    setError("");
    try {
      await deleteBlog(blog.id);
      setBlogs((old) => old.filter((b) => b.id !== blog.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }
  const filtered = blogs.filter(
    (b) =>
      (status === "ALL" || b.status === status) &&
      [b.title, b.category, b.slug, ...b.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <motion.section
      className={styles.page}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>YOUR IDEAS, PUBLISHED</span>
          <h1>Blog workspace</h1>
          <p>Create, refine, and share your learning journey.</p>
        </div>
        <Link className={styles.primary} href="/admin/blogs/create">
          + Create article
        </Link>
      </div>
      <div className={styles.filters}>
        <label>
          Search
          <input
            type="search"
            placeholder="Title, category, or tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
      {error && (
        <p role="alert" className={styles.error}>
          {error}{" "}
          <button onClick={() => window.location.reload()}>Retry</button>
        </p>
      )}
      {loading ? (
        <p role="status">Loading articles...</p>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <caption className={styles.caption}>
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </caption>
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog) => (
                <tr key={blog.id}>
                  <td>
                    <strong>{blog.title}</strong>
                    <small>/{blog.slug}</small>
                  </td>
                  <td>{blog.category}</td>
                  <td>
                    <span className={styles.badge} data-status={blog.status}>
                      {blog.status}
                    </span>
                  </td>
                  <td>{new Date(blog.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={"/admin/blogs/" + blog.id + "/edit"}
                        aria-label={"Edit " + blog.title}
                      >
                        Edit
                      </Link>
                      {blog.status === "PUBLISHED" && (
                        <Link href={"/blog/" + blog.slug}>View</Link>
                      )}
                      <button
                        disabled={deleting !== null}
                        onClick={() => remove(blog)}
                        aria-label={"Delete " + blog.title}
                      >
                        {deleting === blog.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && !error && (
            <p className={styles.empty}>
              {blogs.length
                ? "No articles match your filters."
                : "Your next article starts here. Create your first draft."}
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}
