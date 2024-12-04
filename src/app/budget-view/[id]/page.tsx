'use client';

import { generatePdf } from '@/services/api/pdf-generator/actions';
import { PDF } from '@/services/api/pdf-generator/types';
import { GetFileFromR2 } from '@/services/bucket/cloudflare';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import BudgetDetails from '../components/budget-details';

interface PageProps {
    params: {
        id: string;
    };
}

const BudgetView = (props: PageProps) => {
    const { params } = props;
    const [budget, setBudget] = useState<PDF | null>(null);
    const [logoSrc, setLogoSrc] = useState<File | undefined>();
    const [hasError, setHasError] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const { id } = params;

        const fetchBudget = async () => {
            try {
                const fetchedBudget = await generatePdf(id);

                if (!fetchedBudget || !fetchedBudget.user?.setting?.[0] || !fetchedBudget.customer) {
                    setHasError(true);
                    return;
                }

                setBudget(fetchedBudget);

                if (fetchedBudget.user.setting[0].logo && !logoSrc) {
                    const fetchedLogo = await GetFileFromR2(fetchedBudget.user.setting[0].logo);
                    setLogoSrc(fetchedLogo);
                }
            } catch (error) {
                console.error('Error fetching budget:', error);
                setHasError(true);
            }
        };
        if (params.id) {
            fetchBudget();
        }
    }, [params, logoSrc]);

    useEffect(() => {
        const loadImage = async () => {
            if (preview && !hasError) {
                try {
                    const imageUrl = await GetFileFromR2(preview);
                    setPreview(URL.createObjectURL(imageUrl));
                } catch (error) {
                    console.error('Failed to load image:', error);
                }
            }
        };
        loadImage();
    }, [preview, hasError]);

    if (hasError) {
        return notFound();
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            {budget ? (
                <BudgetDetails budget={budget} logoSrc={logoSrc} />
            ) : (
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading budget...</p>
                </div>
            )}
        </div>
    );
};

export default BudgetView;

