'use client';

import React from 'react';
import "../../reset.css";
import "./pdf.css";

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="bg-white rounded-lg w-full">
            {children}
        </main>
    );
}
