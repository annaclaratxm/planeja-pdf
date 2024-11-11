import { z } from 'zod'

export const upsertCustomerSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional().nullable(),
    birthdate: z.date().optional().nullable(),
    userId: z.string().optional()
})

export const deleteCustomerSchema = z.object({
    id: z.string(),
})

/*
 id        String    @id @default(cuid())
  name      String
  phone     String
  email     String?
  birthdate DateTime?
  userId    String

*/