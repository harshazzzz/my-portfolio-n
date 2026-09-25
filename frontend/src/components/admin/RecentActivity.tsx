import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import type { CmsBlog } from "@/services/blog.service";
import styles from "./dashboard.module.css";
export default function RecentActivity({ blogs }: { blogs: CmsBlog[] }) {
  const recent = [...blogs]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  return (
    <section className={styles.panel} aria-labelledby="recent-title">
      <div className={styles.panelHeading}>
        <div>
          <span className={styles.kicker}>CONTENT OVERVIEW</span>
          <h2 id="recent-title">Recent activity</h2>
        </div>
        <span className={styles.pill}>Portfolio articles</span>
      </div>
      <p className={styles.muted}>
        Latest articles in your portfolio. This is a content overview, not an
        admin audit log.
      </p>
      <div className={styles.articleList}>
        {recent.map((post) => (
          <Link
            key={post.id}
            href={"/admin/blogs/" + post.id + "/edit"}
            className={styles.article}
          >
            <span className={styles.icon}>
              <FileText size={18} aria-hidden />
            </span>
            <div>
              <strong>{post.title}</strong>
              <span>
                {post.category} &middot;{" "}
                <time dateTime={post.updatedAt}>
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeZone: "UTC",
                  }).format(new Date(post.updatedAt))}
                </time>
                {post.status === "DRAFT" ? " / Draft" : " / Published"}
              </span>
            </div>
            <ArrowUpRight size={17} aria-hidden />
          </Link>
        ))}
      </div>
      {!recent.length && <p className={styles.muted}>No articles yet.</p>}
    </section>
  );
}
