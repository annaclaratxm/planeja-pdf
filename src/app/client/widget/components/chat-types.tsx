export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
  created_at?: string; 
}

export interface SessionData {
  id: string;
  title: string;
  created_at: string;
  conversations: { 
      prompt: string;
      response: string;
      created_at: string;
  }[];
}

export interface ChatMessageProps {
  role: MessageRole;
  content: string;
}