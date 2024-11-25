'use server'

import { authOptions } from '@/lib/auth'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { deleteCustomerSchema, upsertCustomerSchema } from './schema'

export async function getUserCustomers() {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("User is not logged");
    }

    const customers = await prisma.customer.findMany({
        where: {
            user: {
                email: session.user.email
            }
        },
        select: {
            name: true,
            id: true,
            phone: true,
            email: true,
            birthdate: true,
            userId: true,
            address: true,
            cpf: true,
            cnpj: true
        },
    });

    return customers.map(customer => ({
        ...customer,
        birthdate: customer.birthdate ? customer.birthdate.toISOString() : null,
    }));
}

export async function upsertCustomer(input: z.infer<typeof upsertCustomerSchema>) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return {
            error: 'Not authorized',
            data: null,
        }
    }

    if (input.id) {
        const customer = await prisma.customer.findUnique({
            where: {
                id: input.id,
                user: {
                    email: session.user.email
                }
            },
            select: {
                id: true,
            },
        })

        if (!customer) {
            return {
                error: 'Not found',
                data: null,
            }
        }

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: input.id,
                user: {
                    email: session.user.email
                }
            },
            data: {
                birthdate: input.birthdate,
                email: input.email,
                name: input.name,
                phone: input.phone,
            },
        })

        return {
            error: null,
            data: updatedCustomer,
        }
    }

    if (!input.name) {
        return {
            error: 'Name is required',
            data: null,
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email

        },
        select: {
            id: true
        }
    })

    if (!user || !user.id) {
        return {
            error: 'User not founded',
            data: null,
        }

    }

    const customer = await prisma.customer.create({
        data: {
            name: input.name,
            phone: input.phone ?? "",
            email: input.email,
            birthdate: input.birthdate,
            userId: user.id,
        },
    })

    return customer
}

export async function deleteCustomer(input: z.infer<typeof deleteCustomerSchema>) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return {
            error: 'Not authorized',
            data: null,
        }
    }

    const customer = await prisma.customer.findUnique({
        where: {
            id: input.id,
            userId: session?.user?.id,
        },
        select: {
            id: true,
        },
    })

    if (!customer) {
        return {
            error: 'Not found',
            data: null,
        }
    }

    await prisma.customer.delete({
        where: {
            id: input.id,
            userId: session?.user?.id,
        },
    })

    return {
        error: null,
        data: 'Customer deleted successfully',
    }
}
