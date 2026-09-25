"use client";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
export default function SignOutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div>
      <button
        type="button"
        className={styles.secondaryButton}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(false);
          try {
            await logout();
            router.replace("/admin/login");
            router.refresh();
          } catch {
            setError(true);
            setBusy(false);
          }
        }}
      >
        {busy ? "Signing out..." : "Sign out"}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          Sign-out failed. Please try again.
        </p>
      )}
    </div>
  );
}
