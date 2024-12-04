
interface DeadlinesProps {
    deliveryTimeDays?: number | null
    budgetValidityDays?: number | null
}

export default function Deadlines({ deliveryTimeDays, budgetValidityDays }: DeadlinesProps) {
    {
        const formatDate = (days: number) => {
            const date = new Date()
            date.setDate(date.getDate() + days)
            return date.toLocaleDateString('pt-BR')
        }

        return (
            <div className="space-y-2">
                <h3 className="font-semibold">Prazos</h3>
                {deliveryTimeDays && (
                    <div className="flex justify-between">
                        <span>Prazo de entrega:</span>
                        <span>{formatDate(deliveryTimeDays)}</span>
                    </div>
                )}
                {budgetValidityDays && (
                    <div className="flex justify-between">
                        <span>Validade deste orçamento:</span>
                        <span>{formatDate(budgetValidityDays)}</span>
                    </div>
                )}
            </div>
        )
    }
}