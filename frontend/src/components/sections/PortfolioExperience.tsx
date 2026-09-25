"use client";
import { useEffect, useState, type ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Blog from "@/components/sections/Blog";
import type { Project } from "@/data/projects";
import type { BlogPost } from "@/data/blogs";
import Dialog from "@/components/ui/Dialog";
import type { Section } from "@/data/portfolio";
export default function PortfolioExperience({
  blogPosts,
  projects,
  contact,
  footer,
}: {
  blogPosts: readonly BlogPost[];
  projects: readonly Project[];
  contact: ReactNode;
  footer: ReactNode;
}) {
  const [active, setActive] = useState<Section>("Home");
  const [panel, setPanel] = useState<string | null>(null);
  useEffect(() => {
    // Track the section crossing the upper third of the viewport for keyboard,
    // anchor, and manual scrolling alike.
    const sectionNames: Record<string, Section> = {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      blog: "Blog",
      contact: "Contact",
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(sectionNames[entry.target.id] ?? "Home");
        }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    for (const id of Object.keys(sectionNames)) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);
  function navigate(section: Section) {
    const target = document.getElementById(section.toLowerCase());
    if (target) {
      setActive(section);
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    } else setPanel(section);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar
        active={active}
        onNavigate={navigate}
        onAssistant={() =>
          window.dispatchEvent(new Event("harsha:open-assistant"))
        }
      />
      <main id="main">
        <Hero
          onProjects={() => navigate("Projects")}
          onUnavailable={setPanel}
        />
        <About />
        <Skills />
        <Projects projects={projects} onBlog={() => navigate("Blog")} />
        <Experience />
        <Education />
        <Blog posts={blogPosts} />
        {contact}
      </main>
      {footer}
      <Dialog
        open={panel !== null}
        onClose={() => setPanel(null)}
        title={panel ?? "Portfolio"}
      >
        <p>
          {panel === "Download CV"
            ? "Harshana's CV is not available for download yet. Check back soon."
            : ["GitHub", "LinkedIn", "Email"].includes(panel ?? "")
              ? `${panel} details haven't been published yet. Check back soon.`
              : `The ${panel?.toLowerCase()} section is being prepared. Check back soon to explore more of Harshana's work.`}
        </p>
      </Dialog>
    </>
  );
}
