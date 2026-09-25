import type { InboxMessage } from "@/services/message.service";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { AUTH_COOKIE, backendFetch } from "@/lib/auth/backend";
import type { CmsBlog } from "@/services/blog.service";
import type { CmsProject } from "@/services/project.service";
import { skillCategories } from "@/data/skills";
import DashboardCard from "@/components/admin/DashboardCard";
import RecentActivity from "@/components/admin/RecentActivity";
import styles from "@/components/admin/dashboard.module.css";
export default async function DashboardPage() {
  const { user } = await requireAdmin();
  let blogs: CmsBlog[] = [];
  let blogsAvailable = false;
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    const result = await backendFetch("/blogs/admin/all", {
      headers: { Authorization: "Bearer " + token },
    });
    if (result.ok) {
      blogs = (await result.json()) as CmsBlog[];
      blogsAvailable = true;
    }
  } catch {}
  let projects: CmsProject[] = [];
  let projectsAvailable = false;
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    const result = await backendFetch("/projects/admin/all", {
      headers: { Authorization: "Bearer " + token },
    });
    if (result.ok) {
      projects = (await result.json()) as CmsProject[];
      projectsAvailable = true;
    }
  } catch {}
  let messages: InboxMessage[] = [];
  let messagesAvailable = false;
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    const response = await backendFetch("/messages", {
      headers: { Authorization: "Bearer " + token },
    });
    if (response.ok) {
      messages = (await response.json()) as InboxMessage[];
      messagesAvailable = true;
    }
  } catch {}
  const skills = new Set(
    skillCategories.flatMap((category) => [...category.items]),
  );
  return (
    <div className={styles.dashboard}>
      <section className={styles.welcome}>
        <div>
          <span className={styles.kicker}>
            <span className={styles.dot} /> YOUR CREATIVE WORKSPACE
          </span>
          <h1>
            Welcome Harsha <span aria-hidden>??</span>
          </h1>
          <p>A clear view of your work, your writing, and what comes next.</p>
        </div>
        <Link href="/" className={styles.viewSite}>
          View portfolio <ArrowUpRight size={16} aria-hidden />
        </Link>
      </section>
      <div className={styles.status}>
        <ShieldCheck size={15} aria-hidden />
        <span>Authentication successful. Signed in as {user.email}</span>
        <span className={styles.role}>{user.role}</span>
      </div>
      <div className={styles.stats}>
        <DashboardCard
          kind="blogs"
          title="Total Blogs"
          value={blogsAvailable ? blogs.length : "Unavailable"}
          detail={
            blogsAvailable
              ? blogs.filter((p) => p.status === "DRAFT").length + " drafts"
              : "Blog service unavailable"
          }
          href="/admin/blogs"
          index={0}
        />
        <DashboardCard
          kind="projects"
          title="Total Projects"
          value={projectsAvailable ? projects.length : "Unavailable"}
          detail={
            projectsAvailable
              ? projects.filter((p) => p.status === "PUBLISHED").length +
                " published projects"
              : "Project service unavailable"
          }
          href="/admin/projects"
          index={1}
        />
        <DashboardCard
          kind="skills"
          title="Total Skills"
          value={skills.size}
          detail={skillCategories.length + " technology categories"}
          href="/admin/skills"
          index={2}
        />
        <DashboardCard
          kind="messages"
          title="Messages"
          value={messagesAvailable ? messages.length : "Unavailable"}
          detail={
            messagesAvailable
              ? messages.filter((m) => m.status === "UNREAD").length +
                " unread messages"
              : "Inbox service unavailable"
          }
          href="/admin/messages"
          index={3}
        />
      </div>
      <div className={styles.lower}>
        {blogsAvailable ? (
          <RecentActivity blogs={blogs} />
        ) : (
          <p role="status">Recent articles unavailable.</p>
        )}
        <section className={styles.panel}>
          <span className={styles.kicker}>
            <Sparkles size={14} aria-hidden /> NEXT UP
          </span>
          <h2>Make room for your next idea.</h2>
          <p className={styles.muted}>
            Explore your admin workspace and review the content already featured
            on your portfolio.
          </p>
          <div className={styles.shortcuts}>
            <Link href="/admin/blogs">
              Blog workspace <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/projects">
              Project workspace <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/settings">
              Account settings <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className={styles.footnote}>
            Statistics reflect current CMS records and existing portfolio
            skills.
          </p>
        </section>
      </div>
    </div>
  );
}
