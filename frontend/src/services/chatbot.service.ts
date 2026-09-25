import { api } from "@/lib/api";
export function sendChatMessage(message: string, signal?: AbortSignal) {
  return api<{ answer: string }>("/chatbot/message", {
    method: "POST",
    body: JSON.stringify({ message }),
    signal,
  });
}
