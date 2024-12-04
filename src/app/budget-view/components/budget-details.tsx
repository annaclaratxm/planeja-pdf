'use client';

import { PDF } from '@/services/api/pdf-generator/types';
import Categories from './categories';
import CustomerInfo from './customer-info';
import Deadlines from './deadlines';
import Footer from './footer';
import Header from './header';
import PaymentAndNotes from './payment-and-notes';
import Signature from './signature';

interface BudgetDetailsProps {
    budget: PDF
    logoSrc?: File | null
}

export default function BudgetDetails({ budget, logoSrc }: BudgetDetailsProps) {
    if (!budget?.user?.setting?.[0]?.paymentMethod || !budget?.customer) {
        throw new Error('Budget not found');
    }

    return (
        <div>
            <Header logo={logoSrc} year={new Date().getFullYear()} />
            <div className="p-6 space-y-6">
                <CustomerInfo name={budget.customer.name} phone={budget.customer.phone} />
                <Categories categories={budget.categories} />
                <div className="text-right font-bold text-lg">
                    Total geral do orçamento: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(budget.total)}
                </div>
                <PaymentAndNotes
                    paymentMethod={budget.user.setting[0].paymentMethod}
                    observation={budget.user.setting[0].observation}
                />
                <Deadlines
                    deliveryTimeDays={budget.user.setting[0].deliveryTimeDays}
                    budgetValidityDays={budget.user.setting[0].budgetValidityDays}
                />
                <Signature
                    companyName={budget.user.setting[0].companyName}
                    responsiblePerson={budget.user.setting[0].responsiblePerson}
                    phone={budget.user.setting[0].phone}
                />
            </div>
            <Footer
                address={`${budget.user.setting[0].street}, ${budget.user.setting[0].number}, ${budget.user.setting[0].neighborhood} - ${budget.user.setting[0].city} - ${budget.user.setting[0].state.toUpperCase()} / CEP ${budget.user.setting[0].zipCode}`}
                cnpj={budget.user.setting[0].cnpj}
            />
        </div>
    )
}


