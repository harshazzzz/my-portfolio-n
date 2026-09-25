"use client";
import Dialog from "@/components/ui/Dialog";
import type { InboxMessage } from "@/services/message.service";
import styles from "../blogs.module.css";
export default function MessageDetail({
  message,
  busy,
  error,
  onClose,
  onRead,
  onDelete,
}: {
  message: InboxMessage | null;
  busy: boolean;
  error: string;
  onClose: () => void;
  onRead: (m: InboxMessage) => void;
  onDelete: (m: InboxMessage) => void;
}) {
  return (
    <Dialog
      open={message !== null}
      onClose={onClose}
      title={message?.subject ?? "Message details"}
    >
      {message && (
        <div className={styles.page} style={{ overflowWrap: "anywhere" }}>
          <p>
            <strong>{message.name}</strong>
            <br />
            <a href={"mailto:" + encodeURIComponent(message.email)}>
              {message.email}
            </a>
          </p>
          <p>
            <time dateTime={message.createdAt}>
              {new Date(message.createdAt).toLocaleString()}
            </time>{" "}
            / {message.status}
          </p>
          <p
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              lineHeight: 1.9,
              margin: "24px 0",
            }}
          >
            {message.message}
          </p>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          {busy && <p role="status">Updating message...</p>}
          <div className={styles.actions}>
            {message.status === "UNREAD" && (
              <button disabled={busy} onClick={() => onRead(message)}>
                Mark as read
              </button>
            )}
            <button disabled={busy} onClick={() => onDelete(message)}>
              Delete message
            </button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
