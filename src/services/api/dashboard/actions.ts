'use server';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export interface DashboardStats {
  totalCustomers: number;
  totalBudgets: number;
  totalExportedBudgets: number;
  conversionRate: number;
  customerGrowth: number;
  budgetGrowth: number;
  exportGrowth: number;
  conversionChange: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("User is not logged");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userId = user.id;

  // Data atual e mês anterior
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // Total de clientes
  const totalCustomers = await prisma.customer.count({
    where: { userId }
  });

  // Total de orçamentos
  const totalBudgets = await prisma.budget.count({
    where: { userId }
  });

  // Orçamentos do mês atual
  const currentMonthBudgets = await prisma.budget.count({
    where: {
      userId,
      createdAt: {
        gte: currentMonthStart
      }
    }
  });

  // Orçamentos do mês anterior
  const lastMonthBudgets = await prisma.budget.count({
    where: {
      userId,
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd
      }
    }
  });

  // Orçamentos aceitos (assumindo que representa exportados)
  const totalExportedBudgets = await prisma.budget.count({
    where: {
      userId,
      status: 'Aceito'
    }
  });

  // Orçamentos aceitos do mês atual
  const currentMonthExported = await prisma.budget.count({
    where: {
      userId,
      status: 'Aceito',
      createdAt: {
        gte: currentMonthStart
      }
    }
  });

  // Orçamentos aceitos do mês anterior
  const lastMonthExported = await prisma.budget.count({
    where: {
      userId,
      status: 'Aceito',
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd
      }
    }
  });

  // Cálculo da taxa de conversão
  const conversionRate = totalBudgets > 0 ? (totalExportedBudgets / totalBudgets) * 100 : 0;
  
  // Taxa de conversão do mês anterior
  const lastMonthConversion = lastMonthBudgets > 0 ? (lastMonthExported / lastMonthBudgets) * 100 : 0;

  // Cálculos de crescimento
  const customerGrowth = 0; // Como não temos createdAt no Customer, vamos usar 0 por padrão
  const budgetGrowth = lastMonthBudgets > 0 ? ((currentMonthBudgets - lastMonthBudgets) / lastMonthBudgets) * 100 : 0;
  const exportGrowth = lastMonthExported > 0 ? ((currentMonthExported - lastMonthExported) / lastMonthExported) * 100 : 0;
  const conversionChange = lastMonthConversion > 0 ? conversionRate - lastMonthConversion : 0;

  return {
    totalCustomers,
    totalBudgets,
    totalExportedBudgets,
    conversionRate: Math.round(conversionRate * 10) / 10, // Uma casa decimal
    customerGrowth: Math.round(customerGrowth * 10) / 10,
    budgetGrowth: Math.round(budgetGrowth * 10) / 10,
    exportGrowth: Math.round(exportGrowth * 10) / 10,
    conversionChange: Math.round(conversionChange * 10) / 10
  };
}
