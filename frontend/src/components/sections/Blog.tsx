import TextReveal from "@/components/animations/TextReveal";
import ScrollReveal from "@/components/animations/ScrollReveal";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogPost } from "@/data/blogs";

export default function Blog({ posts }: { posts: readonly BlogPost[] }) {
  return (
    <section id="blog" className="blog-section" aria-labelledby="blog-heading">
      <div className="blog-section-top">
        <span className="eyebrow">06 / NOTES FROM THE JOURNEY</span>
        <span>BUILD. REFLECT. SHARE.</span>
      </div>
      <ScrollReveal className="blog-heading-block">
        <div>
          <span className="blog-overline">IDEAS WORTH WRITING DOWN</span>
          <h2 id="blog-heading">
            <TextReveal text="Latest " onScroll />
            <span>
              <TextReveal text="Articles" onScroll />
            </span>
            <span className="blog-heading-dot">.</span>
          </h2>
        </div>
        <p>
          Sharing my learning journey, software engineering experiences, and
          technical insights.
        </p>
      </ScrollReveal>
      {posts.length ? (
        <div className="blog-grid">
          {posts.map((post, index) => (
            <ScrollReveal key={post.id} delay={(index % 3) * 0.09}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="blog-empty">
          <h3>The next chapter is being written.</h3>
          <p>New articles and project updates will appear here soon.</p>
        </div>
      )}
      <p className="blog-closing">
        Small discoveries. Practical lessons. <span>A journey shared.</span>
      </p>
    </section>
  );
}
