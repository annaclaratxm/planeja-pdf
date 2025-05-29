"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatButton } from "./chat-button";
import { ChatWindow } from "./chat-window";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageData, SessionData } from "./chat-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function AIChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [sessions, setSessions] = useState<SessionData[]>([]);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessageData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const id = localStorage.getItem("user_id");
		if (id) {
			setUserId(id);
		} else {
			console.warn("User ID não encontrado no localStorage. O chat pode não funcionar.");
		}
	}, []);

	const fetchSessions = useCallback(async () => {
		if (!userId || !isOpen) return;
		setIsLoading(true);
		try {
			const res = await fetch(`${API_URL}/chat/history?user_id=${userId}`);
			if (!res.ok) throw new Error("Falha ao buscar sessões");
			const data: SessionData[] = await res.json();
			setSessions(data);
			if (data.length > 0 && (!currentSessionId || !data.find(s => s.id === currentSessionId))) {
			} else if (data.length === 0) {
				setCurrentSessionId(null);
				setMessages([]);
			}
		} catch (error) {
			console.error("Erro ao buscar sessões:", error);
			setSessions([]);
		} finally {
			setIsLoading(false);
		}
	}, [userId, isOpen, currentSessionId]);

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]);

	const fetchSessionMessages = async (sessionId: string) => {
		setIsLoading(true);
		try {
			const res = await fetch(`${API_URL}/chat/sessions/${sessionId}`);
			if (!res.ok) throw new Error("Falha ao buscar mensagens da sessão");
			const data: SessionData = await res.json();
			const formattedMessages: ChatMessageData[] = data.conversations.flatMap(
				(conv, index) => [
					{
						id: `${data.id}-${index}-user`,
						role: "user",
						content: conv.prompt,
						created_at: conv.created_at,
					},
					{
						id: `${data.id}-${index}-assistant`,
						role: "assistant",
						content: conv.response,
						created_at: conv.created_at,
					},
				]
			);
			setMessages(formattedMessages);
			setCurrentSessionId(sessionId);
		} catch (error) {
			console.error("Erro ao buscar mensagens:", error);
			setMessages([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectSession = (sessionId: string) => {
		if (sessionId !== currentSessionId) {
			fetchSessionMessages(sessionId);
		}
	};

	const handleNewChat = () => {
		setCurrentSessionId(null);
		setMessages([]);
	};

	const handleSendMessage = async (prompt: string) => {
		if (!userId) {
			console.error("User ID é necessário para enviar mensagens.");
			return;
		}

		setIsLoading(true);
		const userMessage: ChatMessageData = {
			id: `user-${Date.now()}`,
			role: "user",
			content: prompt,
		};
		setMessages((prev) => [...prev, userMessage]);

		let sessionIdToUse = currentSessionId;
		let isNewSession = false;

		try {
			if (!sessionIdToUse) {
				isNewSession = true;
				console.log("Criando nova sessão...");
				const createRes = await fetch(`${API_URL}/chat/session/new`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ user_id: userId, first_prompt: prompt }),
				});
				if (!createRes.ok) throw new Error("Falha ao criar nova sessão");
				const sessionData = await createRes.json();
				sessionIdToUse = sessionData.session_id;
				setCurrentSessionId(sessionIdToUse); 
				console.log("Nova sessão criada:", sessionIdToUse);
			}

			console.log(`Enviando para /ask com session_id: ${sessionIdToUse}`);
			const askRes = await fetch(`${API_URL}/chat/ask`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ session_id: sessionIdToUse, prompt: prompt }),
			});

			if (!askRes.ok) {
				const errorText = await askRes.text();
				throw new Error(`Erro na API /ask: ${errorText}`);
			}

			const data = await askRes.json();
			const botMessage: ChatMessageData = {
				id: `assistant-${Date.now()}`,
				role: "assistant",
				content: data.response,
			};
			setMessages((prev) => [...prev, botMessage]);

			if (isNewSession) {
				await fetchSessions();
			}

		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
			const errorMessage: ChatMessageData = {
				id: `error-${Date.now()}`,
				role: "assistant",
				content: "Desculpe, ocorreu um erro ao processar a sua mensagem.",
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen && (
				<div className="fixed bottom-20 right-4 w-[700px] h-[600px] bg-[#112240] border border-gray-700 rounded-lg shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
					<ChatSidebar
						sessions={sessions}
						currentSessionId={currentSessionId}
						onSelectSession={handleSelectSession}
						onNewChat={handleNewChat}
						isLoading={isLoading}
					/>
					<ChatWindow
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						messages={messages}
						onSendMessage={handleSendMessage}
						isLoading={isLoading}
						currentSessionId={currentSessionId}
					/>
				</div>
			)}
			<ChatButton onClick={toggleChat} isOpen={isOpen} />
		</div>
	);
}