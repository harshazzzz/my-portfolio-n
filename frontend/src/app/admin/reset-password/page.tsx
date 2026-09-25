import type { Metadata } from "next";
import LoginCard from "@/components/auth/LoginCard";
import RecoveryForm from "@/components/auth/RecoveryForm";
import styles from "@/components/auth/auth.module.css";
export const metadata: Metadata = {
  title: "Choose a new password | Harsha Portfolio",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function Page() {
  return (
    <main className={styles.loginPage + " " + styles.adminLoginPage}>
      <div className={styles.ambient} aria-hidden />
      <div className={styles.loginCenter}>
        <LoginCard>
          <div className={styles.logo}>
            HK<span>.</span>
          </div>
          <h1>Choose a new password</h1>
          <p className={styles.intro}>
            Reset links expire after 15 minutes and can only be used once.
          </p>
          <div className={styles.divider} />
          <RecoveryForm reset={true} />
        </LoginCard>
      </div>
    </main>
  );
}
