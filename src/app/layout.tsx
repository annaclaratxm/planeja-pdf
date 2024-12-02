// src/app/layout.tsx
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import { ThemeProvider } from "./_components/theme-provider";
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
  title: "PlanejaPDF - Orçamentos Profissionais e Eficientes em PDF",
  description: "Crie orçamentos e PDFs profissionais em minutos com PlanejaPDF. Economize tempo, simplifique seu fluxo de trabalho e aumente sua produtividade com uma solução ágil e prática, ideal para empresas e freelancers.",
  keywords: "orçamentos, PDFs profissionais, criação de orçamentos, produtividade, automação de orçamentos, freelancers, empresas, PlanejaPDF",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#1a73e8",
  openGraph: {
    title: "PlanejaPDF - Orçamentos Profissionais e Eficientes em PDF",
    description: "Crie orçamentos e PDFs profissionais em minutos. Aumente sua produtividade e simplifique seu fluxo de trabalho com PlanejaPDF, a solução ideal para empresas e freelancers.",
    url: "https://planeja-pdf.vercel.app",
    siteName: "PlanejaPDF",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanejaPDF - Orçamentos Profissionais e Eficientes em PDF",
    description: "Crie orçamentos e PDFs profissionais em minutos. Aumente sua produtividade com PlanejaPDF, a solução ideal para freelancers e empresas.",
    site: "@PlanejaPDF",
    creator: "@PlanejaPDF",
  }
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}