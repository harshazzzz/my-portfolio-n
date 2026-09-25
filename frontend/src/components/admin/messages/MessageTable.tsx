"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
  type InboxMessage,
} from "@/services/message.service";
import MessageCard, { MessageActions } from "./MessageCard";
import MessageDetail from "./MessageDetail";
import styles from "../blogs.module.css";
import layout from "./messages.module.css";
export default function MessageTable() {
  const router = useRouter();
  const [messages, setMessages] = useState<InboxMessage[]>([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("ALL"),
    [selected, setSelected] = useState<InboxMessage | null>(null);
  useEffect(() => {
    let active = true;
    getMessages()
      .then((data) => {
        if (active) setMessages(data);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Unable to load messages.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Request failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const view = (m: InboxMessage) => {
    void run(async () => {
      setSelected(await getMessage(m.id));
    });
  };
  const read = (m: InboxMessage) => {
    void run(async () => {
      const updated = await markAsRead(m.id);
      setMessages((old) =>
        old.map((item) => (item.id === m.id ? updated : item)),
      );
      setSelected((old) => (old?.id === m.id ? updated : old));
      router.refresh();
    });
  };
  const remove = (m: InboxMessage) => {
    if (!window.confirm("Permanently delete message: " + m.subject + "?"))
      return;
    void run(async () => {
      await deleteMessage(m.id);
      setMessages((old) => old.filter((item) => item.id !== m.id));
      setSelected((old) => (old?.id === m.id ? null : old));
      router.refresh();
    });
  };
  const filtered = messages.filter(
    (m) =>
      (status === "ALL" || m.status === status) &&
      [m.name, m.email, m.subject, m.message]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>CONVERSATIONS START HERE</span>
          <h1>Messages</h1>
          <p>
            {messages.filter((m) => m.status === "UNREAD").length} unread /{" "}
            {messages.length} total
          </p>
        </div>
        <button
          disabled={busy || loading}
          onClick={() => {
            void run(async () => {
              setMessages(await getMessages());
              router.refresh();
            });
          }}
        >
          Refresh inbox
        </button>
      </div>
      <div className={styles.filters}>
        <label>
          Search
          <input
            type="search"
            placeholder="Name, email, subject, or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All messages</option>
            <option value="UNREAD">Unread</option>
            <option value="READ">Read</option>
          </select>
        </label>
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {busy && <p role="status">Updating inbox...</p>}
      {loading ? (
        <p role="status">Loading messages...</p>
      ) : (
        <>
          <div className={layout.desktop}>
            <div className={styles.tableWrap}>
              <table>
                <caption className={styles.caption}>
                  {filtered.length} messages
                </caption>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong>{m.name}</strong>
                        <small>{m.email}</small>
                      </td>
                      <td>{m.subject}</td>
                      <td>
                        <span
                          className={styles.badge}
                          data-status={
                            m.status === "UNREAD" ? "PUBLISHED" : "DRAFT"
                          }
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <time dateTime={m.createdAt}>
                          {new Date(m.createdAt).toLocaleDateString()}
                        </time>
                      </td>
                      <td>
                        <MessageActions
                          message={m}
                          busy={busy}
                          onView={view}
                          onRead={read}
                          onDelete={remove}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={layout.mobile}>
            {filtered.map((m) => (
              <MessageCard
                key={m.id}
                message={m}
                busy={busy}
                onView={view}
                onRead={read}
                onDelete={remove}
              />
            ))}
          </div>
          {!filtered.length && !error && (
            <p className={styles.empty}>
              {messages.length
                ? "No messages match your filters."
                : "Your inbox is clear. New contact submissions will appear here."}
            </p>
          )}
        </>
      )}
      <MessageDetail
        error={error}
        message={selected}
        busy={busy}
        onClose={() => setSelected(null)}
        onRead={read}
        onDelete={remove}
      />
    </section>
  );
}
