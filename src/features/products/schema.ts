import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update
  title: z.string().min(3, "Il titolo deve avere almeno 3 caratteri."),
  description: z.string().optional().nullable(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Il prezzo deve essere un numero positivo.")
  ),
  compareAtPrice: z
    .preprocess(
      (a) => (a ? parseFloat(z.string().parse(a)) : undefined),
      z.number().positive("Il prezzo scontato deve essere positivo.").optional()
    )
    .nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
  type: z.enum(["PHYSICAL", "DIGITAL"]).default("PHYSICAL"),
  inventory: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().min(0, "La quantità in inventario non può essere negativa.")
  ),
  images: z.array(z.string().url("Immagine non valida")).optional().nullable(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;

// Schema per la validazione parziale (ad esempio per l'aggiornamento)
export const UpdateProductSchema = ProductSchema.partial();
