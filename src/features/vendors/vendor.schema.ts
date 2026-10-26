import { z } from "zod";

export const createVendorSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(120, "Business name must be 120 characters or fewer"),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
