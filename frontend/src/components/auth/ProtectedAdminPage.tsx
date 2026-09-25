import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import styles from "./auth.module.css";
export default async function ProtectedAdminPage({
  area,
}: {
  area:
    | "Dashboard"
    | "Blogs"
    | "Projects"
    | "Settings"
    | "Skills"
    | "Education"
    | "Experience";
}) {
  const session = await requireAdmin();
  return (
    <section className={styles.protectedCard}>
      <span className={styles.eyebrow}>
        <ShieldCheck size={15} /> AUTHORIZED ACCESS
      </span>
      <h1>{area === "Dashboard" ? "Welcome Harsha" : area}</h1>
      <p>
        Signed in as <strong>{session.user?.email}</strong>.
      </p>
      <p>
        {area === "Dashboard"
          ? "Authentication successful."
          : `This protected ${area.toLowerCase()} area is ready for future CMS features.`}
      </p>
      <span className={styles.notice}>
        Authentication is enabled. Content management is not implemented yet.
      </span>
    </section>
  );
}
