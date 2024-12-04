import localFont from "next/font/local";
import "./pdf.css";

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

export default function PdfLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a192f] text-white min-h-screen flex items-center justify-center`}
            >
                <div className="flex flex-col" style={{ width: '210mm', height: '297mm', padding: '20mm', boxSizing: 'border-box' }}>
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
