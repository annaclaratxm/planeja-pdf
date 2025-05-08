// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./_components/theme-provider";
import ChatWrapper from "./_components/ChatWrapper";  // ← nosso wrapper
import "./globals.css";

// configuração das fontes locais
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
  description:
    "Crie orçamentos e PDFs profissionais em minutos com PlanejaPDF. Economize tempo, simplifique seu fluxo de trabalho e aumente sua produtividade com uma solução ágil e prática, ideal para empresas e freelancers.",
  keywords:
    "orçamentos, PDFs, móveis planejados, pedreiros, eletricistas, pintores, vidraçaria, marcenaria, reformas, construção, produtividade",
  robots: "index, follow",
  openGraph: {
    title: "PlanejaPDF - Orçamentos Profissionais em PDF",
    description:
      "Crie orçamentos e PDFs profissionais em minutos com PlanejaPDF.",
    url: "https://planeja-pdf.vercel.app",
    siteName: "PlanejaPDF",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanejaPDF - Orçamentos Profissionais em PDF",
    description:
      "Crie orçamentos e PDFs profissionais em minutos com PlanejaPDF.",
    site: "@PlanejaPDF",
    creator: "@PlanejaPDF",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
