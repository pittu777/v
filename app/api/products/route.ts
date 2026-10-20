
import { productSchema } from "@/features/products/product.schema";
import { createProduct, ProductServiceError } from "@/features/products/product.service";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: products.map((product) => ({
        ...product,
        price: product.price.toString(),
      })),
    });
  } catch (error) {
    console.error("Get products failed");

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const result = productSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid product data",
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct(result.data);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ProductServiceError) {
      const status =
        error.code === "UNAUTHORIZED" ? 401 :
        error.code === "FORBIDDEN" ? 403 :
        error.code === "DUPLICATE_PRODUCT" ? 409 : 500;

      return NextResponse.json(
        { success: false, message: error.message, code: error.code },
        { status },
      );
    }

    console.error("Create product API failed");

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
