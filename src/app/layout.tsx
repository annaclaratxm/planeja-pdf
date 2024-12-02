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
  keywords: "orçamentos, PDFs, móveis planejados, pedreiros, eletricistas, pintores, vidraçaria, madereiras, orçamentos para serviços, orçamentos para vendas, orçamentos para reformas, orçamento de construção, orçamento de pintura, orçamento de instalação elétrica, orçamento de vidros e espelhos, orçamento de móveis sob medida, serviços personalizados, orçamentos de marcenaria, orçamento de obra, orçamento de reformas residenciais, orçamento para prestadores de serviços, orçamento para empresas, orçamento para fornecedores, orçamento de serviços de instalação, estimativa de custos, planejamento de obra, planejamento de serviços, orçamento detalhado, ferramentas de orçamentos, geração de orçamentos online, produtividade na geração de orçamentos, orçamentos rápidos, automação de orçamentos, soluções para prestadores de serviços, orçamento para reformas comerciais, orçamentos para manutenção predial, orçamento de reparos e instalações, orçamentos de construção civil, orçamento para serviços de jardinagem, orçamento de segurança residencial, orçamento para pequenos negócios, orçamento para freelancers, orçamentos de serviços de encanamento, orçamentos de serviços de eletrônica, orçamentos de sistemas de segurança, orçamentos para reformas de cozinha, orçamento para reformas de banheiro, orçamento de serviços de pintura externa, orçamentos de serviços de pintura interna, orçamento de reparos elétricos, orçamentos de design de interiores, orçamento para reformas de apartamento, orçamentos de serviços de limpeza, orçamento para reformas de escritórios, orçamentos de serviços de ar condicionado, orçamentos para reformas de imóveis comerciais, orçamento para reformas de casas, orçamento para reformas de lojas, orçamentos de serviços de paisagismo, orçamentos de serviços de móveis e decoração, orçamentos de serviços de encanadores, orçamentos de serviços de marcenaria, orçamento para serviços de serralheria, orçamento para serviços de pedreiro, orçamento de reformas de fachadas, orçamentos de serviços de impermeabilização, orçamento para obras de infraestrutura, orçamento de pavimentação, orçamentos para reformas de imóveis antigos, orçamentos de instalações elétricas e hidráulicas, orçamentos de serviços de pintura de fachadas, orçamentos de serviços de impermeabilização de telhados, orçamento de serviços de poda e jardinagem, orçamento de serviços de limpeza pós-obra, orçamento para reformas de ambientes comerciais, orçamento de reparo de sistemas elétricos, orçamento para personalização de móveis, orçamentos de reformas de casas antigas, orçamento para obras de construção de casas, orçamentos de reformas de muros e cercas, orçamentos de reformas de pisos e revestimentos, orçamento para construção de piscinas, orçamentos de reformas de áreas externas, orçamento para ampliação de imóveis, orçamentos de reformas de sótãos e porões, orçamento para reformas de garagens, orçamento para reformas de telhados, orçamentos de instalações de sistemas de automação residencial, orçamentos de serviços de climatização, orçamentos para reformas de galpões e armazéns, orçamentos de serviços de instalação de móveis planejados, orçamento de sistemas de energia solar, orçamento para reformas de casas populares, orçamentos de reformas de lofts e apartamentos modernos, orçamento para reformas de imóveis de luxo",
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