"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { InboxMessage } from "@/services/message.service";
import styles from "../blogs.module.css";
import cards from "../projects/projects.module.css";
export function MessageActions({
  message,
  busy,
  onView,
  onRead,
  onDelete,
}: {
  message: InboxMessage;
  busy: boolean;
  onView: (m: InboxMessage) => void;
  onRead: (m: InboxMessage) => void;
  onDelete: (m: InboxMessage) => void;
}) {
  return (
    <div className={styles.actions}>
      <button
        disabled={busy}
        onClick={() => onView(message)}
        aria-label={"View " + message.subject}
      >
        View
      </button>
      {message.status === "UNREAD" && (
        <button
          disabled={busy}
          onClick={() => onRead(message)}
          aria-label={"Mark " + message.subject + " as read"}
        >
          Mark as read
        </button>
      )}
      <button
        disabled={busy}
        onClick={() => onDelete(message)}
        aria-label={"Delete " + message.subject}
      >
        Delete
      </button>
    </div>
  );
}
export default function MessageCard(
  props: Parameters<typeof MessageActions>[0],
) {
  const reduced = useReducedMotion();
  const { message } = props;
  return (
    <motion.article
      className={cards.card}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span
        className={styles.badge}
        data-status={message.status === "UNREAD" ? "PUBLISHED" : "DRAFT"}
      >
        {message.status}
      </span>
      <h2>{message.subject}</h2>
      <p>
        {message.name}
        <br />
        {message.email}
        <br />
        <time dateTime={message.createdAt}>
          {new Date(message.createdAt).toLocaleString()}
        </time>
      </p>
      <MessageActions {...props} />
    </motion.article>
  );
}
