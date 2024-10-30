'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { deleteCustomerSchema, upsertCustomerSchema } from './schema'

export async function getUserCustomers() {
    //const session = await auth();

    const customers = await prisma.customer.findMany({
        // where: {
        //     userId: //session?.userId?.id
        // }
    })

    return customers
}

export async function upsertCustomer(input: z.infer<typeof upsertCustomerSchema>) {
    const session = await auth()

    if (!session?.user?.id) {
        return {
            error: 'Not authorized',
            data: null,
        }
    }

    if (input.id) {
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

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: input.id,
                userId: session?.user?.id,
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

    const customer = await prisma.customer.create({
        data: {
            name: input.name,
            phone: input.phone ?? "",
            email: input.email,
            birthdate: input.birthdate,
            userId: session?.user?.id,
        },
    })

    return customer
}

export async function deleteCustomer(input: z.infer<typeof deleteCustomerSchema>) {
    const session = await auth()

    if (!session?.user?.id) {
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
