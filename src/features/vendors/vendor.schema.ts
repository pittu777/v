import { z } from "zod";

export const createVendorSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(120, "Business name must be 120 characters or fewer"),
  contactPerson: z
    .string()
    .trim()
    .min(2, "Contact person must be at least 2 characters")
    .max(120, "Contact person must be 120 characters or fewer"),
  businessEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid business email address")
    .max(254, "Business email must be 254 characters or fewer"),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
