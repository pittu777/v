
"use server";

import { productSchema } from "./product.schema";
import { createProduct, ProductServiceError } from "./product.service";



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
