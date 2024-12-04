'use client';

import React from 'react';
import "./pdf.css";

export default function PdfLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 box-border">
            <main className="bg-white shadow-md rounded-lg w-full max-w-4xl p-8">
                {children}
            </main>
        </div>
    );
}
