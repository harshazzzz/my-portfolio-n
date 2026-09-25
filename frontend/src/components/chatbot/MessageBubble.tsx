import styles from "./chatbot.module.css";
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}
export default function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={styles.bubble} data-role={message.role}>
      <span className={styles.speaker}>
        {message.role === "user" ? "You" : "Harsha's Assistant"}
      </span>
      <p>{message.text}</p>
    </div>
  );
}
