"use client"

import { ArrowLeft, Plus, Search, Trash2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Product {
    id: number
    name: string
    price: string
}

interface Category {
    id: number
    name: string
    products: Product[]
}

export default function NewBudgetPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([
        { id: 1, name: "", products: [{ id: 1, name: "", price: "" }] }
    ])

    const addCategory = () => {
        setCategories([...categories, {
            id: categories.length + 1,
            name: "",
            products: [{ id: 1, name: "", price: "" }]
        }])
    }

    const addProduct = (categoryId: number) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    products: [...category.products, {
                        id: category.products.length + 1,
                        name: "",
                        price: ""
                    }]
                }
            }
            return category
        }))
    }

    const updateCategoryName = (categoryId: number, name: string) => {
        setCategories(categories.map(category =>
            category.id === categoryId ? { ...category, name } : category
        ))
    }

    const updateProduct = (categoryId: number, productId: number, field: 'name' | 'price', value: string) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    products: category.products.map(product =>
                        product.id === productId ? { ...product, [field]: value } : product
                    )
                }
            }
            return category
        }))
    }

    const removeCategory = (categoryId: number) => {
        setCategories(categories.filter(category => category.id !== categoryId))
    }

    const removeProduct = (categoryId: number, productId: number) => {
        setCategories(categories.map(category => {
            if (category.id === categoryId) {
                return {
                    ...category,
                    products: category.products.filter(product => product.id !== productId)
                }
            }
            return category
        }))
    }

    return (
        <div className="min-h-screen bg-[#0a192f] p-8">
            <div className="mx-auto max-w-7xl">
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center text-white hover:text-gray-300"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </button>

                <h1 className="mb-8 text-2xl font-bold text-white">Novo orçamento</h1>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm text-white">
                            Nomeie este orçamento
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Digite aqui"
                            className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                        />
                    </div>

                    <div>
                        <label htmlFor="client" className="mb-2 block text-sm text-white">
                            Cliente
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="client"
                                placeholder="Pesquisar cliente"
                                className="w-full rounded-md bg-[#132236] py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                            />
                        </div>
                    </div>

                    {categories.map((category, categoryIndex) => (
                        <div key={category.id} className="space-y-4 bg-[#0a192f] p-4 rounded-md">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-white">
                                    Categoria
                                </label>
                                {categoryIndex > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCategory(category.id)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Nome da categoria"
                                value={category.name}
                                onChange={(e) => updateCategoryName(category.id, e.target.value)}
                                className="w-full rounded-md bg-[#132236] px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                            />

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-white">
                                    Produtos
                                </label>
                                {category.products.map((product) => (
                                    <div key={product.id} className="grid grid-cols-[1fr,auto,120px,auto] gap-4 items-center">
                                        <input
                                            type="text"
                                            placeholder="Nome do produto"
                                            value={product.name}
                                            onChange={(e) => updateProduct(category.id, product.id, 'name', e.target.value)}
                                            className="w-full rounded-md bg-[#132236] px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                                        />
                                        <div className="flex items-center">
                                            <span className="text-white text-sm">R$</span>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="00.00"
                                            value={product.price}
                                            onChange={(e) => updateProduct(category.id, product.id, 'price', e.target.value)}
                                            className="w-full rounded-md bg-[#132236] px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(category.id, product.id)}
                                            className="text-red-500 hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addProduct(category.id)}
                                className="flex items-center text-[#0051FF] hover:text-[#0051FF]/90 text-sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar mais produtos
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCategory}
                        className="w-full rounded-md bg-[#0051FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0051FF]/90"
                    >
                        Adicionar mais categorias
                    </button>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}