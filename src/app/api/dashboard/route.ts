// src/app/api/dashboard/route.ts

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        const userId = (session?.user as any)?.id;
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Não autorizado: Utilizador não encontrado na sessão." }),
                { status: 401 }
            );
        }

        const endpoints = {
            totalCustomers: `${API_URL}/analysis/total_customers?user_id=${userId}`,
            totalBudgets: `${API_URL}/analysis/total_budgets?user_id=${userId}`,
            conversionRate: `${API_URL}/analysis/conversion_rate?user_id=${userId}`,
        };

        const [customersRes, budgetsRes, conversionRes] = await Promise.all([
            fetch(endpoints.totalCustomers),
            fetch(endpoints.totalBudgets),
            fetch(endpoints.conversionRate),
        ]);

        if (!customersRes.ok || !budgetsRes.ok || !conversionRes.ok) {
            console.error("Uma ou mais chamadas à API do backend falharam.");
            return new NextResponse(
                JSON.stringify({
                    message: "Erro ao comunicar com o serviço de análise.",
                    errors: {
                        customers: { status: customersRes.status, text: await customersRes.text() },
                        budgets: { status: budgetsRes.status, text: await budgetsRes.text() },
                        conversion: { status: conversionRes.status, text: await conversionRes.text() },
                    }
                }),
                { status: 502 }
            );
        }

        const aggregatedData = {
            totalCustomers: await customersRes.json(),
            totalBudgets: await budgetsRes.json(),
            conversionRate: await conversionRes.json(),
        };

        return NextResponse.json(aggregatedData);

    } catch (error) {
        console.error("Erro crítico no endpoint /api/dashboard:", error);
        return new NextResponse(
            JSON.stringify({ message: "Erro interno do servidor." }),
            { status: 500 }
        );
    }
}