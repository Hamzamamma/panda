import { z } from 'zod';

export const MembershipTierSchema = z.object({
  name: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Il prezzo non può essere negativo'),
  currency: z.string().default('EUR'),
  benefits: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
});

export type MembershipTierFormValues = z.infer<typeof MembershipTierSchema>;