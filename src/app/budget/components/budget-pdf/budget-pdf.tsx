'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { formatCurrency } from '../../lib/utils'
import { LayoutData } from '../../services/api/pdf-generator/getLayoutData'

interface BudgetPDFProps {
  data: LayoutData
}

export default function BudgetPDF({ data }: BudgetPDFProps) {
  const { header, budget, footer } = data
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current
      const pages = Math.ceil(content.scrollHeight / 1123) // A4 height in pixels at 96 DPI
      content.style.setProperty('--page-count', String(pages))
    }
  }, [data])

  if (!budget) {
    return <div>Carregando...</div>
  }

  return (
    <div className="bg-white min-h-screen p-8 print:p-0">
      <div
        ref={contentRef}
        className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none"
      >
        <div className="flex flex-col min-h-[297mm] text-black">
          {/* Fixed Header */}
          <header className="print:fixed print:top-0 print:left-0 print:right-0 p-8 print:p-6 bg-white">
            <div className="flex flex-col items-center gap-4">
              {header.imageUrl && (
                <Image
                  src={typeof header.imageUrl === 'string' ? header.imageUrl : URL.createObjectURL(header.imageUrl)}
                  alt="Logo"
                  width={200}
                  height={100}
                  className="object-contain"
                />
              )}
              <h1 className="text-2xl font-bold">ORÇAMENTO / {new Date().getFullYear()}</h1>
            </div>
          </header>

          {/* Content with top margin for fixed header */}
          <main className="p-8 print:p-6 print:mt-[150px] print:mb-[100px]">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 mb-8 border-b pb-4">
              <div>
                <strong>Cliente:</strong> {budget.customer?.name}
              </div>
              <div>
                <strong>Fone:</strong> {budget.customer?.phone}
              </div>
            </div>

            {/* Categories and Products */}
            {budget.categories.map((category, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-lg font-bold mb-4">{category.name}</h2>
                <div className="space-y-2">
                  {category.products.map((product, productIndex) => (
                    <div key={productIndex} className="flex justify-between">
                      <span>• {product.name}</span>
                      <span>{formatCurrency(product.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-2 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total {category.name}:</span>
                    <span>
                      {formatCurrency(
                        category.products.reduce((acc, product) => acc + product.price, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="text-right font-bold text-lg mb-8">
              Total geral do orçamento: {formatCurrency(budget.total)}
            </div>

            {/* Payment Terms */}
            <div className="mb-8">
              <h3 className="font-bold mb-2">Formas de Pagamento</h3>
              <p>{budget.user.setting[0].paymentMethod}</p>
            </div>

            {/* Observations */}
            <div className="mb-8">
              <h3 className="font-bold mb-2">Observações</h3>
              <p>{budget.user.setting[0].observation}</p>
            </div>

            {/* Deadlines */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Prazo de entrega:</strong>{' '}
                {budget.user.setting[0].deliveryTimeDays &&
                  format(new Date(Date.now() + Number(budget.user.setting[0].deliveryTimeDays) * 24 * 60 * 60 * 1000), "dd'/'MM'/'yyyy", { locale: ptBR })}
              </div>
              <div>
                <strong>Validade deste orçamento:</strong>{' '}
                {budget.user.setting[0].budgetValidityDays &&
                  format(new Date(Date.now() + Number(budget.user.setting[0].budgetValidityDays) * 24 * 60 * 60 * 1000), "dd'/'MM'/'yyyy", { locale: ptBR })}
              </div>
            </div>

            {/* Company Info */}
            <div className="mt-8 text-center pt-10">
              <div className="border-t border-black w-3/4 mx-auto my-4"></div>
              <p>{budget.user.setting[0].companyName}</p>
              <p>{budget.user.name}</p>
              <p>{budget.user.setting[0].phone}</p>
            </div>
          </main>

          {/* Fixed Footer */}
          <footer className="print:fixed print:bottom-0 print:left-0 print:right-0 p-8 print:p-6 text-center text-sm bg-white">
            <p>{footer.address}</p>
            <p>CNPJ: {footer.cnpj}</p>
            <div className="print:hidden mt-2 text-xs text-gray-500">
              Página <span className="page-number"></span> de{' '}
              <span className="page-count"></span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
