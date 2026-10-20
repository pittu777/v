
import { z } from "zod";

export const productSchema = z.object({
  sku: z
  .string()
  .trim()
  .min(1, "SKU is required")
  .max(50, "SKU must be 50 char or fewer")
  .transform((val)=> val.toUpperCase()),
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





export const updateProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(150, "Product name must be 150 characters or fewer")
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000, "Description is too long")
      .nullable()
      .optional(),

    price: z.coerce
      .number()
      .finite()
      .positive("Price must be greater than zero")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

