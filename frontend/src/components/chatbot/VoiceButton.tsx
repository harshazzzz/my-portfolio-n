"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import styles from "./chatbot.module.css";
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};
export default function VoiceButton({
  onTranscript,
  onError,
  disabled,
}: {
  onTranscript: (text: string) => void;
  onError: (text: string) => void;
  disabled: boolean;
}) {
  const recognition = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  useEffect(
    () => () => {
      const active = recognition.current;
      if (active) {
        active.onend = null;
        active.onresult = null;
        active.onerror = null;
        active.abort();
      }
    },
    [],
  );
  useEffect(() => {
    if (disabled) recognition.current?.abort();
  }, [disabled]);
  function toggle() {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const browser = window as SpeechWindow;
    const SpeechRecognition =
      browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError(
        "Voice input is not supported in this browser. You can still type your question.",
      );
      return;
    }
    window.speechSynthesis?.cancel();
    const active = new SpeechRecognition();
    recognition.current = active;
    active.lang = "en-US";
    active.continuous = false;
    active.interimResults = false;
    active.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript;
      if (text) onTranscript(text.slice(0, 1000));
    };
    active.onerror = (event) => {
      if (event.error !== "aborted")
        onError(
          event.error === "not-allowed" || event.error === "service-not-allowed"
            ? "Microphone access was denied. Allow microphone access in your browser, or type instead."
            : event.error === "no-speech"
              ? "No speech detected. Try again or type your question."
              : "Voice input is unavailable. Check your microphone and connection, or type instead.",
        );
      setListening(false);
    };
    active.onend = () => setListening(false);
    try {
      onError("");
      active.start();
      setListening(true);
    } catch {
      onError("Unable to start your microphone. Please try again.");
      setListening(false);
    }
  }
  return (
    <button
      type="button"
      className={styles.iconButton}
      data-listening={listening}
      onClick={toggle}
      disabled={disabled}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : "Start voice input"}
      title={listening ? "Stop listening" : "Voice input"}
    >
      {listening ? <Square size={17} /> : <Mic size={18} />}
    </button>
  );
}
