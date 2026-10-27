import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/features/users/services/user.service";
import type { CreateVendorInput } from "./vendor.schema";

export class VendorServiceError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "ALREADY_EXISTS" | "NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "VendorServiceError";
  }
}

async function getAuthenticatedUser() {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      throw new VendorServiceError("UNAUTHORIZED", "Sign in to continue");
    }
    throw error;
  }
}

export async function getMyVendor() {
  const user = await getAuthenticatedUser();
  const vendor = await prisma.vendor.findUnique({
    where: { clerkId: user.clerkId },
    select: {
      id: true,
      businessName: true,
      contactPerson: true,
      businessEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!vendor) {
    throw new VendorServiceError("NOT_FOUND", "Vendor profile not found");
  }

  return vendor;
}

export async function createMyVendor(input: CreateVendorInput) {
  const user = await getAuthenticatedUser();

  // A client request must never promote an administrator or an unknown role.
  if (user.role !== "user" && user.role !== "vendor") {
    throw new VendorServiceError(
      "FORBIDDEN",
      "This account cannot create a vendor profile",
    );
  }

  const existingVendor = await prisma.vendor.findUnique({
    where: { clerkId: user.clerkId },
    select: { id: true },
  });

  if (existingVendor) {
    throw new VendorServiceError(
      "ALREADY_EXISTS",
      "A vendor profile already exists for this account",
    );
  }

  try {
    return await prisma.$transaction(async (transaction) => {
      const roleUpdate = await transaction.user.updateMany({
        where: {
          clerkId: user.clerkId,
          role: { in: ["user", "vendor"] },
        },
        data: { role: "vendor" },
      });

      if (roleUpdate.count !== 1) {
        throw new VendorServiceError(
          "FORBIDDEN",
          "This account cannot create a vendor profile",
        );
      }

      return transaction.vendor.create({
        data: {
          clerkId: user.clerkId,
          businessName: input.businessName,
          contactPerson: input.contactPerson,
          businessEmail: input.businessEmail,
        },
        select: {
          id: true,
          businessName: true,
          contactPerson: true,
          businessEmail: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  } catch (error) {
    // The unique constraint also handles two onboarding requests racing.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new VendorServiceError(
        "ALREADY_EXISTS",
        "A vendor profile already exists for this account",
      );
    }

    throw error;
  }
}
