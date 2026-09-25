import Link from "next/link";
import styles from "@/components/auth/auth.module.css";
export default function AdminHeader() {
  return (
    <header className={styles.adminHeader}>
      <Link
        href="/"
        className={styles.brand}
        aria-label="Harsha Portfolio home"
      >
        HK<span>.</span>
      </Link>
      <span className={styles.eyebrow}>ADMIN PANEL</span>
    </header>
  );
}
