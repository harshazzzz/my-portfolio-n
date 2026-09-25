import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck, LockKeyhole } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import LoginCard from "@/components/auth/LoginCard";
import { getAdminSession } from "@/lib/auth/session";
import styles from "@/components/auth/auth.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Access | Harsha Portfolio",
  robots: { index: false, follow: false },
};
export default async function AdminLogin() {
  if (await getAdminSession()) redirect("/admin/dashboard");
  return (
    <main className={`${styles.loginPage} ${styles.adminLoginPage}`}>
      <div className={styles.ambient} aria-hidden />
      <Link className={styles.backLink} href="/">
        <ArrowLeft size={15} /> Back to portfolio
      </Link>
      <div className={styles.loginCenter}>
        <LoginCard>
          <div className={styles.logo} aria-hidden>
            HK<span>.</span>
          </div>
          <span className={styles.eyebrow}>
            <ShieldCheck size={13} /> PRIVATE WORKSPACE
          </span>
          <h1>Admin Access</h1>
          <p className={styles.intro}>
            Your ideas. Your stories. Your workspace.
            <br />
            Sign in securely to manage your portfolio.
          </p>
          <div className={styles.divider} />
          <LoginForm />
          <p className={styles.securityNote}>
            <LockKeyhole size={13} aria-hidden /> Access is restricted to
            authorized administrators.
          </p>
          <span className={styles.footer}>HARSHA PORTFOLIO / ADMIN</span>
        </LoginCard>
        <p className={styles.bottomNote}>
          A private space for the next chapter.
        </p>
      </div>
    </main>
  );
}
