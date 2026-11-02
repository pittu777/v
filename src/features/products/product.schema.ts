import { z } from "zod";

const priceSchema = z.coerce
  .number()
  .finite("Enter a valid price")
  .positive("Price must be greater than zero")
  .max(99_999_999.99, "Price exceeds the supported limit")
  .refine(
    (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
    "Price must have no more than two decimal places",
  );

const stockSchema = z.coerce
  .number()
  .int("Stock must be a whole number")
  .nonnegative("Stock cannot be negative")
  .max(2_147_483_647, "Stock exceeds the supported limit");

export const productSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU must be 50 characters or fewer")
    .transform((value) => value.toUpperCase()),
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(150, "Product name must be 150 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer")
    .nullable()
    .optional()
    .transform((value) => value || null),
  price: priceSchema,
  stock: stockSchema,
  isActive: z.boolean().default(true),
});

export type ProductInput = z.output<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;

export const updateProductSchema = productSchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

export type UpdateProductInput = z.output<typeof updateProductSchema>;
