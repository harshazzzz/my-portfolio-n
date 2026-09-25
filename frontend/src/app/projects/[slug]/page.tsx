import type { Metadata } from "next";
import Image from "next/image";
import { shouldBypassImageOptimization } from "@/lib/images";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProject } from "@/lib/projects";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  return project
    ? {
        title: project.title + " | Harsha Portfolio",
        description: project.description,
        alternates: {
          canonical: "/projects/" + encodeURIComponent(slug),
        },
      }
    : { title: "Project not found" };
}
export default async function ProjectPage({ params }: Props) {
  const project = await getPublishedProject((await params).slug);
  if (!project) notFound();
  return (
    <main className="blog-article">
      <nav className="article-navigation">
        <Link href="/#projects">Back to projects</Link>
        <Link href="/" className="logo">
          HK<span>.</span>
        </Link>
      </nav>
      <header className="article-header">
        <span className="eyebrow">{project.category}</span>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        {project.role && <span>{project.role}</span>}
      </header>
      {project.image && (
        <Image
          src={project.image}
          unoptimized={shouldBypassImageOptimization(project.image)}
          alt={project.title + " cover"}
          width={1000}
          height={600}
          className="article-cover"
          sizes="(max-width:900px) 100vw, 850px"
        />
      )}
      <article className="article-prose">
        <h2>About the project</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{project.introduction}</p>
        <h2>Technologies</h2>
        <ul className="blog-tags">
          {project.technologies.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {project.features.length > 0 && (
          <section>
            <h2>Features</h2>
            <ul>
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        )}
        {project.benefits.length > 0 && (
          <section>
            <h2>Benefits</h2>
            <ul>
              {project.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        )}
        {Boolean(project.images?.length) && (
          <section>
            <h2>Gallery</h2>
            {project.images?.map((url, index) => (
              <Image
                key={url}
                src={url}
                unoptimized={shouldBypassImageOptimization(url)}
                alt={project.title + " screenshot " + (index + 1)}
                width={1000}
                height={650}
                sizes="(max-width:900px) 100vw, 850px"
                className="article-cover"
              />
            ))}
          </section>
        )}
        <div className="project-actions">
          {project.githubUrl && (
            <a
              className="project-link"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              className="project-link"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
