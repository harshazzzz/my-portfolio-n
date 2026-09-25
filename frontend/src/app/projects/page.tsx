import type { Metadata } from "next";
import Link from "next/link";
import ProjectArchive from "@/components/sections/ProjectArchive";
import { getPublishedProjects } from "@/lib/projects";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Projects | Harsha Portfolio",
  description: "Explore web, mobile and IoT projects by Harshana Karunarathna.",
  alternates: { canonical: "/projects" },
};
export default async function ProjectIndex() {
  return (
    <main>
      <nav className="article-navigation" style={{ padding: "32px 6vw" }}>
        <Link href="/">Back to portfolio</Link>
      </nav>
      <h1 className="sr-only">Software projects</h1>
      <ProjectArchive projects={await getPublishedProjects()} />
    </main>
  );
}
