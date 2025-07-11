import { z } from 'zod';

export const upsertSettingsSchema = z.object({
    id: z.string().optional(),
    companyName: z.string(),
    cnpj: z.string(),
    street: z.string(),
    number: z.number(),
    zipCode: z.string(),
    state: z.string(),
    city: z.string(),
    phone: z.string(),
    responsiblePerson: z.string(),
    logo: z.string().optional().nullable(),
    paymentMethod: z.string().optional().nullable(),
    observation: z.string().optional().nullable(),
    deliveryTimeDays: z.number().optional().nullable(),
    budgetValidityDays: z.number().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    neighborhood: z.string().optional().nullable(),
});