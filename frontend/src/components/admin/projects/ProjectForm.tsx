"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  getAdminProjects,
  createProject,
  updateProject,
  type ProjectInput,
} from "@/services/project.service";
import styles from "../blogs.module.css";
import layout from "./projects.module.css";
const empty: ProjectInput = {
  title: "",
  slug: "",
  category: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  images: [],
  technologies: [],
  githubUrl: "",
  liveUrl: "",
  featured: false,
  status: "DRAFT",
  role: "",
  features: [],
  benefits: [],
};
export default function ProjectForm({ id }: { id?: string }) {
  const router = useRouter(),
    reduced = useReducedMotion();
  const [form, setForm] = useState<ProjectInput>(empty),
    [technologies, setTechnologies] = useState(""),
    [images, setImages] = useState(""),
    [features, setFeatures] = useState(""),
    [benefits, setBenefits] = useState(""),
    [loading, setLoading] = useState(Boolean(id)),
    [failed, setFailed] = useState(false),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    let active = true;
    getAdminProjects()
      .then((data) => {
        const p = data.find((p) => p.id === id);
        if (!p) throw new Error("Project not found.");
        if (active) {
          setForm({
            title: p.title,
            slug: p.slug,
            category: p.category,
            shortDescription: p.shortDescription,
            description: p.description,
            coverImage: p.coverImage,
            images: p.images,
            technologies: p.technologies,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
            featured: p.featured,
            status: p.status,
            role: p.role,
            features: p.features,
            benefits: p.benefits,
          });
          setTechnologies(p.technologies.join(", "));
          setImages(p.images.join("\n"));
          setFeatures(p.features.join("\n"));
          setBenefits(p.benefits.join("\n"));
        }
      })
      .catch((e) => {
        if (active) {
          setFailed(true);
          setError(e instanceof Error ? e.message : "Unable to load project.");
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
  function field<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setDirty(true);
    setForm((old) => ({ ...old, [key]: value }));
  }
  const lines = (value: string) => [
    ...new Set(
      value
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = {
        ...form,
        technologies: [
          ...new Set(
            technologies
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        ],
        images: lines(images),
        features: lines(features),
        benefits: lines(benefits),
      };
      if (id) await updateProject(id, data);
      else await createProject(data);
      setDirty(false);
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save project.");
      setBusy(false);
    }
  }
  if (loading) return <p role="status">Loading project...</p>;
  if (failed)
    return (
      <div className={styles.page}>
        <p className={styles.error} role="alert">
          {error}
        </p>
        <Link href="/admin/projects">Back to projects</Link>
      </div>
    );
  return (
    <motion.section
      className={styles.page}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>YOUR NEXT GREAT BUILD</span>
          <h1>{id ? "Edit project" : "Add project"}</h1>
          <p>Save a private draft or publish to your portfolio.</p>
        </div>
      </div>
      <form className={styles.form} onSubmit={submit}>
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
                maxLength={100}
                value={form.category}
                onChange={(e) => field("category", e.target.value)}
              />
            </label>
            <label>
              Technologies
              <input
                value={technologies}
                onChange={(e) => {
                  setDirty(true);
                  setTechnologies(e.target.value);
                }}
                placeholder="React, Node.js, PostgreSQL"
              />
              <small>Comma-separated; up to 40 technologies.</small>
            </label>
          </div>
          <label>
            Short Description
            <textarea
              required
              maxLength={500}
              rows={3}
              value={form.shortDescription}
              onChange={(e) => field("shortDescription", e.target.value)}
            />
          </label>
          <label>
            Full Description
            <textarea
              required
              maxLength={20000}
              rows={10}
              value={form.description}
              onChange={(e) => field("description", e.target.value)}
            />
            <small>Plain text. HTML is displayed as text.</small>
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
              Optional HTTPS URL. Existing projects retain their animated
              previews when left empty.
            </small>
          </label>
          <label>
            Gallery Images
            <textarea
              rows={4}
              value={images}
              onChange={(e) => {
                setDirty(true);
                setImages(e.target.value);
              }}
              placeholder="One HTTPS image URL per line"
            />
            <small>
              Up to 20 URLs. Cloudinary upload can be connected later; no files
              are uploaded here.
            </small>
          </label>
          <div className={styles.two}>
            <label>
              GitHub URL
              <input
                type="url"
                maxLength={2048}
                value={form.githubUrl}
                onChange={(e) => field("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
              />
            </label>
            <label>
              Live Demo URL
              <input
                type="url"
                maxLength={2048}
                value={form.liveUrl}
                onChange={(e) => field("liveUrl", e.target.value)}
              />
            </label>
          </div>
          <details>
            <summary>Additional project details</summary>
            <div className={layout.extra}>
              <label>
                Your role
                <input
                  maxLength={120}
                  value={form.role}
                  onChange={(e) => field("role", e.target.value)}
                />
              </label>
              <label>
                Features
                <textarea
                  rows={4}
                  value={features}
                  onChange={(e) => {
                    setDirty(true);
                    setFeatures(e.target.value);
                  }}
                />
                <small>One feature per line.</small>
              </label>
              <label>
                Benefits
                <textarea
                  rows={4}
                  value={benefits}
                  onChange={(e) => {
                    setDirty(true);
                    setBenefits(e.target.value);
                  }}
                />
                <small>
                  One benefit per line. Existing project benefits are preserved.
                </small>
              </label>
            </div>
          </details>
          <label className={layout.checkbox}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => field("featured", e.target.checked)}
            />
            Featured project
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                field("status", e.target.value as ProjectInput["status"])
              }
            >
              <option value="DRAFT">Draft - admin only</option>
              <option value="PUBLISHED">
                Published - visible on portfolio
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
                  router.push("/admin/projects");
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
