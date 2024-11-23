'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StatusBudget } from '@prisma/client';
import { getServerSession } from 'next-auth';

interface UpsertBudgetInput {
    id?: string;
    name: string;
    customerId: string;
    categories: {
        id?: string;
        name: string;
        products: {
            id?: string;
            name: string;
            price: number
        }[];
    }[];
}

export async function upsertBudget(input: UpsertBudgetInput) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        throw new Error("User is not logged");
    }

    const userId = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true
        }
    }).then(user => user?.id || "")

    if (!userId) {
        throw new Error("User not founded");
    }

    if (input.id) {
        // atualizar orçamento existente
        const updatedBudget = await prisma.budget.update({
            where: { id: input.id },
            data: {
                name: input.name,
                customerId: input.customerId,
                categories: {
                    deleteMany: {}, // apaga todas as categorias existentes antes de recriar
                    create: input.categories.map((category) => ({
                        name: category.name,
                        products: {
                            create: category.products.map((product) => ({
                                name: product.name,
                                price: parseFloat(product.price.toString()),
                            })),
                        },
                    })),
                },
            },
        });
        return updatedBudget;
    } else {
        // criar novo orçamento
        const newBudget = await prisma.budget.create({
            data: {
                name: input.name,
                customerId: input.customerId,
                userId: userId,
                status: 'Pendente',
                categories: {
                    create: input.categories.map((category) => ({
                        name: category.name,
                        products: {
                            create: category.products.map((product) => ({
                                name: product.name,
                                price: parseFloat(product.price.toString()),
                            })),
                        },
                    })),
                },
            },
        });
        return newBudget;
    }
}

export async function updateStatusBudget(status: StatusBudget, budgetId: string) {
    const budget = await prisma.budget.findUnique({
        where: {
            id: budgetId
        }
    });

    if (!budget) {
        throw new Error("Budget not found");
    }

    if (budget.status === status) {
        return;
    }

    const shippingDate = new Date();
    const validateDate = new Date(shippingDate);
    validateDate.setDate(shippingDate.getDate() + 10);

    return await prisma.budget.update({
        where: {
            id: budgetId
        },
        data: {
            status: status,
            shippingDate: status === "Enviado" ? shippingDate : budget?.shippingDate,
            validateDate: status === "Enviado" ? validateDate : budget?.validateDate,
        }
    });
}

export async function getBudgets() {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("User is not logged");
    }

    const budgets = await prisma.budget.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
    });
    return budgets;
}

export async function getBudgetById(budgetId: string) {
    return prisma.budget.findFirst({
        where: {
            id: budgetId
        },
        include: {
            categories: {
                include: {
                    products: true
                }
            }
        }
    })
}