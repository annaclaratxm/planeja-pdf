import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ArrowDown, ArrowUp, FileText, Percent, Users } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: number;
  changeText: string;
}

function StatCard({ icon, title, value, change, changeText }: StatCardProps) {
  const isPositive = change >= 0;
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="bg-[#001f3d] border-[#003380]">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-gray-400">
          {icon}
          <span>{title}</span>
        </div>
        <div className="mt-2">
          <span className="text-4xl font-bold text-white">{value}</span>
          <div className={`flex items-center gap-1 mt-2 ${changeColor}`}>
            <ArrowIcon className="h-4 w-4" />
            <span className="text-sm">{changeText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <>
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-[#001f3d] border-[#003380]">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-5 bg-gray-600 rounded"></div>
                  <div className="h-4 w-32 bg-gray-600 rounded"></div>
                </div>
                <div className="h-10 w-24 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-600 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <>
        <Card className="bg-[#001f3d] border-[#003380] col-span-full">
          <CardContent className="p-6">
            <div className="text-red-500 text-center">
              <p>Erro ao carregar estatísticas: {error}</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <StatCard
        icon={<Users className="h-5 w-5" />}
        title="Clientes Cadastrados"
        value={stats.totalCustomers.toLocaleString('pt-BR')}
        change={stats.customerGrowth}
        changeText={`${stats.customerGrowth >= 0 ? '+' : ''}${stats.customerGrowth}% em relação ao mês anterior`}
      />
      
      <StatCard
        icon={<FileText className="h-5 w-5" />}
        title="Orçamentos Feitos"
        value={stats.totalBudgets.toLocaleString('pt-BR')}
        change={stats.budgetGrowth}
        changeText={`${stats.budgetGrowth >= 0 ? '+' : ''}${stats.budgetGrowth}% em relação ao mês anterior`}
      />
      
      <StatCard
        icon={<FileText className="h-5 w-5" />}
        title="Orçamentos Exportados (PDF)"
        value={stats.totalExportedBudgets.toLocaleString('pt-BR')}
        change={stats.exportGrowth}
        changeText={`${stats.exportGrowth >= 0 ? '+' : ''}${stats.exportGrowth}% em relação ao mês anterior`}
      />
      
      <StatCard
        icon={<Percent className="h-5 w-5" />}
        title="Taxa de Conversão"
        value={`${stats.conversionRate}%`}
        change={stats.conversionChange}
        changeText={`${stats.conversionChange >= 0 ? '+' : ''}${stats.conversionChange}% em relação ao mês anterior`}
      />
    </>
  );
}
