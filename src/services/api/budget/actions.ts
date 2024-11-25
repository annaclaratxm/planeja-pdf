'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StatusBudget } from '@prisma/client';
import { getServerSession } from 'next-auth';

export interface ProductType {
    id?: string;
    name: string;
    price: number;
}

export interface CategoryType {
    id?: string;
    name: string;
    products: ProductType[];
}

export interface BudgetType {
    id?: string;
    name: string;
    total: number;
    customerId: string | null | undefined;
    categories: CategoryType[];
}

export async function upsertBudget(input: BudgetType) {
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
    console.log('input: ', input);
    if (input.id) {
        // atualizar orçamento existente
        const updatedBudget = await prisma.budget.update({
            where: { id: input.id },
            data: {
                name: input.name,
                customerId: input.customerId,
                total: input.total,
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
                customerId: input.customerId ?? undefined,
                userId: userId,
                total: input.total,
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
        include: {
            customer: true
        }
    });

    return budgets;
}



export async function getBudgetById(budgetId: string) {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("User is not logged");
    }

    return prisma.budget.findFirst({
        where: {
            id: budgetId,
            user: {
                email: session.user.email
            }
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

export async function deleteBudgetById(budgetId: string) {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("User is not logged");
    }

    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            user: {
                email: session.user.email
            }
        }
    });

    if (!budget) {
        throw new Error("Budget not found or you do not have permission to delete it");
    }

    await prisma.budget.delete({
        where: {
            id: budgetId
        }
    });

    return { message: "Budget deleted successfully" };
}
