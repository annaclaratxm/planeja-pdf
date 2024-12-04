
/* eslint-disable @next/next/no-img-element */
"use client";
import Image from 'next/image';

interface HeaderProps {
    logo?: File | null
    year: number
}

export default function Header({ logo, year }: HeaderProps) {
    const file = logo ? URL.createObjectURL(logo) : '';
    return (
        <div className="p-6 text-center">
            {file && (
                <div className="mb-4">
                    <Image
                        src={file}
                        alt="Preview"
                        width={160}
                        height={160}
                        className="mx-auto"
                    />
                </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800">ORÇAMENTO / {year}</h1>
        </div>
    );
}