'use strict';
/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';

interface HeaderProps {
    logo?: File | null
    year: number
}

export default function Header({ logo, year }: HeaderProps) {
    const file = logo ? URL.createObjectURL(logo) : '';
    return (
        <div className="p-2 text-center">
            {file && (
                <div className="mb-2">
                    <Image
                        src={file}
                        alt="Preview"
                        width={120}
                        height={120}
                        className="mx-auto"
                    />
                </div>
            )}
            <h1 className="text-xl font-bold text-gray-800">ORÇAMENTO / {year}</h1> {/* Reduzi o tamanho do texto */}
        </div>
    );
}