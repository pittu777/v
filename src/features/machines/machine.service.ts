import "server-only";

import { requireUser } from "@/features/users/services/user.service";
import { prisma } from "@/lib/prisma";
import type { CreateMachineInput, UpdateMachineStatusInput } from "./machine.schema";

export class MachineServiceError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "VENDOR_REQUIRED" | "NOT_FOUND",
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

export async function getMyMachine(machineId: string) {
  const vendor = await requireVendor();
  const machine = await prisma.vendingMachine.findFirst({
    where: { id: machineId, vendorId: vendor.id },
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

  if (!machine) {
    throw new MachineServiceError("NOT_FOUND", "Machine not found");
  }

  return machine;
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

export async function updateMyMachine(machineId: string, input: CreateMachineInput) {
  const vendor = await requireVendor();

  try {
    return await prisma.vendingMachine.update({
      // The unique ID and owner are checked by the same database statement.
      where: { id: machineId, vendorId: vendor.id },
      data: {
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
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      throw new MachineServiceError("NOT_FOUND", "Machine not found");
    }

    throw error;
  }
}

export async function updateMyMachineStatus(
  machineId: string,
  input: UpdateMachineStatusInput,
) {
  const vendor = await requireVendor();

  try {
    return await prisma.vendingMachine.update({
      // Include the vendor in the write predicate so another vendor's machine
      // cannot be changed by guessing its ID.
      where: { id: machineId, vendorId: vendor.id },
      data: { status: input.status },
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
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      throw new MachineServiceError("NOT_FOUND", "Machine not found");
    }

    throw error;
  }
}
