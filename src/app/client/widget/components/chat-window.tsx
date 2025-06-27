"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { type Customer } from "@/services/api/customer/types"
import { Bot, FileUp, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import "github-markdown-css/github-markdown-dark.css"
import { ChatMessage } from "./chat-message"
import { ChatMessageData } from "./chat-types"

type CustomerData = Omit<Customer, "email"> & {
	email: string | undefined
}

interface ChatWindowProps {
	onClose: () => void
	messages: ChatMessageData[]
	// Renomeado para onSubmit para ficar mais genérico
	onSubmit: (prompt: string) => void
	isLoading: boolean
	// Novas props
	activeTab: "conversas" | "analise" | "documentos"
	customers: CustomerData[]
	selectedCustomerId: string | null
	onSelectCustomer: (customerId: string) => void
	outputFormat: 'pdf' | 'docx'
	onOutputFormatChange: (format: 'pdf' | 'docx') => void
}

export function ChatWindow({
	onClose,
	messages,
	onSubmit,
	isLoading,
	activeTab,
	customers,
	selectedCustomerId,
	onSelectCustomer,
	outputFormat,
	onOutputFormatChange,
}: ChatWindowProps) {
	const [input, setInput] = useState("")
	const scrollRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
		}
	}, [messages])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || isLoading) return
		// A lógica de qual ação tomar foi movida para o componente pai (ai-chat-widget)
		onSubmit(input.trim())
		setInput("")
	}

	const isDocumentMode = activeTab === "documentos"

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
							<p>
								Olá! Sou seu assistente para orçamentos. <br /> Como posso
								ajudar?
							</p>
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

			<form onSubmit={handleSubmit} className="bg-[#0a192f]">
				{isDocumentMode && (
					<div className="p-3 border-t border-b border-gray-700 space-y-3">
						<Select
							value={selectedCustomerId || ""}
							onValueChange={onSelectCustomer}
						>
							<SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
								<SelectValue placeholder="Selecione um cliente para gerar o orçamento" />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 text-white">
								{customers.map((customer) => (
									<SelectItem key={customer.id} value={customer.id}>
										{customer.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						
						<Select
							value={outputFormat}
							onValueChange={onOutputFormatChange}
						>
							<SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
								<SelectValue placeholder="Selecione o formato do documento" />
							</SelectTrigger>
							<SelectContent className="bg-gray-800 text-white">
								<SelectItem value="pdf">
									📄 PDF - Formato padrão para visualização
								</SelectItem>
								<SelectItem value="docx">
									📝 DOCX - Documento editável do Word
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
				<div className="p-4 flex gap-3 items-center">
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={
							isDocumentMode
								? `Descreva o orçamento para gerar o ${outputFormat.toUpperCase()}...`
								: "Digite sua mensagem aqui..."
						}
						className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
						disabled={isLoading}
					/>
					<Button
						type="submit"
						size="icon"
						disabled={isLoading || !input.trim()}
						aria-label={
							isDocumentMode ? "Gerar Documento" : "Enviar mensagem"
						}
						className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex-shrink-0"
					>
						{isDocumentMode ? (
							<FileUp className="h-4 w-4" />
						) : (
							<Send className="h-4 w-4" />
						)}
					</Button>
				</div>
			</form>
		</div>
	)
}