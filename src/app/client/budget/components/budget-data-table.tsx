"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'
import { deleteBudgetById, updateStatusBudget } from '@/services/api/budget/actions'
import { Search } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import { BudgetGeneratePdf } from './budget-generate-pdf'
import { columns } from './columns'
import { DataTable } from './data-table'

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
    const [showModal, setShowModal] = useState(false)
    const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const handleEdit = (id: string) => {
        router.push(`/client/budget/${id}`)
    }

    const handleDeleteBudget = async (id: string) => {
        await deleteBudgetById(id)
        setShowModal(false)
        setBudgetToDelete(null)
        window.location.reload()
        toast({
            title: "Orçamento Deletado",
            description: "O orçamento foi deletado com sucesso.",
        })
    }

    const filteredBudgets = budgets.filter(budget =>
        budget.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const tableColumns = columns({
        onEdit: handleEdit,
        onDelete: (id) => {
            setBudgetToDelete(id)
            setShowModal(true)
        },
        onPrint: BudgetGeneratePdf,
        onStatusChange: async (status, id) => {
            await updateStatusBudget(status, id)
            window.location.reload()
            toast({
                title: "Status Atualizado",
                description: "O status do orçamento foi atualizado com sucesso.",
            })
        }
    })

    return (
        <div className="min-h-screen bg-[#0a192f] p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
                    <Button
                        onClick={() => router.push("/client/budget/new")}
                        className="bg-[#0051FF] hover:bg-[#0051FF]/90 text-white"
                    >
                        Adicionar novo orçamento
                    </Button>
                </div>
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Pesquisar cliente ou orçamento"
                        className="w-full rounded-md bg-[#132236] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="rounded-md bg-[#0a192f] overflow-x-auto">

                    <DataTable columns={tableColumns} data={filteredBudgets} />
                    <Dialog open={showModal} onOpenChange={setShowModal}>
                        <DialogContent className="bg-[#0a192f] border border-[#132236]">
                            <DialogHeader>
                                <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Você tem certeza que deseja excluir este orçamento?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="bg-[#132236] text-white hover:bg-[#1a2c47]"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => budgetToDelete && handleDeleteBudget(budgetToDelete)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                >
                                    Excluir
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}