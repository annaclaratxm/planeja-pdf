'use server'

import { authOptions } from '@/lib/auth'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export async function generatePdf(budgetId: string) {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("User is not logged");
    }

    const budget = await prisma.budget.findUnique({
        where: {
            id: budgetId,
            user: {
                email: session.user.email
            }
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
                    setting: {
                        select: {
                            city: true,
                            cnpj: true,
                            companyName: true,
                            number: true,
                            street: true,
                            phone: true,
                            zipCode: true,
                            state: true,
                            logo: true,
                        }
                    }
                }
            },
            createdAt: true,

        }
    });

    return budget;
}
