'use client'

import { getUserName } from "@/services/api/user/actions";
import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AIChatWidget } from "./widget/components/ai-chat-widget";
import { DashboardStats } from "./_components/dashboard-stats";

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
          <DashboardStats />
          <AIChatWidget />
        </div>
      </main>
    </div>
  );
}