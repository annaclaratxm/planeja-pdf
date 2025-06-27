"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { type Customer as CustomerFromPrisma } from "@/services/api/customer/types"
import {
    FileText,
    LineChart,
    MessageSquare,
    MessageSquareText,
    PlusCircle,
} from "lucide-react"
import { AnalysisPanel } from "./AnalysisPanel"
import { DocumentList } from "./DocumentList"
import { SessionData } from "./chat-types"

type CustomerData = Omit<CustomerFromPrisma, "email"> & {
    email: string | undefined
}

interface BudgetType {
    id: string
    name: string
    customer: { name: string } | null
    createdAt: string
}

interface ChatSidebarProps {
    sessions: SessionData[]
    currentSessionId: string | null
    onSelectSession: (sessionId: string) => void
    onNewChat: () => void
    isChatLoading: boolean
    userId: string
    onAnalysisFetched: (analysis: string) => void
    isAnalysisLoading: boolean
    setIsAnalysisLoading: (isLoading: boolean) => void
    customers: CustomerData[]
    budgets: BudgetType[]
    isBudgetsLoading: boolean
    activeTab: "conversas" | "analise" | "documentos"
    setActiveTab: (tab: "conversas" | "analise" | "documentos") => void
}

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    isChatLoading,
    userId,
    onAnalysisFetched,
    isAnalysisLoading,
    setIsAnalysisLoading,
    budgets,
    isBudgetsLoading,
    activeTab,
    setActiveTab,
}: ChatSidebarProps) {
    return (
        <div className="w-1/3 bg-[#0a192f] p-0 border-r border-gray-700 flex flex-col">
            <Tabs
                value={activeTab}
                onValueChange={(value) =>
                    setActiveTab(value as "conversas" | "analise" | "documentos")
                }
                className="flex flex-col h-full"
            >
                <TooltipProvider delayDuration={0}>
                    <TabsList className="grid w-full grid-cols-3 bg-[#112240] rounded-none p-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger
                                    value="conversas"
                                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Conversas</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger
                                    value="analise"
                                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                                >
                                    <LineChart className="h-5 w-5" />
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Análise</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger
                                    value="documentos"
                                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                                >
                                    <FileText className="h-5 w-5" />
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Documentos</p>
                            </TooltipContent>
                        </Tooltip>
                    </TabsList>
                </TooltipProvider>

                <TabsContent
                    value="conversas"
                    className="flex-grow overflow-hidden mt-0 p-3 flex flex-col"
                >
                    <Button
                        onClick={onNewChat}
                        disabled={isChatLoading}
                        className="mb-4 w-full bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Conversa
                    </Button>
                    <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        {sessions.map((session) => (
                            <Button
                                key={session.id}
                                variant={
                                    session.id === currentSessionId ? "secondary" : "ghost"
                                }
                                className={`w-full justify-start text-left h-auto py-2 px-3 whitespace-normal text-white ${session.id === currentSessionId
                                    ? "bg-gray-700/60 hover:bg-gray-700"
                                    : "hover:bg-gray-700/40"
                                    }`}
                                onClick={() => onSelectSession(session.id)}
                                disabled={isChatLoading}
                            >
                                <MessageSquareText className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                                <span className="text-sm truncate">
                                    {session.title || "Nova Conversa"}
                                </span>
                            </Button>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="analise" className="flex-grow mt-0">
                    <AnalysisPanel
                        userId={userId}
                        onAnalysisFetched={onAnalysisFetched}
                        isLoading={isAnalysisLoading}
                        setIsLoading={setIsAnalysisLoading}
                    />
                </TabsContent>

                <TabsContent
                    value="documentos"
                    className="flex-grow mt-0 flex flex-col"
                >
                    <DocumentList budgets={budgets} isLoading={isBudgetsLoading} />
                </TabsContent>
            </Tabs>
        </div>
    )
}