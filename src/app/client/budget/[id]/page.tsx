import { getBudgetById } from '@/services/api/budget/actions';
import { getUserCustomers } from '@/services/api/customer/actions';
import BudgetForm from '../components/budget-form';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BudgetPage({ params }: PageProps) {
    const resolvedParams = await params;
    const budget = resolvedParams.id !== 'new' ? await getBudgetById(resolvedParams.id) : null;
    const dataCustomer = await getUserCustomers();

    return (
        <div className="container mx-auto p-6">
            <BudgetForm initialData={budget} dataCustomer={dataCustomer} />
        </div>
    )
}
