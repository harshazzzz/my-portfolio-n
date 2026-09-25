import type { Metadata } from "next";
import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "@/components/auth/auth.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin | Harsha Portfolio",
  robots: { index: false, follow: false },
};
export default function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className={styles.adminPage}>
        <AdminHeader />
        <div className={styles.workspace}>
          <AdminSidebar />
          <main>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
