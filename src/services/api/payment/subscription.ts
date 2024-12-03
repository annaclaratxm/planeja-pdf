'use server'

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export async function getPlans() {
    return await prisma.plan.findMany()
}

export async function createSubscription(planId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        throw new Error("User is not logged");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        throw new Error("User not found");
    }

    const subscription = await prisma.subscription.create({
        data: {
            userId: user.id,
            planId,
            status: 'Incomplete',
            startDate: new Date(),
        },
    })
    revalidatePath('/dashboard')
    return subscription
}

export async function getSubscription() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("User is not logged");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.subscription.findFirst({
        where: { id: user.id },
        include: { plan: true },
    })
}

export async function cancelSubscription(subscriptionId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        throw new Error("User is not logged");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        throw new Error("User not found");
    }

    const updatedSubscription = await prisma.subscription.update({
        where: { id: subscriptionId, userId: user.id },
        data: {
            status: 'Canceled',
            cancelAtPeriodEnd: true,
            endDate: new Date(),
        },
    })
    revalidatePath('/dashboard')
    return updatedSubscription
}

export async function getPayments(subscriptionId: string) {
    return await prisma.payment.findMany({
        where: { subscriptionId },
        orderBy: { paymentDate: 'desc' },
    })
}

