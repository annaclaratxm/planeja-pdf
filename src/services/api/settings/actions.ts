'use server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { upsertSettingsSchema } from './schema'

export async function upsertSettings(input: z.infer<typeof upsertSettingsSchema>) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        throw new Error('Not authorized')
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
        throw new Error('User not found')
    }

    const settings = await prisma.settings.upsert({
        where: {
            userId: user.id
        },
        update: {
            companyName: input.companyName,
            cnpj: input.cnpj,
            street: input.street,
            number: input.number,
            zipCode: input.zipCode,
            state: input.state,
            city: input.city,
            phone: input.phone,
            responsiblePerson: input.responsiblePerson,
            logo: input.logo,
            updatedAt: new Date(),
            budgetValidityDays: input.budgetValidityDays,
            deliveryTimeDays: input.deliveryTimeDays,
            observation: input.observation,
            paymentMethod: input.paymentMethod
        },
        create: {
            userId: user.id,
            companyName: input.companyName,
            cnpj: input.cnpj,
            street: input.street,
            number: input.number,
            zipCode: input.zipCode,
            state: input.state,
            city: input.city,
            phone: input.phone,
            responsiblePerson: input.responsiblePerson,
            logo: input.logo,
            updatedAt: new Date(),
            createdAt: new Date(),
            budgetValidityDays: input.budgetValidityDays,
            deliveryTimeDays: input.deliveryTimeDays,
            observation: input.observation,
            paymentMethod: input.paymentMethod
        },
    })

    return settings;
}

export async function getSettings() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        throw new Error('Not authorized');
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
        throw new Error("User not found");
    }

    const settings = await prisma.settings.findUnique({
        where: {
            userId: user.id
        }
    })

    return settings;
}

