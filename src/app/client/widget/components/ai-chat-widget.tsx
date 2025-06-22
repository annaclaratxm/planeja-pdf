// src/app/client/widget/components/ai-chat-widget.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatButton } from "./chat-button";
import { ChatSidebar } from "./chat-sidebar";
import { ChatMessageData, CustomerData, PdfDocumentData, SessionData } from "./chat-types";
import { ChatWindow } from "./chat-window";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function AIChatWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [sessions, setSessions] = useState<SessionData[]>([]);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessageData[]>([]);
	const [isPdfMode, setIsPdfMode] = useState(false);
	const [customers, setCustomers] = useState<CustomerData[]>([]);
	const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
	const [pdfDocuments, setPdfDocuments] = useState<PdfDocumentData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const id = localStorage.getItem("user_id");
		if (id) {
			setUserId(id);
		} else {
			console.warn("User ID não encontrado no localStorage.");
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
		} catch (error) {
			console.error("Erro ao buscar sessões:", error);
			setSessions([]);
		} finally {
			setIsLoading(false);
		}
	}, [userId, isOpen]);

	const fetchSessionMessages = async (sessionId: string) => {
		setIsLoading(true);
		try {
			const res = await fetch(`${API_URL}/chat/sessions/${sessionId}`);
			if (!res.ok) throw new Error("Falha ao buscar mensagens da sessão");
			const data: SessionData = await res.json();
			const formattedMessages: ChatMessageData[] = data.conversations.flatMap(
				(conv, index) => [
					{ id: `${data.id}-${index}-user`, role: "user", content: conv.prompt, created_at: conv.created_at },
					{ id: `${data.id}-${index}-assistant`, role: "assistant", content: conv.response, created_at: conv.created_at },
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

	const fetchCustomers = useCallback(async () => {
		if (!userId || !isOpen) return;
		try {
			const res = await fetch(`${API_URL}/customers?user_id=${userId}`);
			if (!res.ok) throw new Error("Falha ao buscar clientes");
			const data: CustomerData[] = await res.json();
			console.log("Clientes carregados:", data);
			setCustomers(data);
		} catch (error) {
			console.error("Erro ao buscar clientes:", error);
		}
	}, [userId, isOpen]);

	const fetchPdfDocuments = useCallback(async () => {
		if (!userId || !isOpen) return;
		try {
			const res = await fetch(`${API_URL}/documents?user_id=${userId}`);
			if (!res.ok) throw new Error("Falha ao buscar documentos");
			const data: PdfDocumentData[] = await res.json();
			setPdfDocuments(data);
		} catch (error) {
			console.error("Erro ao buscar documentos:", error);
		}
	}, [userId, isOpen]);

	useEffect(() => {
		if (isOpen && userId) {
			fetchSessions();
			fetchCustomers();
			fetchPdfDocuments();
		}
	}, [isOpen, userId]); // Removido fetchs da dependência para evitar loops

	// Limpa a seleção de cliente quando o modo PDF é desabilitado
	useEffect(() => {
		if (!isPdfMode && selectedCustomerId) {
			setSelectedCustomerId(null);
			console.log("Modo PDF desabilitado - cliente desselecionado");
		}
	}, [isPdfMode, selectedCustomerId]);

	const handleSelectSession = (sessionId: string) => {
		if (sessionId !== currentSessionId) {
			fetchSessionMessages(sessionId);
		}
	};

	const handleNewChat = () => {
		setCurrentSessionId(null);
		setMessages([]);
		setIsPdfMode(false); // Desativa o modo PDF ao iniciar nova conversa
		setSelectedCustomerId(null); // Limpa a seleção de cliente
	};

	const handleSendMessageForChat = async (prompt: string) => {
		if (!userId) return;
		let sessionIdToUse = currentSessionId;
		let isNewSession = false;

		const userMessage: ChatMessageData = { id: `user-${Date.now()}`, role: "user", content: prompt };
		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			if (!sessionIdToUse) {
				isNewSession = true;
				const createRes = await fetch(`${API_URL}/chat/session/new`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ user_id: userId, first_prompt: prompt }),
				});
				if (!createRes.ok) throw new Error("Falha ao criar nova sessão");
				const sessionData = await createRes.json();
				sessionIdToUse = sessionData.session_id;
				setCurrentSessionId(sessionIdToUse);
			}

			const askRes = await fetch(`${API_URL}/chat/ask`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ session_id: sessionIdToUse, prompt: prompt }),
			});
			if (!askRes.ok) throw new Error(await askRes.text());

			const data = await askRes.json();
			const botMessage: ChatMessageData = { id: `assistant-${Date.now()}`, role: 'assistant', content: data.response };
			setMessages((prev) => [...prev, botMessage]);

			if (isNewSession) await fetchSessions();
		} catch (error: any) {
			const errorMessage: ChatMessageData = { id: `error-${Date.now()}`, role: 'assistant', content: `Erro: ${error.message}` };
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGeneratePdf = async (description: string) => {
		if (!userId || !selectedCustomerId) return;

		const userMessage: ChatMessageData = { id: `user-${Date.now()}`, role: "user", content: `Gerar PDF: ${description}` };
		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const res = await fetch(`${API_URL}/documents/generate-budget`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ description, user_id: userId, customer_id: selectedCustomerId }),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.detail || "Falha ao gerar o PDF.");
			}

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			const contentDisposition = res.headers.get('content-disposition');
			let fileName = 'orcamento.pdf';
			if (contentDisposition) {
				const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
				if (fileNameMatch?.[1]) fileName = fileNameMatch[1];
			}
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);

			const botMessage: ChatMessageData = { id: `assistant-${Date.now()}`, role: 'assistant', content: `Orçamento "${fileName}" gerado! O download foi iniciado.` };
			setMessages((prev) => [...prev, botMessage]);
			await fetchPdfDocuments();
		} catch (error: any) {
			const errorMessage: ChatMessageData = { id: `error-${Date.now()}`, role: 'assistant', content: `Erro ao gerar PDF: ${error.message}` };
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = (description: string, pdfMode: boolean) => {
		if (pdfMode) {
			handleGeneratePdf(description);
		} else {
			handleSendMessageForChat(description);
		}
	};

	const toggleChat = () => setIsOpen(!isOpen);

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen && (
				<div className="fixed bottom-20 right-4 w-[700px] h-[600px] bg-[#112240] border border-gray-700 rounded-lg shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
					<ChatSidebar
						sessions={sessions}
						pdfDocuments={pdfDocuments}
						currentSessionId={currentSessionId}
						onSelectSession={handleSelectSession}
						onNewChat={handleNewChat}
						isLoading={isLoading}
					/>
					<ChatWindow
						onClose={() => setIsOpen(false)}
						messages={messages}
						onSendMessage={handleSendMessage}
						isLoading={isLoading}
						isPdfMode={isPdfMode}
						onTogglePdfMode={() => setIsPdfMode(!isPdfMode)}
						customers={customers}
						selectedCustomerId={selectedCustomerId}
						onSelectCustomer={(customerId) => {
							console.log("Cliente selecionado:", customerId);
							setSelectedCustomerId(customerId);
						}}
					/>
				</div>
			)}
			<ChatButton onClick={toggleChat} isOpen={isOpen} />
		</div>
	);
}