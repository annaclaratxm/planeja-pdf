'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { type Customer } from "@/services/api/customer/types"
import { useState } from "react"

// Usaremos este tipo para garantir a compatibilidade, como no ajuste anterior.
type CustomerData = Omit<Customer, "email"> & {
    email: string | undefined
}

interface DocumentPanelProps {
    userId: string
    customers: CustomerData[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export function DocumentPanel({ userId, customers }: DocumentPanelProps) {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleGenerateDocument = async () => {
        if (!selectedCustomerId || !description) {
            toast({
                title: "Campos obrigatórios",
                description: "Por favor, selecione um cliente e preencha a descrição.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/documents/generate-budget`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer_id: selectedCustomerId,
                    user_id: userId,
                    description: description,
                    output_format: "pdf",
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Falha ao gerar o documento.")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `orcamento-${selectedCustomerId}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)

            toast({
                title: "Sucesso!",
                description: "Seu documento foi gerado e o download foi iniciado.",
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast({
                    title: "Erro!",
                    description: error.message || "Não foi possível gerar o documento.",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Erro!",
                    description: "Não foi possível gerar o documento.",
                    variant: "destructive",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-medium text-white text-center">Gerador de Documentos</h3>
            <div className="space-y-2">
                <Label className="text-sm text-gray-300">Cliente</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white">
                        {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label className="text-sm text-gray-300">Descrição do Orçamento</Label>
                <Textarea
                    placeholder="Ex: Uma cozinha planejada com armários brancos, bancada de granito preto e uma ilha central..."
                    className="bg-gray-700 border-gray-600 text-white"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                />
            </div>
            <Button
                onClick={handleGenerateDocument}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading}
            >
                {isLoading ? "Gerando..." : "Gerar Orçamento"}
            </Button>
        </div>
    )
}