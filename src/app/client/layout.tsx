import type { Metadata } from "next";

import localFont from "next/font/local";
import "../globals.css";
import MainNavBar from "./_components/main-nav-bar";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
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
                        <MainNavBar />
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