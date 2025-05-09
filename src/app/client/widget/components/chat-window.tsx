"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "./chat-message";
import { ChatMessageData } from "./chat-types";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // obtém user_id do localStorage
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) setUserId(id);
  }, []);


  // ao abrir, carrega histórico
  useEffect(() => {
    if (!isOpen || !userId) return;
  
    fetch(`${API_URL}/chat/history?user_id=${userId}`)
      .then(res => res.json())
      .then((history: { prompt: string; response: string; created_at: string }[]) => {
        console.log("Histórico recebido da API:", history);
        const formattedMessages: ChatMessageData[] = history.flatMap((h, index) => [
          {
            id: `${index}-user`,
            role: "user",
            content: h.prompt
          },
          {
            id: `${index}-assistant`,
            role: "assistant",
            content: h.response
          }
        ]);
        setMessages(formattedMessages);
        // scroll para o final
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
      })
      .catch(err => console.error('Erro ao obter histórico:', err));
  }, [isOpen, userId]);

  // scroll automático ao adicionar mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const userMessage: ChatMessageData = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content, user_id: userId })
      });

      if (!res.ok) {
        console.error('Erro na API:', await res.text());
        return;
      }

      const data = await res.json();
      console.log('Resposta da IA:', data);
      const botMessage: ChatMessageData = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response   
      };
      setMessages(prev => [...prev, botMessage]);

       // Salvar a troca (pergunta/resposta) no histórico do backend
      await fetch(`${API_URL}/chat/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          prompt: userMessage.content,
          response: data.response
        })
      });
    } catch (err) {
      console.error('Erro ao chamar /chat/ask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 sm:w-96 h-[500px] bg-background rounded-lg shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-3 border-b bg-primary text-primary-foreground flex justify-between items-center">
        <h3 className="font-medium">Assistente IA</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="text-primary-foreground hover:bg-primary/90"
          aria-label="Fechar chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-muted-foreground p-4">
            <p>Olá! Como posso ajudar você hoje?</p>
          </div>
        ) : (
          messages.map((message, idx) => (
            <ChatMessage 
              key={`${message.id}-${idx}`} 
              role={message.role} 
              content={message.content} 
            />
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensagem"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
