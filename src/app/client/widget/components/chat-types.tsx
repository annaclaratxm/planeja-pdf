export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatMessageProps {
  role: MessageRole;
  content: string;
}