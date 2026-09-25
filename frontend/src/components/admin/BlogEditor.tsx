"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  getAdminBlogs,
  createBlog,
  updateBlog,
  type BlogInput,
} from "@/services/blog.service";
import styles from "./blogs.module.css";
const empty: BlogInput = {
  title: "",
  slug: "",
  category: "",
  tags: [],
  excerpt: "",
  content: "",
  coverImage: "",
  status: "DRAFT",
};
export default function BlogEditor({ id }: { id?: string }) {
  const router = useRouter(),
    reduced = useReducedMotion();
  const [form, setForm] = useState<BlogInput>(empty),
    [tags, setTags] = useState(""),
    [loading, setLoading] = useState(Boolean(id)),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [loadError, setLoadError] = useState(false),
    [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!id) return;
    let active = true;
    getAdminBlogs()
      .then((data) => {
        const blog = data.find((b) => b.id === id);
        if (!blog) throw new Error("Article not found.");
        if (active) {
          setForm({
            title: blog.title,
            slug: blog.slug,
            category: blog.category,
            tags: blog.tags,
            excerpt: blog.excerpt,
            content: blog.content,
            coverImage: blog.coverImage,
            status: blog.status,
          });
          setTags(blog.tags.join(", "));
        }
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : "Unable to load article.");
          setLoadError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function field(key: keyof BlogInput, value: string) {
    setDirty(true);
    setForm((old) => ({ ...old, [key]: value }));
  }
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = {
        ...form,
        tags: [
          ...new Set(
            tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        ],
      };
      if (id) await updateBlog(id, data);
      else await createBlog(data);
      setDirty(false);
      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save article.");
      setBusy(false);
    }
  }
  if (loading) return <p role="status">Loading editor...</p>;
  if (loadError)
    return (
      <div className={styles.page}>
        <p role="alert" className={styles.error}>
          {error}
        </p>
        <Link href="/admin/blogs">Back to articles</Link>
      </div>
    );
  return (
    <motion.section
      className={styles.page}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>SHARE SOMETHING WORTH KNOWING</span>
          <h1>{id ? "Edit article" : "Create article"}</h1>
          <p>Save a private draft or publish it to your portfolio.</p>
        </div>
      </div>
      <form onSubmit={save} className={styles.form}>
        <fieldset disabled={busy}>
          <div className={styles.two}>
            <label>
              Title
              <input
                required
                maxLength={160}
                value={form.title}
                onChange={(e) => field("title", e.target.value)}
              />
            </label>
            <label>
              Slug
              <div className={styles.slug}>
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  maxLength={180}
                  title="Lowercase letters, numbers, and single hyphens"
                  value={form.slug}
                  onChange={(e) => field("slug", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    field(
                      "slug",
                      form.title
                        .toLowerCase()
                        .normalize("NFKD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, ""),
                    )
                  }
                >
                  Generate
                </button>
              </div>
            </label>
            <label>
              Category
              <input
                required
                maxLength={80}
                value={form.category}
                onChange={(e) => field("category", e.target.value)}
              />
            </label>
            <label>
              Tags
              <input
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setDirty(true);
                }}
                placeholder="Next.js, TypeScript, Learning"
              />
              <small>Comma-separated; up to 20 tags, 40 characters each.</small>
            </label>
          </div>
          <label>
            Excerpt
            <textarea
              required
              maxLength={500}
              rows={3}
              value={form.excerpt}
              onChange={(e) => field("excerpt", e.target.value)}
            />
          </label>
          <label>
            Content
            <textarea
              required
              maxLength={100000}
              rows={18}
              value={form.content}
              onChange={(e) => field("content", e.target.value)}
            />
            <small>
              Plain text. Separate paragraphs with a blank line. HTML is
              displayed as text.
            </small>
          </label>
          <label>
            Cover Image URL
            <input
              maxLength={2048}
              value={form.coverImage}
              onChange={(e) => field("coverImage", e.target.value)}
              placeholder="https://res.cloudinary.com/..."
            />
            <small>
              Optional HTTPS image URL. Leave empty to use the default cover.
              Cloudinary upload can be connected here later.
            </small>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => field("status", e.target.value)}
            >
              <option value="DRAFT">Draft - visible only to admins</option>
              <option value="PUBLISHED">
                Published - visible on your portfolio
              </option>
            </select>
          </label>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.actions}>
            <button className={styles.primary} type="submit" aria-busy={busy}>
              {busy
                ? "Saving..."
                : form.status === "PUBLISHED"
                  ? "Save & publish"
                  : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!dirty || window.confirm("Discard unsaved changes?")) {
                  setDirty(false);
                  router.push("/admin/blogs");
                }
              }}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </motion.section>
  );
}
