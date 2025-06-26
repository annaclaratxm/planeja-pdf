'use client'

import { Button } from "@/components/ui/button"
import "github-markdown-css/github-markdown-dark.css"
import { Bot, LineChart, X } from "lucide-react"
import Markdown from "react-markdown"

interface AnalysisWindowProps {
    onClose: () => void
    analysisData: string | null
    isLoading: boolean
}

export function AnalysisWindow({
    onClose,
    analysisData,
    isLoading,
}: AnalysisWindowProps) {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#112240]">
            <div className="p-4 border-b border-gray-700 bg-[#0a192f] flex justify-between items-center">
                <h3 className="font-medium text-white">Análise Comercial</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:bg-gray-700 hover:text-white"
                    aria-label="Fechar Análise"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {isLoading && (
                    <div className="flex h-full items-center justify-center text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <LineChart size={48} className="text-emerald-500 animate-pulse" />
                            <p>Gerando análise, por favor aguarde...</p>
                        </div>
                    </div>
                )}
                {!isLoading && !analysisData && (
                    <div className="flex h-full items-center justify-center text-center text-gray-400 p-4">
                        <div className="flex flex-col items-center gap-2">
                            <Bot size={48} className="text-emerald-500" />
                            <p>
                                Selecione o período e clique em &quot;Gerar Análise&quot; para
                                ver os insights.
                            </p>
                        </div>
                    </div>
                )}
                {analysisData && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <div
                            className="markdown-body"
                            style={{ backgroundColor: "transparent" }}
                        >
                            <Markdown>{analysisData}</Markdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}