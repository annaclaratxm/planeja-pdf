'use client'

import { Card, CardContent } from "@/components/ui/card";
import { getUserName } from "@/services/api/user/actions";
import { ArrowDown, ArrowUp, FileText, Percent, Users, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";
import { AIChatWidget } from "./widget/components/ai-chat-widget";
import { DashboardData, fetchDashboardData } from "@/services/api/dashboard"; 

export default function DashboardPage() {
	const [userName, setUserName] = useState("");
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchInitialData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [name, analytics] = await Promise.all([
				getUserName(),
				fetchDashboardData()
			]);

			setUserName(name);
			setDashboardData(analytics);

		} catch (err: any) {
			console.error("Erro ao carregar dados da página:", err);
			setError("Não foi possível carregar os dados do dashboard.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchInitialData();
	}, [fetchInitialData]);

	const DashboardCard = ({ icon, title, value, change, isPositive }: {
		icon: React.ReactNode;
		title: string;
		value: string | number;
		change: number;
		isPositive: boolean;
	}) => (
		<Card className="bg-[#001f3d] border-[#003380]">
			<CardContent className="p-6">
				<div className="flex items-center gap-2 text-gray-400">
					{icon}
					<span>{title}</span>
				</div>
				<div className="mt-2">
					{isLoading ? (
						<Loader2 className="h-9 w-9 animate-spin text-gray-500" />
					) : (
						<>
							<span className="text-4xl font-bold text-white">{value}</span>
							<div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
								{isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
								<span className="text-sm">{(change || 0).toFixed(1)}% em relação ao mês anterior</span>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);

	if (error) {
		return <div className="w-full min-h-screen bg-[#0a192f] flex items-center justify-center text-red-500">{error}</div>;
	}

	return (
		<div className="w-full min-h-screen bg-[#0a192f]">
			<main className="p-6 space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-white">Bem vindo, {userName || '...'}</h1>
					<h2 className="text-2xl text-white">Dashboard de dados</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<DashboardCard
						icon={<Users className="h-5 w-5" />}
						title="Clientes Cadastrados"
						value={dashboardData?.totalCustomers.total_customers || 0}
						change={dashboardData?.totalCustomers.percentage_change || 0}
						isPositive={(dashboardData?.totalCustomers.percentage_change || 0) >= 0}
					/>
					<DashboardCard
						icon={<FileText className="h-5 w-5" />}
						title="Orçamentos Feitos"
						value={dashboardData?.totalBudgets.total_budgets || 0}
						change={dashboardData?.totalBudgets.percentage_change || 0}
						isPositive={(dashboardData?.totalBudgets.percentage_change || 0) >= 0}
					/>
					<DashboardCard
						icon={<Percent className="h-5 w-5" />}
						title="Taxa de Conversão"
						value={`${(dashboardData?.conversionRate.conversion_rate || 0).toFixed(1)}%`}
						change={dashboardData?.conversionRate.percentage_change || 0}
						isPositive={(dashboardData?.conversionRate.percentage_change || 0) >= 0}
					/>
				</div>
				<AIChatWidget />
			</main>
		</div>
	);
}