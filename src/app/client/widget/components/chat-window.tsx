// src/app/client/widget/components/chat-window.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, FileText, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./chat-message";
import { ChatMessageData, CustomerData } from "./chat-types";

interface ChatWindowProps {
	onClose: () => void;
	messages: ChatMessageData[];
	onSendMessage: (prompt: string, isPdfMode: boolean) => void;
	isLoading: boolean;
	isPdfMode: boolean;
	onTogglePdfMode: () => void;
	customers: CustomerData[];
	selectedCustomerId: number | null;
	onSelectCustomer: (customerId: string) => void;
}

export function ChatWindow({
	onClose,
	messages,
	onSendMessage,
	isLoading,
	isPdfMode,
	onTogglePdfMode,
	customers,
	selectedCustomerId,
	onSelectCustomer,
}: ChatWindowProps) {
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
		}
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;
		if (isPdfMode && !selectedCustomerId) {
			alert("Por favor, selecione um cliente para gerar o orçamento.");
			return;
		}
		onSendMessage(input.trim(), isPdfMode);
		setInput("");
	};

	return (
		<div className="flex-1 flex flex-col h-full overflow-hidden bg-[#112240]">
			<div className="p-4 border-b border-gray-700 bg-[#0a192f] flex justify-between items-center">
				<h3 className="font-medium text-white">Assistente IA PlanejaPDF</h3>
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="text-gray-400 hover:bg-gray-700 hover:text-white"
					aria-label="Fechar chat"
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
			>
				{messages.length === 0 && !isLoading && (
					<div className="flex h-full items-center justify-center text-center text-gray-400 p-4">
						<div className="flex flex-col items-center gap-2">
							<Bot size={48} className="text-emerald-500" />
							<p>Olá! Sou seu assistente para orçamentos. <br /> Como posso ajudar?</p>
						</div>
					</div>
				)}
				{messages.map((message) => (
					<ChatMessage
						key={message.id}
						role={message.role}
						content={message.content}
					/>
				))}
				{isLoading && <ChatMessage role="assistant" content="Digitando..." />}
			</div>

			<form
				onSubmit={handleSubmit}
				className="p-4 border-t border-gray-700 flex flex-col gap-3 bg-[#0a192f]"
			>
				{isPdfMode && (
					<Select onValueChange={onSelectCustomer} value={selectedCustomerId?.toString()}>
						<SelectTrigger className="bg-gray-700 border-gray-600 text-white">
							<SelectValue placeholder="Selecione um cliente para o orçamento..." />
						</SelectTrigger>
						<SelectContent>
							{customers.map((customer) => (
								<SelectItem key={customer.id} value={customer.id.toString()}>
									{customer.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
				<div className="flex gap-3 items-center">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={isPdfMode ? "Descreva o orçamento para gerar o PDF..." : "Digite sua mensagem aqui..."}
						className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
						disabled={isLoading}
					/>
					<Button
						type="button"
						size="icon"
						variant={isPdfMode ? "secondary" : "ghost"}
						onClick={onTogglePdfMode}
						aria-label="Gerar PDF"
						className={isPdfMode ? "bg-emerald-600 text-white" : "text-gray-400"}
					>
						<FileText className="h-4 w-4" />
					</Button>
					<Button
						type="submit"
						size="icon"
						disabled={isLoading || !input.trim()}
						aria-label="Enviar mensagem"
						className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex-shrink-0"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
}