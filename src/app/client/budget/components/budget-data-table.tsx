"use client"

import { toast } from '@/hooks/use-toast'
import { deleteBudgetById, updateStatusBudget } from '@/services/api/budget/actions'
import { Edit, Search, Trash2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { BudgetGeneratePdf } from './budget-generate-pdf'

interface Budget {
    id: string
    customer: Customer | null
    name: string
    total: number
    status: "Pendente" | "Aceito" | "Negado" | "Enviado"
    shippingDate: string
}

interface Customer {
    name: string
    phone: string
    email: string | null
    birthdate: Date | null
    id: string
    userId: string
}

export default function BudgetDataTable({ budgets }: { budgets: Budget[] }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false);
    const handleEdit = (id: string) => {
        router.push(`/client/budget/${id}`);
    }

    const handleDeleteBudget = async (id: string) => {
        await deleteBudgetById(id);

        window.location.reload();

        toast({
            title: "Orçamento Deletado",
            description: "O orçamento foi deletado com sucesso.",
        });
    };

    return (
        <div className="min-h-screen bg-[#0a192f] p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
                    <button
                        onClick={() => router.push("/client/budget/new")}
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
                    <div className="grid grid-cols-5 gap-4 border-b border-gray-700 p-4 text-sm font-medium text-gray-400">
                        <div>Nome</div>
                        <div>Cliente</div>
                        <div>Total</div>
                        <div>Status</div>
                        <div>Ações</div>
                    </div>
                    {budgets.map((budget) => (
                        <div
                            key={budget.id}
                            className="grid grid-cols-5 gap-4 border-b border-gray-700 p-4 text-sm text-white last:border-0"
                        >
                            <div>{budget.name}</div>
                            <div>{budget.customer?.name}</div>
                            <div>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <div>
                                <select
                                    value={budget.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value as Budget["status"];
                                        await updateStatusBudget(newStatus, budget.id);
                                        window.location.reload();
                                    }}
                                    className={`inline-flex items-center ${budget.status === "Aceito" ? "text-green-400" : budget.status === "Negado" ? "text-red-400" : budget.status === "Enviado" ? "text-yellow-300" : "text-[#0051FF]"
                                        } bg-transparent border-none focus:outline-none`}
                                >
                                    <option value="Pendente" className="bg-[#132236] border-none text-white">Pendente</option>
                                    <option value="Aceito" className="bg-[#132236] text-white">Aceito</option>
                                    <option value="Negado" className="bg-[#132236] text-white">Negado</option>
                                    <option value="Enviado" className="bg-[#132236] text-white">Enviado</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => handleEdit(budget.id)}
                                    aria-label="Editar orçamento"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-400"
                                    onClick={() => setShowModal(true)}
                                    aria-label="Excluir orçamento"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                {showModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-[#0a192f] p-6 rounded-md shadow-md border border-[#132236]">
                                            <h2 className="text-lg font-semibold text-white">Confirmar Exclusão</h2>
                                            <p className="mt-2 text-sm text-gray-400">Você tem certeza que deseja excluir este orçamento?</p>
                                            <div className="mt-4 flex justify-end space-x-2">
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-[#132236] rounded-md hover:bg-[#1a2c47]"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                                    onClick={() => {
                                                        handleDeleteBudget(budget.id);
                                                        setShowModal(false);
                                                    }}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => BudgetGeneratePdf(budget.id)}
                                    aria-label="Imprimir orçamento"
                                >
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
                                            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 3.5V9h5.5M8 18h8M8 14h8M8 10h4"
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

