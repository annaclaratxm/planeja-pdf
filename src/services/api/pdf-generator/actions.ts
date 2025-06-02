'use server'

import { prisma } from '@/lib/prisma';

export async function getBudgetDetails(budgetId: string) {
    const budget = await prisma.budget.findUnique({
        where: {
            id: budgetId
        },
        select: {
            name: true,
            shippingDate: true,
            total: true,
            validateDate: true,
            customer: {
                select: {
                    name: true,
                    phone: true,
                }
            },
            categories: {
                select: {
                    name: true,
                    products: {
                        select: {
                            name: true,
                            price: true,
                        }
                    }
                }
            },
            user: {
                select: {
                    email: true,
                    name: true,
                    settings: {
                        select: {
                            companyName: true,
                            phone: true,
                            budgetValidityDays: true,
                            deliveryTimeDays: true,
                            observation: true,
                            paymentMethod: true,
                            responsiblePerson: true,
                        }
                    }
                }
            },
            createdAt: true,
        }
    });
    return budget;
}

export async function getSettingByBudgetId(budgetId: string) {
    const budget = await prisma.budget.findUnique({
        where: {
            id: budgetId
        },
        select: {
            user: {
                select: {
                    settings: {
                        select: {
                            city: true,
                            cnpj: true,
                            companyName: true,
                            number: true,
                            street: true,
                            phone: true,
                            zipCode: true,
                            state: true,
                            neighborhood: true,
                            logo: true,
                        }
                    }
                }
            }
        }
    });

    return budget?.user?.settings;
}

