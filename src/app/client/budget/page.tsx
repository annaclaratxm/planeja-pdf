"use client"

import { Search } from 'lucide-react'
import { useRouter } from "next/navigation"

interface Budget {
    client: string
    name: string
    status: "Pendente" | "Aceito"
    date: string
}

const budgets: Budget[] = [
    { client: "Daniel Costa", name: "Cozinha", status: "Pendente", date: "12/09/2024" },
    { client: "Carla Mendes", name: "Sala", status: "Pendente", date: "11/09/2024" },
    { client: "Daniel Costa", name: "Quarto", status: "Pendente", date: "11/09/2024" },
    { client: "Elisa Pereira", name: "Banheiro", status: "Aceito", date: "10/09/2024" },
    { client: "Carla Mendes", name: "Sala", status: "Pendente", date: "10/09/2024" },
    { client: "Ana Souza", name: "Cozinha", status: "Pendente", date: "10/09/2024" },
    { client: "Carla Mendes", name: "Quarto", status: "Aceito", date: "10/09/2024" },
]

export default function BudgetPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#0a192f] p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
                    <button
                        onClick={() => router.push("budget/new-budget")}
                        className="rounded-md bg-[#0051FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0051FF]/90"
                    >
                        Adicionar novo orçamento
                    </button>
                </div>
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Pesquisar cliente"
                        className="w-full rounded-md bg-[#132236] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                    />
                </div>
                <div className="rounded-md bg-[#0a192f]">
                    <div className="grid grid-cols-4 gap-4 border-b border-gray-700 p-4 text-sm font-medium text-gray-400">
                        <div>Cliente</div>
                        <div>Nome</div>
                        <div>Status</div>
                        <div>Data</div>
                    </div>
                    {budgets.map((budget, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-4 gap-4 border-b border-gray-700 p-4 text-sm text-white last:border-0"
                        >
                            <div>{budget.client}</div>
                            <div>{budget.name}</div>
                            <div>
                                <span
                                    className={`inline-flex items-center ${budget.status === "Aceito" ? "text-green-400" : "text-[#0051FF]"
                                        }`}
                                >
                                    {budget.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>{budget.date}</span>
                                <button className="text-gray-400 hover:text-white">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-end gap-1 text-sm text-white">
                    <span>1 de XX</span>
                    <button className="rounded-md p-1 hover:bg-[#0a192f]">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

