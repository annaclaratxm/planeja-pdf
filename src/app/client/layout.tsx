// src/app/client/layout.tsx
'use client'

import dynamic from "next/dynamic";
import localFont from "next/font/local";
import "../globals.css";
import MainNavBar from "./_components/main-nav-bar";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

// Fonte Geist Sans
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Fonte Geist Mono
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ChatWrapper é um Client Component importado dinamicamente
const ChatWrapper = dynamic(
  () => import("../_components/ChatWrapper"),
  { ssr: false } // só renderiza no cliente
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      localStorage.setItem("user_id", session.user.id);
    }
  }, [session]);

  return (
    <>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a192f] text-white min-h-screen flex flex-col`}
      >
        <header className="bg-[#112240] py-4 px-6 shadow-md">
          <MainNavBar />
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-[#112240] py-4 px-6 text-center">
          <p>&copy; 2024 PlanejaPDF. Todos os direitos reservados.</p>
        </footer>
      </div>

      {/* Chat disponível em todas as rotas /client/* */}
      <ChatWrapper />
    </>
  );
}
