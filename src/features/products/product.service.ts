
import "server-only";
import { ProductInput, UpdateProductInput, updateProductSchema } from "./product.schema";
import { requireVendor } from "../users/services/user.service";
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


async function getAuthenticatedVendor() {
  try {
    return await requireVendor();
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
        "You must have a vendor profile to manage products",
      );
    }

    throw error;
  }
}


export async function listProducts() {
  const vendor = await requireVendor();
  const products = await prisma.product.findMany({
    where: {
      vendorId: vendor.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products.map((product) => ({
    ...product,
    price: product.price.toString(),
  }));
}

export async function createProduct(input: ProductInput) {
  const vendor = await getAuthenticatedVendor();

  const sku = input.sku.trim().toUpperCase();

  try {
    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        sku,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        price: input.price,
        stock: input.stock,
      },
    });

    return {
      id: product.id,
      vendorId: product.vendorId,
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };
  } catch (error) {
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

// UPDATE PRODUCT
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
) {
  const vendor = await getAuthenticatedVendor();

  const validated = updateProductSchema.safeParse(input);

  if (!validated.success) {
    throw new ProductServiceError(
      "VALIDATION_ERROR",
      "Invalid product data",
    );
  }

  // Update only when the product belongs to this vendor.
  const result = await prisma.product.updateMany({
    where: {
      id,
      vendorId: vendor.id,
    },
    data: validated.data,
  });

  if (result.count === 0) {
    throw new ProductServiceError(
      "NOT_FOUND",
      "Product not found",
    );
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      vendorId: vendor.id,
    },
  });

  if (!product) {
    throw new ProductServiceError(
      "NOT_FOUND",
      "Product not found",
    );
  }

  return {
    id: product.id,
    vendorId: product.vendorId,
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    isActive: product.isActive,
    updatedAt: product.updatedAt,
  };
}




export async function deleteProduct(id: string){
  const vendor = await getAuthenticatedVendor();

  const result = await prisma.product.deleteMany({
    where:{
      id,
      vendorId: vendor.id,
    },
  })

  if(result.count===0){
    throw new ProductServiceError(
      "NOT_FOUND",
      "Product not Found",
    );
  }

  return {
    message: "Product deleted successfully",
  }

}