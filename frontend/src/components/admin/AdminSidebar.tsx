"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";
import styles from "@/components/auth/auth.module.css";
export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.adminNav} aria-label="Admin navigation">
        {[
          "Dashboard",
          "Blogs",
          "Projects",
          "Skills",
          "Education",
          "Experience",
          "Messages",
          "Settings",
        ].map((label) => (
          <Link
            key={label}
            href={"/admin/" + label.toLowerCase()}
            aria-current={
              pathname === "/admin/" + label.toLowerCase() ? "page" : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <SignOutButton />
    </aside>
  );
}
