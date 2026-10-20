
import "server-only";
import { ProductInput, UpdateProductInput, updateProductSchema } from "./product.schema";
import { requireAdmin } from "../users/services/user.service";
import { prisma } from "@/lib/prisma";



export class ProductServiceError extends Error {
  constructor(
    public code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "DUPLICATE_PRODUCT"
      | "NOT_FOUND"
      | "VALIDATION_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}


export async function createProduct(input: ProductInput) {
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

  const sku = input.sku.trim().toUpperCase();

  try {
    const product = await prisma.product.create({
      data: {
        sku,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        price: input.price,
        stock: input.stock,
      },
    });

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };
  } catch (error) {
    // PostgreSQL unique-constraint violation.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ProductServiceError(
        "DUPLICATE_PRODUCT",
        "This SKU is already in use",
      );
    }

    throw error;
  }
}



// update product


export async function updateProduct(
  id: string,
  input: UpdateProductInput,
) {
  // 1. Check authentication and admin permissions
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      throw new ProductServiceError(
        "UNAUTHORIZED",
        "Please sign in to continue",
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      throw new ProductServiceError(
        "FORBIDDEN",
        "Only administrators can update products",
      );
    }

    throw error;
  }

  // 2. Validate the input
  const validated = updateProductSchema.safeParse(input);

  if (!validated.success) {
    throw new ProductServiceError(
      "VALIDATION_ERROR",
      "Invalid product data",
    );
  }

  // 3. Check whether the product exists
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new ProductServiceError("NOT_FOUND", "Product not found");
  }

  // 4. Update the product
  const product = await prisma.product.update({
    where: { id },
    data: validated.data,
  });

  // 5. Return a serializable response
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    isActive: product.isActive,
    updatedAt: product.updatedAt,
  };
}
