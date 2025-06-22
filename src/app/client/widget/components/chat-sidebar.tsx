// src/app/client/widget/components/chat-sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { FileText, MessageSquareText, PlusCircle } from "lucide-react";
import { useState } from "react";
import { PdfDocumentData, SessionData } from "./chat-types";

interface ChatSidebarProps {
    sessions: SessionData[];
    pdfDocuments: PdfDocumentData[];
    currentSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    isLoading: boolean;
}

export function ChatSidebar({
    sessions,
    pdfDocuments,
    currentSessionId,
    onSelectSession,
    onNewChat,
    isLoading,
}: ChatSidebarProps) {
    const [activeTab, setActiveTab] = useState<"conversations" | "documents">("conversations");

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

            <div className="flex border-b border-gray-700 mb-2">
                <Button
                    variant="ghost"
                    onClick={() => setActiveTab("conversations")}
                    className={`flex-1 rounded-none ${activeTab === 'conversations'
                            ? 'text-emerald-400 border-b-2 border-emerald-400'
                            : 'text-gray-400'
                        }`}
                >
                    Conversas
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setActiveTab("documents")}
                    className={`flex-1 rounded-none ${activeTab === 'documents'
                            ? 'text-emerald-400 border-b-2 border-emerald-400'
                            : 'text-gray-400'
                        }`}
                >
                    Documentos
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {activeTab === 'conversations' ? (
                    <>
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
                                <span className="text-sm truncate">{session.title || "Nova Conversa"}</span>
                            </Button>
                        ))}
                    </>
                ) : (
                    <>
                        {isLoading && pdfDocuments.length === 0 && (
                            <p className="text-xs text-gray-400 text-center p-4">Carregando documentos...</p>
                        )}
                        {!isLoading && pdfDocuments.length === 0 && (
                            <p className="text-xs text-gray-400 text-center p-4">Nenhum documento gerado.</p>
                        )}
                        {pdfDocuments.map((doc) => (
                            <a href={doc.download_url} target="_blank" rel="noopener noreferrer" key={doc.id}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-left h-auto py-2 px-3 whitespace-normal text-white hover:bg-gray-700/40"
                                >
                                    <FileText className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                    <div className="flex flex-col">
                                        <span className="text-sm truncate">{doc.file_name}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Button>
                            </a>
                        ))}
                    </>
                )}
            </div>
            <div className="p-2 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">PlanejaPDF AI</p>
            </div>
        </div>
    );
}