"use client";
import { useRouter } from "next/navigation";
import Projects from "./Projects";
import type { Project } from "@/data/projects";
export default function ProjectArchive({
  projects,
}: {
  projects: readonly Project[];
}) {
  const router = useRouter();
  return <Projects projects={projects} onBlog={() => router.push("/blog")} />;
}
