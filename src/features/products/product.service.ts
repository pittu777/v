
import "server-only";
import { ProductInput } from "./product.schema";
import { requireAdmin } from "../users/services/user.service";
import { prisma } from "@/src/lib/prisma";



export class ProductServiceError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN" | "DUPLICATE_PRODUCT",
    message: string,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

export async function createProduct(input: ProductInput) {
  // Authentication and authorization happen on the server.
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      throw new ProductServiceError("UNAUTHORIZED", "Sign in first");
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      throw new ProductServiceError(
        "FORBIDDEN",
        "Only administrators can create products",
      );
    }

    throw error;
  }

  const name = input.name.trim();

  const existingProduct = await prisma.product.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (existingProduct) {
    throw new ProductServiceError(
      "DUPLICATE_PRODUCT",
      "A product with this name already exists",
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: input.description?.trim() || null,
      price: input.price,
      stock: input.stock,
    },
  });

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt,
  };
}
