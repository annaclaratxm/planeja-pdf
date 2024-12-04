import { generatePdf } from '@/services/api/pdf-generator/actions';
import { PDF } from '@/services/api/pdf-generator/types';
import { GetFileFromR2 } from '@/services/bucket/cloudflare';
import { notFound } from 'next/navigation';
import BudgetDetails from '../components/budget-details';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}


export default async function BudgetPage({ params }: PageProps) {
    const { id } = await params;

    console.log('Generating PDF for ID:', id);
    const budget: PDF = await generatePdf(id);
    console.log('Generated PDF:', budget);

    if (!budget || !budget.user || !budget.user.setting || !budget.user.setting[0] || !budget.customer) {
        console.error('Budget not found or invalid structure:', budget);
        return notFound();
    }

    let logoSrc: File | undefined;

    if (budget.user.setting[0].logo) {
        console.log('Fetching logo from R2:', budget.user.setting[0].logo);
        logoSrc = await GetFileFromR2(budget.user.setting[0].logo);
        console.log('Fetched logo:', logoSrc);
    }

    return (
        <div>
            <BudgetDetails budget={budget} logoSrc={logoSrc} />
        </div>
    );
}