import { z } from 'zod';

export const orderStatusSchema = z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.number(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  total: z.number(),
  status: orderStatusSchema,
  createdAt: z.date(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
});
