import { z } from 'zod';

export const payoutSchema = z.object({
  amount: z.coerce.number().min(10, 'Importo minimo 10€'),
  method: z.enum(['PAYPAL', 'BANK_TRANSFER']),
});

export type PayoutRequest = z.infer<typeof payoutSchema>;
