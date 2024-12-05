'use strict';

interface DeadlinesProps {
    deliveryTimeDays?: number | null
    budgetValidityDays?: number | null
}

export default function Deadlines({ deliveryTimeDays, budgetValidityDays }: DeadlinesProps) {
    const formatDate = (days: number) => {
        const date = new Date()
        date.setDate(date.getDate() + days)
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <div className="space-y-2 p-4 md:p-6 lg:p-8">
            <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">Prazos</h3>
            {deliveryTimeDays && (
                <div className="flex flex-col md:flex-row justify-between">
                    <span className="text-sm md:text-base lg:text-lg">Prazo de entrega:</span>
                    <span className="text-sm md:text-base lg:text-lg">{formatDate(deliveryTimeDays)}</span>
                </div>
            )}
            {budgetValidityDays && (
                <div className="flex flex-col md:flex-row justify-between">
                    <span className="text-sm md:text-base lg:text-lg">Validade deste orçamento:</span>
                    <span className="text-sm md:text-base lg:text-lg">{formatDate(budgetValidityDays)}</span>
                </div>
            )}
        </div>
    )
}
