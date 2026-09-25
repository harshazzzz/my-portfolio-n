import { api } from "@/lib/api";
export type MessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
export type InboxMessage = MessageInput & {
  id: string;
  status: "UNREAD" | "READ";
  createdAt: string;
};
export const sendMessage = (data: MessageInput) =>
  api<{ success: boolean }>("/messages", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getMessages = () => api<InboxMessage[]>("/admin/messages");
export const getMessage = (id: string) =>
  api<InboxMessage>("/admin/messages/" + encodeURIComponent(id));
export const deleteMessage = (id: string) =>
  api<{ success: boolean }>("/admin/messages/" + encodeURIComponent(id), {
    method: "DELETE",
  });
export const markAsRead = (id: string) =>
  api<InboxMessage>("/admin/messages/" + encodeURIComponent(id) + "/read", {
    method: "PATCH",
  });
