interface FooterProps {
  address: string
  cnpj: string
}

export default function Footer({ address, cnpj }: FooterProps) {
  {
    return (
      <div className="bg-gray-100 p-4 text-center text-sm">
        <p>{address}</p>
        <p>CNPJ: {cnpj}</p>
      </div>
    )
  }
}