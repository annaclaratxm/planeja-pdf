'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface AnalysisPanelProps {
    userId: string
    onAnalysisFetched: (analysis: string) => void
    setIsLoading: (isLoading: boolean) => void
    isLoading: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export function AnalysisPanel({
    userId,
    onAnalysisFetched,
    setIsLoading,
    isLoading,
}: AnalysisPanelProps) {
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleFetchAnalysis = async () => {
        setIsLoading(true)
        setError(null)
        let days = 90
        if (startDate && endDate) {
            const start = new Date(startDate)
            const end = new Date(endDate)
            if (start > end) {
                setError("A data de início não pode ser posterior à data de fim.")
                setIsLoading(false)
                return
            }
            const diffTime = Math.abs(end.getTime() - start.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays > 365) {
                setError("O período não pode ser maior que 365 dias.")
                setIsLoading(false)
                return
            }
            days = diffDays
        }
        try {
            const res = await fetch(
                `${API_URL}/analysis/${userId}/sales-trends?days=${days}`,
            )
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Falha ao buscar análise.")
            }
            const data = await res.json()
            onAnalysisFetched(data.analysis)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unknown error occurred.")
            }
            onAnalysisFetched("")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-medium text-white text-center">Análise de Vendas</h3>
            <div className="space-y-2">
                <Label htmlFor="start-date" className="text-sm text-gray-300">
                    Data de Início
                </Label>
                <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isLoading}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="end-date" className="text-sm text-gray-300">
                    Data de Fim
                </Label>
                <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    disabled={isLoading}
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Button
                onClick={handleFetchAnalysis}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
            >
                {isLoading ? "Analisando..." : "Gerar Análise"}
            </Button>
        </div>
    )
}