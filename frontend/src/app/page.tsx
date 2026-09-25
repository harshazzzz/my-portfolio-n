import { site } from "@/lib/site";
import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import { getPublishedProjects } from "@/lib/projects";
import PortfolioExperience from "@/components/sections/PortfolioExperience";
import { getBlogPosts } from "@/lib/blogs";
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: site.url,
    title: site.title,
    description: site.description,
    type: "website",
    images: [
      { url: "/social-card.png", width: 1200, height: 630, alt: site.title },
    ],
  },
};
export default async function Home() {
  const [blogPosts, projects] = await Promise.all([
    getBlogPosts(),
    getPublishedProjects(),
  ]);
  return (
    <PortfolioExperience
      blogPosts={blogPosts}
      projects={projects}
      contact={<Contact key="contact" />}
      footer={<Footer key="footer" year={new Date().getFullYear()} />}
    />
  );
}
