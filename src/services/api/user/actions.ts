'use server'

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getUserName() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        throw new Error("User is not logged");
    }

    const userName = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            name: true
        }
    }).then(user => user?.name);

    if (!userName) {
        throw new Error("User not found");
    }

    return userName;
}