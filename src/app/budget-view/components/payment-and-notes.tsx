'use strict';

interface PaymentAndNotesProps {
    paymentMethod?: string | null
    observation?: string | null
}

export default function PaymentAndNotes({ paymentMethod, observation }: PaymentAndNotesProps) {
    return (
        <div className="space-y-4 p-4 md:p-6 lg:p-8">
            {paymentMethod && (
                <div className="md:flex md:items-center md:space-x-4">
                    <h3 className="font-semibold text-lg md:text-xl">Formas de pagamento</h3>
                    <p className="text-sm md:text-base">{paymentMethod}</p>
                </div>
            )}
            {observation && (
                <div className="md:flex md:items-center md:space-x-4">
                    <h3 className="font-semibold text-lg md:text-xl">Observações</h3>
                    <p className="text-sm md:text-base">{observation}</p>
                </div>
            )}
        </div>
    );
}