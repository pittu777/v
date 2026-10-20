
"use server";

import { productSchema, updateProductSchema } from "./product.schema";
import { createProduct, ProductServiceError, updateProduct } from "./product.service";



export async function createProductAction(input: unknown) {
  const result = productSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      error: {
        code: "VALIDATION_ERROR",
        message: "Please check the product details",
        fieldErrors: result.error.flatten().fieldErrors,
      },
    };
  }

  try {
    const product = await createProduct(result.data);

    return {
      success: true as const,
      data: product,
    };
  } catch (error) {
    if (error instanceof ProductServiceError) {
      return {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    console.error("Create product action failed");

    return {
      success: false as const,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
      },
    };
  }
}





export async function updateProductAction(id: string, input: unknown) {
  // Validate the product ID
  if (!id || !id.trim()) {
    return {
      success: false as const,
      error: {
        code: "VALIDATION_ERROR",
        message: "Product ID is required",
      },
    };
  }

  // Validate incoming product data
  const parsed = updateProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: {
        code: "VALIDATION_ERROR",
        message: "Please check the product details",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  try {
    const product = await updateProduct(id, parsed.data);

    return {
      success: true as const,
      data: product,
    };
  } catch (error) {
    if (error instanceof ProductServiceError) {
      return {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }

    console.error("Update product action failed");

    return {
      success: false as const,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong. Please try again.",
      },
    };
  }
}