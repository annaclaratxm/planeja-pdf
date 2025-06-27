
export interface DashboardData {
    totalCustomers: { total_customers: number; percentage_change: number; };
    totalBudgets: { total_budgets: number; percentage_change: number; };
    conversionRate: { conversion_rate: number; percentage_change: number; };
}

export async function fetchDashboardData(): Promise<DashboardData> {
    try {
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
            throw new Error(`Ocorreu um erro ao buscar os dados: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erro no serviço do frontend (fetchDashboardData):", error);
        throw error; 
    }
}