'use strict';
interface FooterProps {
  address: string
  cnpj: string
}

export default function Footer({ address, cnpj }: FooterProps) {
  {
    return (
      <div className="bg-gray-100 p-2 text-center text-xs">
        <p className="mb-1">{address}</p>
        <p>CNPJ: {cnpj}</p>
      </div>
    )
  }
}