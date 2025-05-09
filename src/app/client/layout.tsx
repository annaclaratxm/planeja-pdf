"use client";

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

const ChatWrapper = dynamic(
  () => import("../_components/ChatWrapper"),
  { ssr: true }
);

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      // Salva o userId no localStorage
      localStorage.setItem("userId", session.user.id);
    } else {
      console.log("User ID não encontrado na sessão.");
    }
  }, [session]);

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a192f] text-white min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
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
      </body>
    </html>
  );
}
