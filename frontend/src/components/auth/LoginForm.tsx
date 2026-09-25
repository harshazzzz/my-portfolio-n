"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import styles from "./auth.module.css";
export default function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await auth.login(String(data.get("email")), String(data.get("password")));
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className={styles.form}>
      <label htmlFor="email">
        Email
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          maxLength={254}
          required
          disabled={busy}
          placeholder="you@example.com"
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={72}
          required
          disabled={busy}
        />
      </label>
      <Link href="/admin/forgot-password" className={styles.recoveryLink}>
        Forgot password?
      </Link>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <button
        type="submit"
        className={styles.loginButton}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? (
          <LoaderCircle className={styles.spinner} size={18} aria-hidden />
        ) : (
          <ArrowRight size={18} aria-hidden />
        )}
        {busy ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
