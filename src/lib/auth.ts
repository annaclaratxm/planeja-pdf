// route.ts
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/auth',
        error: '/auth',
        signOut: '/auth',
        verifyRequest: '/auth',
        newUser: '/client'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

