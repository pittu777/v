import "server-only";

import { requireUser } from "@/features/users/services/user.service";
import { prisma } from "@/lib/prisma";
import type { CreateMachineInput } from "./machine.schema";

export class MachineServiceError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "VENDOR_REQUIRED",
    message: string,
  ) {
    super(message);
    this.name = "MachineServiceError";
  }
}

async function requireVendor() {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      throw new MachineServiceError("UNAUTHORIZED", "Sign in to continue");
    }
    throw error;
  }

  const vendor = await prisma.vendor.findUnique({
    where: { clerkId: user.clerkId },
    select: { id: true },
  });

  if (!vendor) {
    throw new MachineServiceError(
      "VENDOR_REQUIRED",
      "Complete vendor onboarding before managing machines",
    );
  }

  if (user.role !== "vendor") {
    throw new MachineServiceError(
      "FORBIDDEN",
      "This account cannot manage vendor machines",
    );
  }

  return vendor;
}

export async function getMyMachines() {
  const vendor = await requireVendor();

  return prisma.vendingMachine.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      machineCode: true,
      name: true,
      location: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createMyMachine(input: CreateMachineInput) {
  const vendor = await requireVendor();

  return prisma.vendingMachine.create({
    data: {
      vendorId: vendor.id,
      machineCode: input.machineCode,
      name: input.name,
      location: input.location ?? null,
    },
    select: {
      id: true,
      machineCode: true,
      name: true,
      location: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
