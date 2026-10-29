import { z } from "zod";

export const createMachineSchema = z.object({
  machineCode: z
    .string()
    .trim()
    .min(1, "Machine code is required")
    .max(40, "Machine code must be 40 characters or fewer"),
  name: z
    .string()
    .trim()
    .min(2, "Machine name must be at least 2 characters")
    .max(120, "Machine name must be 120 characters or fewer"),
  location: z
    .string()
    .trim()
    .max(240, "Location must be 240 characters or fewer")
    .optional()
    .transform((value) => value || undefined),
});

export type CreateMachineInput = z.infer<typeof createMachineSchema>;

export const updateMachineStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UpdateMachineStatusInput = z.infer<typeof updateMachineStatusSchema>;
