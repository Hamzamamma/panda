import { z } from "zod";

export const DiscountSchema = z.object({
  code: z
    .string()
    .min(3, "Il codice deve avere almeno 3 caratteri")
    .regex(/^[A-Z0-9]+$/, "Solo lettere maiuscole e numeri"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Il valore deve essere positivo")
  ),
  maxUses: z.preprocess(
    (a) => (a ? parseInt(z.string().parse(a), 10) : undefined),
    z.number().int().positive().optional()
  ),
  expiresAt: z.date().optional(),
  active: z.boolean().default(true),
});

export type DiscountFormValues = z.infer<typeof DiscountSchema>;
