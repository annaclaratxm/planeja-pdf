"use client";
import { Bot, User } from "lucide-react";
import { ChatMessageProps } from "./chat-types";

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "assistant" && (
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <Bot className="h-4 w-4 text-emerald-600" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <p className="text-sm">
          {content}
        </p>
      </div>

      {role === "user" && (
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
};
