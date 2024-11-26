'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BudgetType, upsertBudget } from '@/services/api/budget/actions'
import { Customer } from "@/services/api/customer/types"
import { Plus, Trash2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function BudgetForm({ initialData, dataCustomer }: { initialData?: BudgetType | null, dataCustomer: Customer[] }) {
    const router = useRouter()

    const [budget, setBudget] = useState<BudgetType>(() => initialData || {
        name: '',
        customerId: null,
        total: 0,
        categories: [{
            name: '',
            products: [{
                name: '',
                price: 0
            }]
        }]
    })

    const handleSubmit = useCallback(async () => {
        try {
            await upsertBudget(budget)
            router.push('/client/budget')
            router.refresh()
        } catch (error) {
            console.error('Error saving budget:', error)
        }
    }, [budget, router])

    const addCategory = useCallback(() => {
        setBudget(prev => ({
            ...prev,
            categories: [...prev.categories, {
                name: '',
                products: [{
                    name: '',
                    price: 0
                }]
            }]
        }))
    }, [])

    const addProduct = useCallback((categoryIndex: number) => {
        setBudget(prev => ({
            ...prev,
            categories: prev.categories.map((category, idx) => {
                if (idx === categoryIndex) {
                    return {
                        ...category,
                        products: [...category.products, { name: '', price: 0 }]
                    }
                }
                return category
            })
        }))
    }, [])

    const removeProduct = useCallback((categoryIndex: number, productIndex: number) => {
        setBudget(prev => ({
            ...prev,
            categories: prev.categories.map((category, idx) => {
                if (idx === categoryIndex) {
                    return {
                        ...category,
                        products: category.products.filter((_, pIdx) => pIdx !== productIndex)
                    }
                }
                return category
            })
        }))
    }, [])

    const calculateTotalBudget = useCallback(() => {
        const total = budget.categories.reduce((total, category) => {
            return total + category.products.reduce((catTotal, product) => catTotal + (product.price || 0), 0)
        }, 0)
        setBudget(prev => ({ ...prev, total }))
        return total;
    }, [budget.categories]);

    useEffect(() => {
        calculateTotalBudget();
    }, [budget.categories, calculateTotalBudget]);

    return (
        <Card className="bg-[#0a192f] text-white border-none">
            <CardHeader>
                <CardTitle className="text-2xl">
                    {initialData ? 'Editar orçamento' : 'Novo orçamento'}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nomeie este orçamento</label>
                    <Input
                        value={budget.name}
                        onChange={e => setBudget(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-[#132236] border-[#003380] text-white"
                        placeholder="Digite aqui"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Cliente</label>
                    <Select
                        value={budget.customerId || ''}
                        onValueChange={(value) => setBudget(prev => ({ ...prev, customerId: value }))}
                    >
                        <SelectTrigger className="bg-[#132236] border-[#003380] text-white">
                            <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {dataCustomer.map(customer => (
                                <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {budget.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Categoria</label>
                            <Input
                                value={category.name}
                                onChange={e => setBudget(prev => ({
                                    ...prev,
                                    categories: prev.categories.map((c, idx) =>
                                        idx === categoryIndex ? { ...c, name: e.target.value } : c
                                    )
                                }))}
                                className="bg-[#132236] border-[#003380] text-white"
                                placeholder="Nome da categoria"
                            />
                        </div>

                        <div className="space-y-4">
                            {category.products.map((product, productIndex) => (
                                <div key={productIndex} className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        value={product.name}
                                        onChange={e => setBudget(prev => ({
                                            ...prev,
                                            categories: prev.categories.map((c, cIdx) =>
                                                cIdx === categoryIndex ? {
                                                    ...c,
                                                    products: c.products.map((p, pIdx) =>
                                                        pIdx === productIndex ? { ...p, name: e.target.value } : p
                                                    )
                                                } : c
                                            )
                                        }))}
                                        className="bg-[#132236] border-[#003380] text-white flex-1"
                                        placeholder="Nome do produto"
                                    />
                                    <Input
                                        type="text"
                                        value={new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(product.price || 0)}
                                        onChange={e => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            const floatValue = parseFloat(value) / 100;
                                            setBudget(prev => ({
                                                ...prev,
                                                categories: prev.categories.map((c, cIdx) =>
                                                    cIdx === categoryIndex ? {
                                                        ...c,
                                                        products: c.products.map((p, pIdx) =>
                                                            pIdx === productIndex ? { ...p, price: floatValue } : p
                                                        )
                                                    } : c
                                                )
                                            }))
                                        }}
                                        className="bg-[#132236] border-[#003380] text-white w-full md:w-32"
                                        placeholder="R$ 0,00"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeProduct(categoryIndex, productIndex)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => addProduct(categoryIndex)}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar mais produtos
                        </Button>
                    </div>
                ))}

                <Button
                    variant="secondary"
                    onClick={addCategory}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Adicionar mais categorias
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 text-white p-4 rounded-lg mt-4 shadow-lg">
                    <span className="text-xl font-semibold">Total do orçamento:</span>
                    <span className="text-2xl font-bold text-green-400">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(budget.total)}
                    </span>
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                    Salvar
                </Button>
            </CardContent>
        </Card>
    )
}