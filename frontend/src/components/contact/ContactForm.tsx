"use client";
import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LoaderCircle, CheckCircle2 } from "lucide-react";
import { sendMessage } from "@/services/message.service";
import authStyles from "@/components/auth/auth.module.css";
import styles from "@/components/admin/blogs.module.css";
import contactStyles from "./contact.module.css";
export default function ContactForm() {
  const reduced = useReducedMotion();
  const lock = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [sent, setSent] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setSent(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await sendMessage({
        name: String(data.get("name")),
        email: String(data.get("email")),
        subject: String(data.get("subject")),
        message: String(data.get("message")),
      });
      form.reset();
      setSent(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to send your message. Please try again.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.page} ${contactStyles.formTheme}`}
    >
      <form id="contact-form" onSubmit={submit} className={styles.form}>
        <fieldset disabled={busy}>
          <div className={styles.two}>
            <label htmlFor="contact-name">
              Name
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                placeholder="Your name"
              />
            </label>
            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="you@example.com"
              />
            </label>
          </div>
          <label htmlFor="contact-subject">
            Subject
            <input
              id="contact-subject"
              name="subject"
              maxLength={160}
              required
              placeholder="What would you like to build?"
            />
          </label>
          <label htmlFor="contact-message">
            Message
            <textarea
              id="contact-message"
              name="message"
              maxLength={10000}
              rows={8}
              required
              placeholder="Tell me about your idea, project, or opportunity."
            />
          </label>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          {sent && (
            <p role="status">
              <CheckCircle2 size={18} aria-hidden /> Your message has been
              received. Thank you for reaching out!
            </p>
          )}
          <button
            type="submit"
            className={styles.primary}
            disabled={busy}
            aria-busy={busy}
          >
            {busy ? (
              <LoaderCircle
                className={authStyles.spinner}
                size={17}
                aria-hidden
              />
            ) : (
              <ArrowUpRight size={17} aria-hidden />
            )}
            {busy ? "Sending..." : "Send Message"}
          </button>
          <small>
            Your details are stored privately in my inbox so I can respond.
            Please do not include passwords or sensitive information.
          </small>
        </fieldset>
      </form>
    </motion.div>
  );
}
