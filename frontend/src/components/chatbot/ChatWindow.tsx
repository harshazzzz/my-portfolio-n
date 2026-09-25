"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, Send, Volume2, VolumeX, LoaderCircle } from "lucide-react";
import { aiKnowledge } from "@/data/aiKnowledge";
import { sendChatMessage } from "@/services/chatbot.service";
import AIAvatar from "./AIAvatar";
import MessageBubble, { type ChatMessage } from "./MessageBubble";
import VoiceButton from "./VoiceButton";
import styles from "./chatbot.module.css";
export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null),
    input = useRef<HTMLInputElement>(null),
    log = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null),
    lock = useRef(false),
    alive = useRef(true),
    speakEnabled = useRef(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: aiKnowledge.greeting },
  ]);
  const [draft, setDraft] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [voice, setVoice] = useState(false);
  useEffect(() => {
    alive.current = true;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      alive.current = false;
      request.current?.abort();
      window.speechSynthesis?.cancel();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    log.current?.scrollTo({
      top: log.current.scrollHeight,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [messages, busy, reduced]);
  function toggleVoice() {
    if (!("speechSynthesis" in window)) {
      setError(
        "Speech playback is not supported in this browser. Text chat is available.",
      );
      return;
    }
    const enabled = !voice;
    setVoice(enabled);
    speakEnabled.current = enabled;
    if (!enabled) window.speechSynthesis.cancel();
  }
  async function send(text: string) {
    const message = text.trim();
    if (!message || lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setDraft("");
    setMessages((items) => [
      ...items,
      { id: crypto.randomUUID(), role: "user", text: message },
    ]);
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const result = await sendChatMessage(message, controller.signal);
      if (!alive.current) return;
      setMessages((items) => [
        ...items,
        { id: crypto.randomUUID(), role: "assistant", text: result.answer },
      ]);
      if (speakEnabled.current && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(result.answer);
        utterance.lang = "en-US";
        utterance.onerror = (event) => {
          if (
            alive.current &&
            event.error !== "canceled" &&
            event.error !== "interrupted"
          )
            setError(
              "Voice playback is unavailable. You can read the answer above.",
            );
        };
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      if (alive.current) {
        setError(
          controller.signal.aborted
            ? "The request timed out. Please try again."
            : e instanceof Error
              ? e.message
              : "Unable to reach the assistant. Please try again.",
        );
        setDraft(message);
      }
    } finally {
      window.clearTimeout(timeout);
      lock.current = false;
      if (alive.current) {
        setBusy(false);
        input.current?.focus();
      }
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }
  return (
    <dialog
      id="harsha-ai-chat"
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="ai-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className={styles.window}
        initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <header className={styles.header}>
          <AIAvatar />
          <div>
            <h2 id="ai-title">Harsha&apos;s Assistant</h2>
            <p>Portfolio knowledge assistant</p>
          </div>
          <button
            className={styles.iconButton}
            onClick={onClose}
            aria-label="Close assistant"
          >
            <X size={20} />
          </button>
        </header>
        <div className={styles.notice}>
          Curated portfolio answers &middot; No live AI provider connected
        </div>
        <div
          className={styles.messages}
          ref={log}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Conversation"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {busy && (
            <p className={styles.thinking}>
              <LoaderCircle size={15} /> Finding an answer...
            </p>
          )}
        </div>
        <div className={styles.suggestions}>
          {aiKnowledge.suggestions.map((question) => (
            <button
              key={question}
              disabled={busy}
              onClick={() => void send(question)}
            >
              {question}
            </button>
          ))}
        </div>
        <form className={styles.composer} onSubmit={submit}>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <div className={styles.inputRow}>
            <label className={styles.srOnly} htmlFor="ai-question">
              Your question
            </label>
            <input
              ref={input}
              id="ai-question"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={1000}
              placeholder="Ask about Harshana..."
              autoComplete="off"
              disabled={busy}
            />
            <VoiceButton
              disabled={busy}
              onTranscript={(text) => {
                setDraft(text);
                input.current?.focus();
              }}
              onError={setError}
            />
            <button
              className={styles.send}
              type="submit"
              disabled={busy || !draft.trim()}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>
          <div className={styles.tools}>
            <button type="button" onClick={toggleVoice} aria-pressed={voice}>
              {voice ? <Volume2 size={14} /> : <VolumeX size={14} />} Voice
              replies {voice ? "on" : "off"}
            </button>
            <span>{draft.length}/1000</span>
          </div>
          <p className={styles.privacy}>
            Voice input may use your browser&apos;s speech service. Review the text
            before sending. Avoid sharing sensitive information.
          </p>
        </form>
      </motion.div>
    </dialog>
  );
}
