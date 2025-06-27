"use client"

import { getBudgets } from "@/services/api/budget/actions"
import { getUserCustomers } from "@/services/api/customer/actions"
import { type Customer as CustomerFromPrisma } from "@/services/api/customer/types"
import { useToast } from "@/hooks/use-toast"
import { useCallback, useEffect, useState } from "react"
import { AnalysisWindow } from "./AnalysisWindow"
import { ChatButton } from "./chat-button"
import { ChatMessageData, SessionData } from "./chat-types"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

type CustomerData = Omit<CustomerFromPrisma, "email"> & {
	email: string | undefined
}

interface BudgetType {
	id: string
	name: string
	customer: { name: string } | null
	createdAt: string
}

export function AIChatWidget() {
	const [isOpen, setIsOpen] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)
	const { toast } = useToast()

	const [activeTab, setActiveTab] = useState<
		"conversas" | "analise" | "documentos"
	>("conversas")

	// Estados
	const [sessions, setSessions] = useState<SessionData[]>([])
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
	const [messages, setMessages] = useState<ChatMessageData[]>([])
	const [isChatLoading, setIsChatLoading] = useState(false)
	const [analysisData, setAnalysisData] = useState<string | null>(null)
	const [isAnalysisLoading, setIsAnalysisLoading] = useState(false)
	const [customers, setCustomers] = useState<CustomerData[]>([])
	const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
	const [budgets, setBudgets] = useState<BudgetType[]>([])
	const [isBudgetsLoading, setIsBudgetsLoading] = useState(false)
	const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx'>('pdf')

	useEffect(() => {
		const id = localStorage.getItem("user_id")
		if (id) setUserId(id)
	}, [])

	const fetchInitialData = useCallback(async () => {
		if (isOpen && userId) {
			try {
				const customerData = await getUserCustomers()
				setCustomers(
					customerData.map((c) => ({
						...c,
						email: c.email === null ? undefined : c.email,
					})),
				)
			} catch (e) {
				console.error("Falha ao buscar clientes:", e)
			}

			setIsBudgetsLoading(true)
			try {
				const budgetsData = await getBudgets()
				setBudgets(
					budgetsData.map((b) => ({
						...b,
						createdAt: new Date(b.createdAt).toLocaleDateString("pt-BR"),
						customer: b.customer ? { name: b.customer.name } : null,
					})),
				)
			} catch (e) {
				console.error("Falha ao buscar orçamentos:", e)
			} finally {
				setIsBudgetsLoading(false)
			}
		}
	}, [isOpen, userId])

	useEffect(() => {
		fetchInitialData()
	}, [fetchInitialData])

	const fetchSessions = useCallback(async () => {
		if (!userId || !isOpen) return
		setIsChatLoading(true)
		try {
			const res = await fetch(`${API_URL}/chat/history?user_id=${userId}`)
			if (!res.ok) throw new Error("Falha ao buscar sessões")
			setSessions(await res.json())
		} catch (e) {
			console.error("Erro ao buscar sessões:", e)
			setSessions([])
		} finally {
			setIsChatLoading(false)
		}
	}, [userId, isOpen])

	useEffect(() => {
		if (isOpen && activeTab === "conversas") {
			fetchSessions()
		}
	}, [isOpen, activeTab, fetchSessions])

	const fetchSessionMessages = async (sessionId: string) => {
		setIsChatLoading(true)
		try {
			const res = await fetch(`${API_URL}/chat/sessions/${sessionId}`)
			if (!res.ok) throw new Error("Falha ao buscar mensagens da sessão")
			const data: SessionData = await res.json()
			setMessages(
				data.conversations.flatMap((conv, index) => [
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
				]),
			)
			setCurrentSessionId(sessionId)
		} catch (error) {
			console.error("Erro ao buscar mensagens:", error)
			setMessages([])
		} finally {
			setIsChatLoading(false)
		}
	}

	const handleSelectSession = (sessionId: string) => {
		if (sessionId !== currentSessionId) fetchSessionMessages(sessionId)
		setActiveTab("conversas")
	}

	const handleNewChat = () => {
		setCurrentSessionId(null)
		setMessages([])
		setActiveTab("conversas")
	}

	const handleSendMessage = async (prompt: string) => {
		if (!userId) return
		setIsChatLoading(true)
		setMessages((prev) => [
			...prev,
			{ id: `user-${Date.now()}`, role: "user", content: prompt },
		])

		let sessionIdToUse = currentSessionId
		let isNewSession = false

		try {
			if (!sessionIdToUse) {
				isNewSession = true
				const createRes = await fetch(`${API_URL}/chat/session/new`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ user_id: userId, first_prompt: prompt }),
				})
				if (!createRes.ok) throw new Error("Falha ao criar nova sessão")
				const sessionData = await createRes.json()
				sessionIdToUse = sessionData.session_id
				setCurrentSessionId(sessionIdToUse)
			}
			const askRes = await fetch(`${API_URL}/chat/ask`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ session_id: sessionIdToUse, prompt: prompt }),
			})
			if (!askRes.ok)
				throw new Error(`Erro na API /ask: ${await askRes.text()}`)
			const data = await askRes.json()
			setMessages((prev) => [
				...prev,
				{
					id: `assistant-${Date.now()}`,
					role: "assistant",
					content: data.response,
				},
			])
			if (isNewSession) await fetchSessions()
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error)
			setMessages((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					role: "assistant",
					content: "Desculpe, ocorreu um erro.",
				},
			])
		} finally {
			setIsChatLoading(false)
		}
	}

	const handleGenerateDocument = async (description: string) => {
		if (!selectedCustomerId) {
			toast({
				title: "Nenhum cliente selecionado",
				description:
					"Por favor, selecione um cliente para gerar o orçamento.",
				variant: "destructive",
			})
			return
		}
		if (!userId) return

		setIsChatLoading(true)
		try {
			const response = await fetch(`${API_URL}/documents/generate-budget`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customer_id: selectedCustomerId,
					user_id: userId,
					description,
					output_format: outputFormat,
				}),
			})
			if (!response.ok)
				throw new Error(
					(await response.json()).detail || "Falha ao gerar o documento.",
				)
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `orcamento-${selectedCustomerId}.${outputFormat}`
			document.body.appendChild(a)
			a.click()
			a.remove()
			window.URL.revokeObjectURL(url)
			toast({
				title: "Sucesso!",
				description: "Seu documento foi gerado e o download foi iniciado.",
			})
		} catch (error: unknown) {
			toast({
				title: "Erro!",
				description: error instanceof Error ? error.message : "Não foi possível gerar o documento.",
				variant: "destructive",
			})
		} finally {
			setIsChatLoading(false) // CORREÇÃO: Adicionado para parar o loading
		}
	}

	const handleInputSubmit = async (prompt: string) => {
		if (activeTab === "documentos") {
			await handleGenerateDocument(prompt)
		} else {
			await handleSendMessage(prompt)
		}
	}

	const handleAnalysisFetched = (analysis: string) => {
		setAnalysisData(analysis)
		setActiveTab("analise")
	}

	const toggleChat = () => setIsOpen(!isOpen)

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen && (
				<div className="fixed bottom-20 right-4 w-[700px] h-[600px] bg-[#112240] border border-gray-700 rounded-lg shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
					<ChatSidebar
						sessions={sessions}
						currentSessionId={currentSessionId}
						onSelectSession={handleSelectSession} // CORREÇÃO: Passando a função correta
						onNewChat={handleNewChat} // CORREÇÃO: Passando a função correta
						isChatLoading={isChatLoading}
						userId={userId!}
						onAnalysisFetched={handleAnalysisFetched}
						isAnalysisLoading={isAnalysisLoading}
						setIsAnalysisLoading={setIsAnalysisLoading}
						customers={customers}
						budgets={budgets}
						isBudgetsLoading={isBudgetsLoading}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<div className="flex-1 flex flex-col h-full overflow-hidden">
						{activeTab === "analise" ? (
							<AnalysisWindow
								onClose={() => setIsOpen(false)}
								analysisData={analysisData}
								isLoading={isAnalysisLoading}
							/>
						) : (
							<ChatWindow
								onClose={() => setIsOpen(false)}
								messages={messages}
								onSubmit={handleInputSubmit}
								isLoading={isChatLoading}
								activeTab={activeTab}
								customers={customers}
								selectedCustomerId={selectedCustomerId}
								onSelectCustomer={setSelectedCustomerId}
								outputFormat={outputFormat}
								onOutputFormatChange={setOutputFormat}
							/>
						)}
					</div>
				</div>
			)}
			<ChatButton onClick={toggleChat} isOpen={isOpen} />
		</div>
	)
}