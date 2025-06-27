'use client'

import { FileText } from "lucide-react"

// O tipo BudgetType vem da sua API de Orçamentos
interface BudgetType {
    id: string
    name: string
    customer: {
        name: string
    } | null
    createdAt: string
}

interface DocumentListProps {
    budgets: BudgetType[]
    isLoading: boolean
}

export function DocumentList({ budgets, isLoading }: DocumentListProps) {
    if (isLoading) {
        return (
            <p className="text-xs text-gray-400 text-center p-4">
                Carregando documentos...
            </p>
        )
    }

    if (budgets.length === 0) {
        return (
            <p className="text-xs text-gray-400 text-center p-4">
                Nenhum orçamento encontrado.
            </p>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto space-y-2 p-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {budgets.map((budget) => (
                <div
                    key={budget.id}
                    className="w-full text-left p-2 rounded-md bg-gray-700/40 text-white"
                >
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium truncate">{budget.name}</p>
                            <p className="text-xs text-gray-400 truncate">
                                Cliente: {budget.customer?.name || "Não especificado"}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}