import { getBudgetDetails, getSettingByBudgetId } from '@/services/api/pdf-generator/actions';
import { BudgetDetail } from "@/services/api/pdf-generator/types";
import { GetFileFromR2 } from '@/services/bucket/cloudflare';
import { cache } from 'react';

export type LayoutData = {
    header: {
        imageUrl: string | null
    }
    budget: BudgetDetail
    footer: {
        cnpj: string
        address: string
    }
}
export const getLayoutData = cache(async (id: string): Promise<LayoutData> => {
    let setting;
    try {
        setting = await getSettingByBudgetId(id);
    } catch (error) {
        console.error('Error fetching setting:', error);
        setting = {}; // Set an empty object if setting fetch fails
    }

    const fetchedLogo = setting?.logo ? await GetFileFromR2(setting.logo) : null;
    const budget = await getBudgetDetails(id);
    const address = `${setting?.street}, ${setting?.number}, ${setting?.neighborhood} - ${setting?.city} - ${setting?.state.toUpperCase()} / CEP ${setting?.zipCode}` || '';
    const cnpj = setting?.cnpj || '';
    const convertedLogo = fetchedLogo ? URL.createObjectURL(fetchedLogo) : null;

    return {
        header: {
            imageUrl: convertedLogo
        },
        budget,
        footer: {
            cnpj,
            address
        }
    };
});

