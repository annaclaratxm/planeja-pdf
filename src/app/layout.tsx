import type { Metadata } from "next";

import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PlanejaPDF",
  description: "Planeje seus PDFs com facilidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a192f] text-white min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-[#112240] py-4 px-6 shadow-md">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-2xl font-bold">PlanejaPDF</div>
              <div className="space-x-4">
                <a href="/app" className="hover:text-indigo-300 transition-colors">Início</a>
                <a href="/app/budget" className="hover:text-indigo-300 transition-colors">Orçamentos</a>
                <a href="/app/customer" className="hover:text-indigo-300 transition-colors">Clientes</a>
                <a href="/app/settings" className="hover:text-indigo-300 transition-colors">Configurações</a>
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors">
                  Sair
                </button>
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-[#112240] py-4 px-6 text-center">
            <p>&copy; 2024 PlanejaPDF. Todos os direitos reservados.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}