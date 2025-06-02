"use client";
import 'github-markdown-css/github-markdown-dark.css';
import { Bot, User } from "lucide-react";
import Markdown from 'react-markdown';
import { ChatMessageProps } from "./chat-types";

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isAssistant = role === "assistant";
  const isTyping = content === "Digitando...";

  return (
    <div className={`flex gap-3 ${!isAssistant ? "justify-end" : "justify-start"}`}>
      {isAssistant && (
        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-emerald-500" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg p-3 text-white ${isAssistant
          ? "bg-gray-700"
          : "bg-emerald-600"
          } ${isTyping ? 'animate-pulse' : ''}`}
      >
        {/* Usando react-markdown para renderizar a resposta */}
        <div className={`markdown-body ${isAssistant ? '' : 'text-white'}`} style={{ backgroundColor: 'transparent', fontSize: '0.875rem' }}>
          <Markdown>{content}</Markdown>
        </div>
      </div>

      {!isAssistant && (
        <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};