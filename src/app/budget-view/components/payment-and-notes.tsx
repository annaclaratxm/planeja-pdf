
interface PaymentAndNotesProps {
    paymentMethod?: string | null
    observation?: string | null
}

export default function PaymentAndNotes({ paymentMethod, observation }: PaymentAndNotesProps) {
    return (
        <div className="space-y-4">
            {paymentMethod && (
                <div>
                    <h3 className="font-semibold">Formas de pagamento</h3>
                    <p>{paymentMethod}</p>
                </div>
            )}
            {observation && (
                <div>
                    <h3 className="font-semibold">Observações</h3>
                    <p>{observation}</p>
                </div>
            )}
        </div>
    );
}