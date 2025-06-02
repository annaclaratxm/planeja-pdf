"use client";

import { Button } from "@/components/ui/button";
import { MessageSquareText, PlusCircle } from "lucide-react";
import { SessionData } from "./chat-types";

interface ChatSidebarProps {
    sessions: SessionData[];
    currentSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    isLoading: boolean;
}

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    isLoading,
}: ChatSidebarProps) {
    return (
        <div className="w-1/3 bg-[#0a192f] p-3 border-r border-gray-700 flex flex-col">
            <Button
                onClick={onNewChat}
                disabled={isLoading}
                className="mb-4 w-full bg-emerald-500 text-white hover:bg-emerald-600"
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Conversa
            </Button>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {isLoading && sessions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center p-4">Carregando conversas...</p>
                )}
                {!isLoading && sessions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center p-4">Clique em &quot;Nova Conversa&quot; para começar.</p>
                )}
                {sessions.map((session) => (
                    <Button
                        key={session.id}
                        variant={session.id === currentSessionId ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left h-auto py-2 px-3 whitespace-normal text-white ${session.id === currentSessionId
                            ? 'bg-gray-700/60 hover:bg-gray-700'
                            : 'hover:bg-gray-700/40'
                            }`}
                        onClick={() => onSelectSession(session.id)}
                        disabled={isLoading}
                    >
                        <MessageSquareText className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="text-sm truncate">
                            {session.title || "Nova Conversa"}
                        </span>
                    </Button>
                ))}
            </div>
            <div className="p-2 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">PlanejaPDF AI</p>
            </div>
        </div>
    );
}