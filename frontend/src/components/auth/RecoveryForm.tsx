"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import styles from "./auth.module.css";
export default function RecoveryForm({ reset = false }: { reset?: boolean }) {
  const initialized = useRef(false);
  const token = useRef(""),
    lock = useRef(false);
  const [ready, setReady] = useState(!reset),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  useEffect(() => {
    if (!reset || initialized.current) return;
    initialized.current = true;
    token.current =
      new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    window.history.replaceState(null, "", window.location.pathname);
    setReady(/^[a-f0-9]{64}$/.test(token.current));
  }, [reset]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const data = new FormData(event.currentTarget),
      password = String(data.get("password") ?? "");
    if (reset && password !== data.get("confirm")) {
      setError("Passwords do not match.");
      return;
    }
    if (reset && new TextEncoder().encode(password).length > 72) {
      setError("Password must be at most 72 UTF-8 bytes.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await api<{ message: string }>(
        "/auth/" + (reset ? "reset-password" : "forgot-password"),
        {
          method: "POST",
          body: JSON.stringify(
            reset
              ? { token: token.current, password }
              : { email: String(data.get("email")).trim().toLowerCase() },
          ),
        },
      );
      setSuccess(result.message);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to complete request. Try again.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      {success ? (
        <p className={styles.notice} role="status">
          {success}
        </p>
      ) : reset && !ready ? (
        <p className={styles.error}>
          Open a valid reset link from your email.{" "}
          <Link href="/admin/forgot-password">Request a new link</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className={styles.form}>
          {reset ? (
            <>
              <label htmlFor="new-password">
                New password
                <input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={72}
                  required
                  disabled={busy}
                />
              </label>
              <label htmlFor="confirm-password">
                Confirm password
                <input
                  id="confirm-password"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={72}
                  required
                  disabled={busy}
                />
              </label>
              <small>
                Use at least 12 characters (maximum 72 UTF-8 bytes).
              </small>
            </>
          ) : (
            <label htmlFor="recovery-email">
              Admin email
              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                disabled={busy}
              />
            </label>
          )}
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <button
            className={styles.loginButton}
            disabled={busy}
            aria-busy={busy}
          >
            {busy
              ? "Please wait..."
              : reset
                ? "Reset password"
                : "Send reset link"}
          </button>
        </form>
      )}
      <Link href="/admin/login" className={styles.recoveryLink}>
        Back to sign in
      </Link>
    </>
  );
}
