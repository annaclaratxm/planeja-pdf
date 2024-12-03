'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSubscription } from "@/services/api/payment/subscription"
import { CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface Plan {
    id: string
    name: string
    description: string | null
    price: number
    interval: 'Mensal' | 'Anual'
}

interface PaymentModalProps {
    plan: Plan
}

export function PaymentModal({ plan }: PaymentModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        try {
            await createSubscription(plan.id)
            setIsOpen(false)
        } catch (error) {
            console.error('Failed to create subscription:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90">
                    Assinar {plan.name}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-w-[90%] max-h-[80vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Assinar {plan.name}
                    </DialogTitle>
                    <DialogDescription>
                        Complete sua assinatura do plano {plan.name} por R${plan.price}/{plan.interval.toLowerCase()}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubscribe} className="space-y-4 mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium block mb-1">Nome no cartão</Label>
                            <Input
                                id="name"
                                placeholder="Digite o nome como está no cartão"
                                className="bg-secondary border-secondary text-sm h-10 w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card" className="text-sm font-medium block mb-1">Número do cartão</Label>
                            <Input
                                id="card"
                                placeholder="1234 5678 9012 3456"
                                className="bg-secondary border-secondary font-mono text-sm h-10 w-full"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry" className="text-sm font-medium block mb-1">Validade</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/AA"
                                    className="bg-secondary border-secondary font-mono text-sm h-10 w-full"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc" className="text-sm font-medium block mb-1">CVC</Label>
                                <Input
                                    id="cvc"
                                    placeholder="123"
                                    className="bg-secondary border-secondary font-mono text-sm h-10 w-full"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full text-sm h-10 mt-6" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            'Confirmar Assinatura'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
