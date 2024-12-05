'use client'

import { Card, CardContent } from "@/components/ui/card";
import { getUserName } from "@/services/api/user/actions";
import { ArrowDown, ArrowUp, FileText, Percent, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  const fetchUserName = useCallback(async () => {
    const name = await getUserName();
    setUserName(name);
  }, []);

  useEffect(() => {
    if (!userName) fetchUserName();
  }, [fetchUserName, userName]);

  return (
    <div className="w-full min-h-screen bg-[#0a192f]">
      <main className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Bem vindo, {userName}</h1>
          <h2 className="text-2xl text-white">Dashboard de dados</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#001f3d] border-[#003380]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-5 w-5" />
                <span>Clientes Cadastrados</span>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold text-white">1,234</span>
                <div className="flex items-center gap-1 mt-2 text-green-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm">+20,1% em relação ao mês anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#001f3d] border-[#003380]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400">
                <FileText className="h-5 w-5" />
                <span>Orçamentos Feitos</span>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold text-white">436</span>
                <div className="flex items-center gap-1 mt-2 text-green-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm">+20,1% em relação ao mês anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#001f3d] border-[#003380]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400">
                <FileText className="h-5 w-5" />
                <span>Orçamentos Exportados (PDF)</span>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold text-white">1,234</span>
                <div className="flex items-center gap-1 mt-2 text-green-500">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-sm">+20,1% em relação ao mês anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#001f3d] border-[#003380]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Percent className="h-5 w-5" />
                <span>Taxa de Conversão</span>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold text-white">66.3%</span>
                <div className="flex items-center gap-1 mt-2 text-red-500">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-sm">-2,3% em relação ao mês anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}