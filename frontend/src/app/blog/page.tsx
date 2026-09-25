import type { Metadata } from "next";
import Link from "next/link";
import Blog from "@/components/sections/Blog";
import { getBlogPosts } from "@/lib/blogs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog | Harsha Portfolio",
  description:
    "Software engineering notes and articles by Harshana Karunarathna.",
  alternates: { canonical: "/blog" },
};
export default async function BlogIndex() {
  return (
    <main>
      <nav className="article-navigation" style={{ padding: "32px 6vw" }}>
        <Link href="/">Back to portfolio</Link>
      </nav>
      <h1 className="sr-only">Developer blog</h1>
      <Blog posts={await getBlogPosts()} />
    </main>
  );
}
