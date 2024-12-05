"use client";

import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BudgetDetails from '../components/budget-details';
import Footer from '../components/footer';
import Header from '../components/header';
import PdfLayout from '../components/pdf-layout';
import { getLayoutData, LayoutData } from '../lib/getLayoutData';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const BudgetPage: React.FC<PageProps> = ({ params }) => {
    const [layout, setLayout] = useState<LayoutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { id } = await params;
                const data = await getLayoutData(id);
                setLayout(data);
            } catch (err) {
                setError('Erro ao carregar os dados: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Carregando orçamento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!layout) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-sm text-muted-foreground">Nenhum dado encontrado.</p>
            </div>
        );
    }

    return (
        <PdfLayout
            header={<Header logo={layout.header.imageUrl} year={new Date().getFullYear()} />}
            footer={<Footer cnpj={layout.footer.cnpj} address={layout.footer.address} />}
        >
            <BudgetDetails budget={layout.budget} />
        </PdfLayout>
    );
};

export default BudgetPage;
