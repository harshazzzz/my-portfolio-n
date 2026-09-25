import type { Metadata } from "next";
import LoginCard from "@/components/auth/LoginCard";
import RecoveryForm from "@/components/auth/RecoveryForm";
import styles from "@/components/auth/auth.module.css";
export const metadata: Metadata = {
  title: "Forgot password? | Harsha Portfolio",
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
          <h1>Forgot password?</h1>
          <p className={styles.intro}>
            Enter the email address registered to your admin account.
          </p>
          <div className={styles.divider} />
          <RecoveryForm reset={false} />
        </LoginCard>
      </div>
    </main>
  );
}
