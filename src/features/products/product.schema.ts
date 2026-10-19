
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),

  description: z.string().trim().optional(),

  price: z.coerce
    .number()
    .finite()
    .positive("Price must be greater than zero"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),
});

export type ProductInput = z.infer<typeof productSchema>;
