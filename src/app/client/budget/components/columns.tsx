"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Printer, Trash2 } from 'lucide-react'

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

interface ColumnOptions {
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onPrint: (id: string) => void
    onStatusChange: (status: Budget['status'], id: string) => Promise<void>
}

const getStatusColor = (status: Budget['status']) => {
    switch (status) {
        case "Aceito":
            return "text-green-500"
        case "Negado":
            return "text-red-500"
        case "Pendente":
            return "text-blue-500"
        case "Enviado":
            return "text-yellow-500"
        default:
            return ""
    }
}

export const columns = ({
    onEdit,
    onDelete,
    onPrint,
    onStatusChange,
}: ColumnOptions): ColumnDef<Budget>[] => [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "customer.name",
            header: "Cliente",
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total"))
                const formatted = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(amount)
                return <div>{formatted}</div>
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const budget = row.original
                return (
                    <Select
                        defaultValue={budget.status}
                        onValueChange={(value) => onStatusChange(value as Budget['status'], budget.id)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue
                                placeholder="Selecione o status"
                                className={cn(getStatusColor(budget.status))}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="Pendente"
                                className="text-blue-500 focus:text-blue-500 focus:bg-blue-500/10"
                            >
                                Pendente
                            </SelectItem>
                            <SelectItem
                                value="Aceito"
                                className="text-green-500 focus:text-green-500 focus:bg-green-500/10"
                            >
                                Aceito
                            </SelectItem>
                            <SelectItem
                                value="Negado"
                                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                            >
                                Negado
                            </SelectItem>
                            <SelectItem
                                value="Enviado"
                                className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-500/10"
                            >
                                Enviado
                            </SelectItem>
                        </SelectContent>
                    </Select>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const budget = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(budget.id)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(budget.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onPrint(budget.id)}>
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                )
            },
        },
    ]

